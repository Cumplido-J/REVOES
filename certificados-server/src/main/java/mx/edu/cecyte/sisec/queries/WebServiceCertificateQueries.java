package mx.edu.cecyte.sisec.queries;


import mx.edu.cecyte.sisec.dto.webServiceCertificate.EndPointStudentData;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.ScoreModule;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.ScoreModulePartial;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.SemesterUtilFilter;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.Subject;
import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.repo.StudentCareerModuleRepository;
import mx.edu.cecyte.sisec.repo.StudentSubjectPartialRepository;
import mx.edu.cecyte.sisec.repo.SubjectTypeRepository;
import mx.edu.cecyte.sisec.repo.catalogs.DiciplinaryRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolCareerRepository;
import mx.edu.cecyte.sisec.repo.mec.CertificateRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRepository;
import mx.edu.cecyte.sisec.repo.subjects.SubjectRepository;
import mx.edu.cecyte.sisec.repo.users.RoleRepository;
import mx.edu.cecyte.sisec.repo.users.UserRepository;
import mx.edu.cecyte.sisec.repo.users.UserRoleRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WebServiceCertificateQueries {

    @Autowired private StudentRepository studentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private SchoolCareerRepository schoolCareerRepository;
    @Autowired private UserRoleRepository userRoleRepository;
    @Autowired private StudentCareerModuleRepository studentCareerModuleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private DiciplinaryRepository diciplinaryRepository;
    @Autowired private CertificateRepository certificateRepository;
    @Autowired private StudentSubjectPartialRepository studentSubjectPartialRepository;
    @Autowired private SubjectTypeRepository subjectTypeRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private UserQueries userQueries;
    @Autowired private StudentQueries studentQueries;

    public User CreateUserStudent( EndPointStudentData endPointStudentData){

        User user = new User();

        boolean usernameExists = userQueries.usernameExists(endPointStudentData.getCurp());
        if (usernameExists) {
            user = userRepository.findByUsername(endPointStudentData.getCurp()).orElseThrow(() -> new AppException(Messages.user_wrongUsername+" :"+endPointStudentData.getCurp()));

        } else {
            user = new EndPointStudentData().createUser(endPointStudentData, passwordEncoder.encode(endPointStudentData.getMatricula()));
            user = userRepository.save(user);
        }

        return user;
    }

    public  void createRolStudent( User studentUser ){
        Role roleStudent = roleRepository.findById(AppCatalogs.ROLE_STUDENT).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        UserRole studentUserRole = new UserRole(studentUser, roleStudent);
        userRoleRepository.save(studentUserRole);
    }

    public Student createStudent( EndPointStudentData endPointStudentData, User user, SchoolCareer schoolCareer,
                                  boolean es_bach_tec, boolean certificado_parcial,boolean isAbrogado
    ){

        //CatDisciplinaryField catDisciplinaryField=studentQueries.catDisciplinaryFieldGetById(endPointStudentData.getCarrera());
        CatDisciplinaryField catDisciplinaryField=diciplinaryRepository.findById(endPointStudentData.getCampoDisciplinar()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        Student student = new Student();

        boolean studentExists = studentQueries.studentExists(user);
        if (studentExists) {

            student = new EndPointStudentData().updateStudent(endPointStudentData, user, schoolCareer, catDisciplinaryField, es_bach_tec, certificado_parcial, isAbrogado, studentQueries.getStudentByUsername(user.getUsername()));
        }else {
            student = new EndPointStudentData().createStudent(endPointStudentData, user, schoolCareer, catDisciplinaryField, es_bach_tec, certificado_parcial, isAbrogado);
        }
        //student=studentRepository.save(student);
        return studentRepository.save(student);
    }

    public void generateStudentModules(Student student, Set< CareerModule > careerModules) {
        Set< StudentCareerModule > studentCareerModules = new HashSet<>();

        if (student.getStudentCareerModules() !=null) {
            if (student.getStudentCareerModules().size() > 0) {
                studentCareerModuleRepository.deleteAll(student.getStudentCareerModules());
            }
        }
            for (CareerModule careerModule : careerModules) {
                StudentCareerModule studentCareerModule = new StudentCareerModule(student, careerModule, 0d);
                studentCareerModuleRepository.save(studentCareerModule);
                studentCareerModules.add(studentCareerModule);
            }

        student.setStudentCareerModules(studentCareerModules);
    }

    public List<StudentCareerModule> getCareerModule( Student student, List<ScoreModule> scoreModule ){
        List<StudentCareerModule> studentCareerModules= studentCareerModuleRepository.findAllByID(student.getId());
        studentCareerModules.stream().peek(
                studentCareerModule -> scoreModule.stream().map(scoreModule1 -> {
                          if (Objects.equals(studentCareerModule.getCareerModule().getId(), scoreModule1.getIdCarreraCompetencia())) {
                              studentCareerModule.setScore(scoreModule1.getCalificacion());
                          }
                    return studentCareerModule;
                }).collect(Collectors.toList())
        ).collect(Collectors.toList());

        studentCareerModuleRepository.saveAll(studentCareerModules);
        return studentCareerModules;
    }

    public Certificate generateValidetStudentCertificate(Student student, int certificateType){
        Certificate certificates =  new Certificate(student, certificateType);
        certificates.setOrigin("EXTERNO");
         return certificateRepository.save(certificates);
    }

    public boolean existeSchoolAndCareerInState(String schoolCCT, String careerKEY, Integer stateId){
        return schoolCareerRepository.getBySchoolIdAndCareerIdAndState(schoolCCT, careerKEY, stateId)>0;
    }

    public boolean countByIdAndStudyAreaIsNotNull(Integer id){
        return diciplinaryRepository.countByIdAndStudyAreaIsNotNull(id)>0;
    }

    public boolean countByIdSubjectType(Integer id){
        return subjectTypeRepository.countById(id)>0;
    }

    public boolean countBystudentSubjectPartial(Student student){

        return studentSubjectPartialRepository.countByStudent(student) > 0;
    }

    public List< StudentSubjectPartial > getCareerModulePartial( Student student, List< ScoreModulePartial> scoreModulePartiales ){

        if (countBystudentSubjectPartial(student)){
           List<StudentSubjectPartial> studentSubjectPartials = studentSubjectPartialRepository.findAllByStudent(student);
            System.out.println(studentSubjectPartials);
            if (studentSubjectPartials.size()>0){
                studentSubjectPartialRepository.deleteAll(studentSubjectPartials);
            }
        }

        List<Integer>  semester = new ArrayList<>();
        List< StudentSubjectPartial > studentSubjectPartials = scoreModulePartiales.stream().map(
                (scoreModulePartial) -> {
                    semester.add( scoreModulePartial.getSemestre() );
                    CatSubjectType subjectType = subjectTypeRepository.findById(scoreModulePartial.getTipoAsignatura()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
                    return new StudentSubjectPartial(student, scoreModulePartial, subjectType);
                }
        ).collect(Collectors.toList());

        List< StudentSubjectPartial > getAvailableStudentSubjects= getAvailableStudentSubjects(student,semester);
        studentSubjectPartials.addAll(getAvailableStudentSubjects);

        studentSubjectPartialRepository.saveAll(studentSubjectPartials);
        return studentSubjectPartials;
    }


    public List< StudentSubjectPartial> getAvailableStudentSubjects( Student student, List<Integer>  semester) {
        boolean cecyte = student.getSchoolCareer().getSchool().getSchoolType().getId().equals(AppCatalogs.SCHOOLTYPE_CECYTE);
        Subject subjectId = subjectRepository.findById(4).orElseThrow(() -> new AppException(Messages.database_cantFindResource));;
        List< StudentSubjectPartial > subjects = subjectRepository.findNoOptionals(cecyte).stream()
                .filter(subject -> SemesterUtilFilter.isNotSemester(subject,semester, subject.getSemester())).map(subject -> new StudentSubjectPartial(student, subject)).collect(Collectors.toList());
        List<StudentSubjectPartial> modules = student.getSchoolCareer().getCareer().getCareerModules().stream().map(careerModule -> new StudentSubjectPartial(student, careerModule, cecyte,subjectId))
                .filter(studentSubjectPartial -> SemesterUtilFilter.isNotSemesterByStudentSubject(studentSubjectPartial, semester, studentSubjectPartial.getPeriodNumber())).collect(Collectors.toList());

        subjects.addAll(modules);
        return  subjects;
    }


    public List< ScoreModulePartial> getAvailableStudentSubjectsTEST( SchoolCareer schoolCareer, List<Integer>  semester) {
        boolean cecyte = schoolCareer.getSchool().getSchoolType().getId().equals(AppCatalogs.SCHOOLTYPE_CECYTE);

        List< ScoreModulePartial > subjects = subjectRepository.findNoOptionals(cecyte).stream().filter(subject -> SemesterUtilFilter.isNotSemester(subject,semester, subject.getSemester())).map(ScoreModulePartial::new).collect(Collectors.toList());

        List<ScoreModulePartial> modules = schoolCareer.getCareer().getCareerModules().stream().map( careerModule -> new ScoreModulePartial( careerModule, cecyte ) ).filter(studentSubjectPartial -> SemesterUtilFilter.isNotSemesterByStudentSubjectTEST(studentSubjectPartial, semester, studentSubjectPartial.getSemestre() )).collect(Collectors.toList());

        subjects.addAll(modules);
        return  subjects.stream().sorted( Comparator.comparing(ScoreModulePartial::getSemestre) ).collect(Collectors.toList());
    }

}
