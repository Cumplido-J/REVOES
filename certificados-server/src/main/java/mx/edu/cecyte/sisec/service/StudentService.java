package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.classes.StudentFilter;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.certificado.CertificateData;
import mx.edu.cecyte.sisec.dto.masiveload.AlumnoCarga;
import mx.edu.cecyte.sisec.dto.masiveload.Periods;
import mx.edu.cecyte.sisec.dto.student.*;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.CatalogQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SubjectQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentService {
    @Autowired private StudentQueries studentQueries;
    @Autowired private UserQueries userQueries;
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private SubjectQueries subjectQueries;

    public List<StudentSearchResult> studentSearch(StudentFilter studentFilter, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(studentFilter.getStateId(),adminUser,AppCatalogs.isState);


        List<StudentSearchResult> result = studentQueries.studentSearch(studentFilter, availableSchoolIds);

        List<String> usedCurps = result.stream().map(StudentSearchResult::getCurp).collect(Collectors.toList());
        result.addAll(studentQueries.studentSearchOld(studentFilter, availableSchoolIds, usedCurps));

        return result;
    }

    public StudentData getStudentData(String studentCurp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(studentCurp);
        boolean studentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(adminUser, student);
        if (!studentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        return new StudentData(student);
    }

    public StudentData addNewStudent(StudentData studentData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);

        boolean schoolAvailableForAdmin = userQueries.isSchoolAvailableForAdmin(adminUser, studentData.getSchoolId());
        if (!schoolAvailableForAdmin) throw new AppException(Messages.school_noEditPermissions);

        boolean usernameExists = userQueries.usernameExists(studentData.getCurp());
        if (usernameExists) throw new AppException(Messages.user_usernameIsInUse);

        Student student = studentQueries.addNewStudent(studentData);
        auditingQueries.saveAudit("StudentService", "addNewStudent", adminId, Student.class, student.getId(), "Added new student, " + studentData);
        return new StudentData(student);
    }

    public StudentData editStudent(StudentData studentData, String studentCurp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(studentCurp);
        User user=userQueries.getUserByUsername(studentCurp);
        Integer schoolId = null;
        boolean isChoolNull = student.getSchoolCareer() == null ? true : false;
        if (isChoolNull == false) {
            schoolId = student.getSchoolCareer().getSchool().getId();
        } else {
            schoolId = student.getSchool().getId();
        }
        boolean isChange = (schoolId.equals(studentData.getSchoolId()))  ? false : true;
        if (isChange) {
            if (student.getIsPortability().equals(false)) {
                boolean isExistSubject = studentQueries.isExistSubject(student);
                if (isExistSubject) {
                    studentQueries.addStudentRecord(student, student.getSchoolCareer().getSchool().getId(), student.getSchoolCareer().getCareer().getId());
                    student.setAbrogadoCertificate(null);
                    student.setIsPortability(false);
                    student.setPartialCertificate(false);
                }
            }
        }
        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(adminUser, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);
        if (!studentCurp.equalsIgnoreCase(studentData.getCurp())) {
            if (userQueries.getRolesIdByUser(adminUser).contains(AppCatalogs.ROLE_DEV)) {
                boolean usernameExists = userQueries.usernameExists(studentData.getCurp());
                if (usernameExists) throw new AppException(Messages.user_usernameIsInUse);
            } else {
                studentData.setCurp(studentCurp);
            }
        }

        student = studentQueries.editStudent(student, studentData);
        userQueries.editStatusUser(user,studentData.getStudentStatusId());
        auditingQueries.saveAudit("StudentService", "editStudent", adminId, Student.class, student.getId(), "Edited student, " + studentData);
        return new StudentData(student);
    }

    public void editStudentPassword(String studentCurp, Integer adminId, StudentPasswordDto password) {
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(studentCurp);

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(adminUser, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        student = studentQueries.editStudentPassword(student, password.getPassword());
        auditingQueries.saveAudit("StudentService", "editStudentPassword", adminId, Student.class, student.getId(), "Edited student password");
    }

    public void reprobateStudent(String curp, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        student = studentQueries.reprobateStudent(student);
        auditingQueries.saveAudit("StudentService", "reprobateStudent", adminId, Student.class, student.getId(), "Student reprobate changed.");
    }

    public void addPortabilityModules(StudentPortability studentPortability, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(studentPortability.getCurp());

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        studentQueries.addPortabilityModules(student, studentPortability.getModules());
        auditingQueries.saveAudit("StudentService", "addPortabilityModules", adminId, Student.class, student.getId(), "Change portability modules.");
    }

    public List<StudentPortabilityModules> getStudentPortabilityModules(String curp, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        return studentQueries.getStudentPortabilityModules(student);
    }

    public List<StudentFormatCarrer> studentFormatDownload(StudentDataFormat studentDataFormat, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        List<StudentFormatCarrer> result = new ArrayList<>();
        List<Catalog> lista = catalogQueries.getCareersBySchoolId(studentDataFormat.getSchoolId().intValue());
        for(Catalog c: lista){
            List<StudentFormatResult> datos = studentQueries.getDataFormat(studentDataFormat, c.getId());
            if (datos.size() > 0) {
                result.add(new StudentFormatCarrer(c.getDescription1(), c.getDescription2(), studentQueries.getDataFormat(studentDataFormat, c.getId()), studentQueries.getCarrerModule(c.getId())));
            }
        }
        return result;
    }

    //servicio para actualizar isportability
    @Transactional
    public Boolean updateStudenForMasiveLoad(Double finalScore, Boolean reprobate, String CURP, String enrollmentStartDate,
                                             String enrollmentEndDate, String generation){
        Student student = studentQueries.getStudentByUsername(CURP);
        return studentQueries.updateStudenForMasiveLoad(student.getId(), finalScore, reprobate, enrollmentStartDate,
                enrollmentEndDate, generation);
    }

    //servicio para actualizar fullname de Alumno usuario
    @Transactional
    public void updateFullName(AlumnoCarga alumno) {
        User usuario = userQueries.getUserByUsername(alumno.getCurp());
        String fullnameUser=usuario.getName()+usuario.getFirstLastName()+usuario.getSecondLastName();
        String fullnameStudent= alumno.getNombre()+alumno.getPrimer_apellido()+alumno.getSegundo_apellido();
        if(!fullnameUser.equals(fullnameStudent))
        {
            userQueries.updateFullName(alumno.getNombre(), alumno.getPrimer_apellido(), alumno.getSegundo_apellido(), usuario.getId());
        }
    }

    @Transactional
    public void addPortabilityModules(StudentPortability studentPortability) {
        Student student = studentQueries.getStudentByUsername(studentPortability.getCurp());
        System.out.println("en service addPortabilityModules");
        studentQueries.addPortabilityModulesMasiveLoad(student, studentPortability.getModules());
        System.out.println("despues service addPortabilityModules");
    }

    public StudentData getStudentDataML(String studentCurp) {
        Student student = studentQueries.getStudentByUsernameML(studentCurp);
        if(student.getUser()==null){
            return null;
        }else{
            return new StudentData(student);
        }
    }

    public StudentCreditsUpdate updateCreditsStudent(StudentCreditsUpdate studentCreditsUpdate, String username) {
        Student student = studentQueries.getStudentByUsername(studentCreditsUpdate.getCurp());
        studentQueries.updateCreditsStudent(student, studentCreditsUpdate);
        return studentCreditsUpdate;
    }

    public StudentDeleteScore deleteScoreStudent(StudentDeleteScore studentDeleteScore) {
        studentQueries.StudentDeleteScore(studentDeleteScore.getPartialId());
        return studentDeleteScore;
    }

    public StudentSubjectRow addSubjectRow(StudentSubjectRow studentSubjectRow, String username, String userSessionUsername) {
        Student student = studentQueries.getStudentByUsername(username);
        studentQueries.addSubjectRow(student, studentSubjectRow);
        return studentSubjectRow;
    }

    public StudentRecord studentRecord(Integer id, String curp) {
        Student student = studentQueries.getStudentByUsername(curp);
        StudentRecordData data = new StudentRecordData(student);
        List<StudentRecordData> partials = new ArrayList<>();
        Boolean isExistRecord = studentQueries.isExisteRecors(student);
        if (isExistRecord) partials = studentQueries.selectStudentRecordPartial(student);

        List<StudentRecordScore> subjectData = new ArrayList<>();
        subjectData = studentQueries.selectSubjectData(student);
        Integer endign = studentQueries.countCertificate(1, student.getUser().getId());
        Integer partial = studentQueries.countCertificate(2, student.getUser().getId());
        Integer abrogate = studentQueries.countCertificate(3, student.getUser().getId());


        return new StudentRecord(student.getUser().getId(), endign, partial, abrogate, data, subjectData, partials);
    }

    public List<StudentRecordScore> selectRecordCourse(Integer adminId, Integer recordId) {
        StudentRecordPartial recordPartial = studentQueries.findByRecordId(recordId);
        Boolean isExistCourse = studentQueries.isExistCourse(recordPartial);
        List<StudentRecordScore> subjectPartial = new ArrayList<>();
        if (isExistCourse) subjectPartial = studentQueries.getSubjectPartial(recordPartial.getId());
        return subjectPartial;
    }

    public StudentRecordScore returnCourseRecors(Integer studentId, StudentRecordData studentRecordData) {
        Student student = studentQueries.getStudentById(studentId);
        studentQueries.addStudentRecord(student, student.getSchoolCareer().getSchool().getId(), student.getSchoolCareer().getCareer().getId());
        StudentRecordPartial recordPartial = studentQueries.findByRecordId(studentRecordData.getId());
        List<StudentRecordScore> subjectPartial = studentQueries.getSubjectPartial(recordPartial.getId());
        List<StudentSubjectPartial> partials = new ArrayList<>();
        for(StudentRecordScore score: subjectPartial){
            CatSubjectType type = subjectQueries.findBySubjectTypeId(score.getSubjectTypeId());
            partials.add(new StudentSubjectPartial(student, score, type));
        }
        studentQueries.returnCourseRecors(student, studentRecordData, recordPartial, partials);
        return null;
    }

    public List<CertificateData> selectIssuedCertificates(String curp, Integer certificateType) {
        Student student = studentQueries.getStudentByUsername(curp);
        StudentCertificatesIssued issued;
        List<CertificateData> datos = new ArrayList<>();
        if (studentQueries.isExistCertificate(certificateType, student.getUser().getId())) datos = studentQueries.selectIssuedCertificates(certificateType, student);
        return datos;
    }
    public Periods getPeriodosByStateGeneration(String entidad, String generacion){

        Periods periodos=null;
        periodos=studentQueries.getPeriodosByStateGeneration(entidad,generacion);
        return periodos;
    }

    public StudentRecordScore deleteRowRecord(Integer studentId, StudentRecordData studentRecordData) {
        Student student = studentQueries.getStudentById(studentId);
        StudentRecordPartial recordPartial = studentQueries.findByRecordId(studentRecordData.getId());
        studentQueries.deleteRowRecord(recordPartial);
        return null;
    }
    public List<StudentSearchResult> studentSearchCopy(String texto, Integer adminId, Integer stateId) {
        User adminUser = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,adminUser,AppCatalogs.isState);
        List<StudentSearchResult> result = studentQueries.studentSearchCopy(texto, availableSchoolIds);
        return result;
    }
    public void changeStatus(String curp, Boolean status,Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);
        User user=userQueries.getUserByUsername(curp);
        boolean studentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(adminUser, student);
        if (!studentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);
        studentQueries.editStatus(student,status);
        userQueries.editStatusUser(user,status);
    }
}
