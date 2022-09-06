package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.classes.StudentFilter;
import mx.edu.cecyte.sisec.dto.certificado.CertificateData;
import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudent;
import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudentModule;
import mx.edu.cecyte.sisec.dto.masiveload.Periods;
import mx.edu.cecyte.sisec.dto.dashboard.CountNew;
import mx.edu.cecyte.sisec.dto.profile.StudentProfileSurveys;
import mx.edu.cecyte.sisec.dto.student.*;
import mx.edu.cecyte.sisec.model.catalogs.*;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.model.education.Module;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordCourse;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordCourse_;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial_;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial_;
import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.model.users.User_;
import mx.edu.cecyte.sisec.queries.filters.StudentSearchFilter;
import mx.edu.cecyte.sisec.repo.CareerModuleRepository;
import mx.edu.cecyte.sisec.repo.StudentCareerModuleRepository;
import mx.edu.cecyte.sisec.repo.StudentSubjectPartialRepository;
import mx.edu.cecyte.sisec.repo.SubjectTypeRepository;
import mx.edu.cecyte.sisec.repo.catalogs.DiciplinaryRepository;
import mx.edu.cecyte.sisec.repo.education.CareerRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolCareerRepository;
import mx.edu.cecyte.sisec.repo.mec.CertificateRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRecordCourseRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRecordPartialRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRepository;
import mx.edu.cecyte.sisec.repo.users.RoleRepository;
import mx.edu.cecyte.sisec.repo.users.UserRepository;
import mx.edu.cecyte.sisec.repo.users.UserRoleRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class StudentQueries extends StudentSearchFilter {

    @Autowired private StudentRepository studentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private SchoolCareerRepository schoolCareerRepository;
    @Autowired private UserRoleRepository userRoleRepository;
    @Autowired private StudentCareerModuleRepository studentCareerModuleRepository;
    @Autowired private CareerModuleRepository careerModuleRepository;
    @Autowired private StudentSubjectPartialRepository studentSubjectPartialRepository;
    @Autowired private SubjectTypeRepository subjectTypeRepository;

    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EntityManager entityManager;
    @Autowired private DiciplinaryRepository diciplinaryRepository;
    @Autowired private CareerRepository careerRepository;
    @Autowired private StudentRecordPartialRepository studentRecordPartialRepository;
    @Autowired private StudentRecordCourseRepository studentRecordCourseRepository;
    @Autowired private CertificateRepository certificateRepository;


    public Student getStudentByUsername(String username) {
        return studentRepository.getByUsername(username).orElseThrow(() -> new AppException(Messages.student_doesntExist));
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id).orElseThrow(() -> new AppException(Messages.student_doesntExist));
    }

    public List<StudentSearchResult> studentSearch(StudentFilter studentFilter, Set<Integer> availableSchoolIds) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentSearchResult> criteriaQuery = builder.createQuery(StudentSearchResult.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentFilter.getStateId())) {
            predicateFilter = stateFilter(builder, student, studentFilter.getStateId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(studentFilter.getSchoolId())) {
            predicateFilter = schoolFilter(builder, student, studentFilter.getSchoolId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(studentFilter.getCareerId())) {
            predicateFilter = careerFilter(builder, student, studentFilter.getCareerId());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(studentFilter.getSearchText())) {
            predicateFilter = textFilter(builder, student, studentFilter.getSearchText());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(studentFilter.getStudentStatus())) {
            predicateFilter = studentStatusFilter(builder, student, studentFilter.getStudentStatus());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(studentFilter.getGeneration())) {
            predicateFilter = generationFilter(builder, student, studentFilter.getGeneration());
            predicates.add(predicateFilter);
        }
//        if (predicates.size() == 0) {
//            predicates.add(builder.equal(student.get(Student_.id), -1));
//        }

        predicateFilter = availableSchoolsFilter(availableSchoolIds, student);
        predicates.add(predicateFilter);

        criteriaQuery.select(builder.construct(
                StudentSearchResult.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.generation),
                student.get(Student_.user).get(User_.status)
        ));

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<StudentSearchResult> studentSearchOld(StudentFilter studentFilter, Set<Integer> availableSchoolIds, List<String> usedCurps) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentSearchResult> criteriaQuery = builder.createQuery(StudentSearchResult.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        Predicate predicateFilter;

        Path<School> school = student.get(Student_.school);
        Path<CatState> state = school.get(School_.city).get(CatCity_.state);

        if (AppFunctions.positiveInteger(studentFilter.getStateId())) {
            predicateFilter = builder.equal(state.get(CatState_.id), studentFilter.getStateId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(studentFilter.getSchoolId())) {
            predicateFilter = builder.equal(school.get(School_.id), studentFilter.getSchoolId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(studentFilter.getCareerId())) {
            predicates.add(builder.equal(student.get(Student_.id), -1));
        }
        if (!StringUtils.isEmpty(studentFilter.getSearchText())) {
            predicateFilter = textFilter(builder, student, studentFilter.getSearchText());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(studentFilter.getStudentStatus())) {
            predicateFilter = studentStatusFilter(builder, student, studentFilter.getStudentStatus());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(studentFilter.getGeneration())) {
            predicateFilter = generationFilter(builder, student, studentFilter.getGeneration());
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(student.get(Student_.id), -1));
        }

        predicateFilter = availableSchoolsFilterOld(availableSchoolIds, student);
        predicates.add(predicateFilter);

        if (usedCurps.size() > 0) {
            predicateFilter = builder.not(student.get(Student_.user).get(User_.username).in(usedCurps));
            predicates.add(predicateFilter);
        }

        criteriaQuery.select(builder.construct(
                StudentSearchResult.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                school.get(School_.cct),
                school.get(School_.name),
                student.get(Student_.generation)
        ));

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public CatDisciplinaryField catDisciplinaryFieldGetById(Integer carrerId) {
        Career career = careerRepository.findById(carrerId).orElseThrow(() -> new AppException("Error en el campo disciplinar"));
        CatDisciplinaryField catDisciplinaryField = null;
        if (career.getDisciplinaryField() != null) {
            catDisciplinaryField = career.getDisciplinaryField().getStudyArea() != null ? diciplinaryRepository.findById(career.getDisciplinaryField().getId()).get() : null;
        }
        return catDisciplinaryField;
    }

    public Student addNewStudent(StudentData studentData) {
        Role roleStudent = roleRepository.findById(AppCatalogs.ROLE_STUDENT).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        SchoolCareer schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerId(studentData.getSchoolId(), studentData.getCareerId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        User studentUser = new User(studentData, passwordEncoder.encode(studentData.getEnrollmentKey()));
        studentUser = userRepository.save(studentUser);
        UserRole studentUserRole = new UserRole(studentUser, roleStudent);
        userRoleRepository.save(studentUserRole);

        Student student = new Student(studentData, studentUser, schoolCareer);

        CatDisciplinaryField catDisciplinaryField = catDisciplinaryFieldGetById(studentData.getCareerId());
        if (catDisciplinaryField != null) {
            student.setDisciplinaryField(catDisciplinaryField);
        }

        Set<CareerModule> careerModules = schoolCareer.getCareer().getCareerModules();
        student = studentRepository.save(student);
        generateStudentModules(student, careerModules);
        return student;
    }

    private void generateStudentModules(Student student, Set<CareerModule> careerModules) {
        Set<StudentCareerModule> studentCareerModules = new HashSet<>();
        for (CareerModule careerModule : careerModules) {
            StudentCareerModule studentCareerModule = new StudentCareerModule(student, careerModule, 0d);
            studentCareerModuleRepository.save(studentCareerModule);
            studentCareerModules.add(studentCareerModule);
        }
        student.setStudentCareerModules(studentCareerModules);
    }

    public Student editStudent(Student student, StudentData studentData) {
        SchoolCareer schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerId(studentData.getSchoolId(), studentData.getCareerId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        String newPassword = passwordEncoder.encode(studentData.getEnrollmentKey());

        if (student.getSchoolCareer() != null && !student.getSchoolCareer().getId().equals(schoolCareer.getId())) {
            studentCareerModuleRepository.deleteAll(student.getStudentCareerModules());
            generateStudentModules(student, schoolCareer.getCareer().getCareerModules());
        }
        if (student.getSchoolCareer() == null && student.getSchool() != null) {
            student.setSchool(null);
            generateStudentModules(student, schoolCareer.getCareer().getCareerModules());
        }


        student.editStudentData(studentData, newPassword, schoolCareer);
        CatDisciplinaryField catDisciplinaryField = catDisciplinaryFieldGetById(studentData.getCareerId());
        if (catDisciplinaryField != null) {
            student.setDisciplinaryField(catDisciplinaryField);
        }
        return studentRepository.save(student);
    }

    public Student editStudentPassword(Student student, String newPassword) {
        newPassword = passwordEncoder.encode(newPassword);
        student.getUser().setPassword(newPassword);
        return studentRepository.save(student);
    }

    public List<Student> getListStudentByUsernames(List<String> usernames) {
        return studentRepository.findAllByUsername(usernames);
    }

    public Student acceptPrivacy(Student student) {
        student.setNoticeOfPrivacyAccepted(true);
        return studentRepository.save(student);
    }

    public Student updateStudentCareer(Student student, SchoolCareer schoolCareer) {
        student.setSchoolCareer(schoolCareer);
        student.setSchool(null);
        return studentRepository.save(student);
    }

    public List<StudentProfileSurveys> getAvailableSurveys(Student student) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
        Date current = new Date();
        int dias = 0;
        int diasFaltante = 0;
        Date fechaStart;
        Date fechaExpire;
        //calcula dias faltantes y dias restantes
        try {
            String fechaActual = simpleDateFormat.format(current);
            Date fechaA = simpleDateFormat.parse(fechaActual);
            fechaStart = simpleDateFormat.parse("01/04/2022");
            fechaExpire = simpleDateFormat.parse("05/07/2022");
            long startTime = fechaA.getTime();
            long endTime = fechaExpire.getTime();
            long diffTime = endTime - startTime;
            long diffDays = diffTime / (1000 * 60 * 60 * 24);

            long diffTime2 = fechaStart.getTime() - fechaA.getTime();
            long diffDays2 = diffTime2 / (1000 * 60 * 60 * 24);

            diasFaltante = (int) diffDays2;
            dias = (int) diffDays;
        } catch (ParseException ignored) {
            Calendar tempDate = Calendar.getInstance();
            tempDate.add(Calendar.DATE, -5);
            fechaStart = tempDate.getTime();
            fechaExpire = tempDate.getTime();
        }
        List<StudentProfileSurveys> surveys = new ArrayList<>();
        if (diasFaltante < 1 && dias > 0 && student.getSurveyIntentions2022() == null && student.getSchoolCareer() != null && student.getGeneration().equals("2019-2022")) {
            surveys.add(new StudentProfileSurveys("Encuesta de seguimiento de egresados 2022", "/EncuestaIntenciones2022", fechaStart, fechaExpire, null));
        } else if (diasFaltante < 1 && dias > 0 && student.getSurveyIntentions2022() != null && student.getSchoolCareer() != null && student.getGeneration().equals("2019-2022")) {
            String folio = student.getSurveyIntentions2022().getConfirmationFolio();
            surveys.add(new StudentProfileSurveys("Encuesta de seguimiento de egresados 2022", null, fechaStart, fechaExpire, folio));
        }
        return surveys;
    }

    public Student reprobateStudent(Student student) {
        student.setReprobate(!student.getReprobate());
        return studentRepository.save(student);
    }

    public Student editStudentModules(Student student, CertificateEditStudent certificateEditStudent) {
        Set<StudentCareerModule> careerModules = student.getStudentCareerModules();
        System.out.println("----");
        for (CertificateEditStudentModule module : certificateEditStudent.getModules()) {
            StudentCareerModule careerModule = careerModules.stream()
                    .filter(studentCareerModule -> studentCareerModule.getId().equals(module.getId()))
                    .findFirst().orElse(null);
            if (careerModule == null) continue;
            careerModule.setScore(module.getScore());
            System.out.println("+--> "+module.getName());
        }
        student.setFinalScore(certificateEditStudent.getFinalScore());
        student.setEnrollmentStartDate(certificateEditStudent.getEnrollmentStartDate());
        student.setEnrollmentEndDate(certificateEditStudent.getEnrollmentEndDate());
        if (certificateEditStudent.getIsPortability() == 0) {
            student.setIsPortability(false);
        }
        if (certificateEditStudent.getIsAbrogado() == 0) {
            student.setAbrogadoCertificate(false);
        }
        if (certificateEditStudent.getIsAbrogado() == 2) {
            student.setAbrogadoCertificate(true);
        }
        if (certificateEditStudent.getDisciplinaryCompetence() != 0) {
            CatDisciplinaryField catDisciplinaryField = diciplinaryRepository.findById(certificateEditStudent.getDisciplinaryCompetence()).get();
            student.setDisciplinaryField(catDisciplinaryField);
        }
        student.setPartialCertificate(false);
        certificateEditStudent.getModules().forEach(score -> {
            if (score.getScore() < 6) {
                student.setReprobate(true);
            }
        });
        return studentRepository.save(student);
    }

    public CertificateEditStudent getStudentModules(Student student) {
        if (student.getStudentCareerModules().size() == 0)
            generateStudentModules(student, student.getSchoolCareer().getCareer().getCareerModules());
        return new CertificateEditStudent(student);
    }

    public void addPortabilityModules(Student student, List<StudentPortabilityModules> modules) {
        Set<StudentCareerModule> newModules = new HashSet<>();
        studentCareerModuleRepository.deleteAll(student.getStudentCareerModules());
        for (StudentPortabilityModules module : modules) {
            CareerModule careerModule = careerModuleRepository.findById(module.getId())
                    .orElseThrow(() -> new AppException(Messages.database_cantFindResource));
            StudentCareerModule studentCareerModule = new StudentCareerModule(student, careerModule, module.getScore());
            studentCareerModuleRepository.save(studentCareerModule);
            newModules.add(studentCareerModule);
        }
        student.setStudentCareerModules(newModules);
        student.setIsPortability(true);
        student.setPartialCertificate(false);
        student.setAbrogadoCertificate(false);
        studentRepository.save(student);
    }

    public List<StudentPortabilityModules> getStudentPortabilityModules(Student student) {
        if (student.getStudentCareerModules().size() == 0) {
            return student.getSchoolCareer().getCareer().getCareerModules()
                    .stream()
                    .map(StudentPortabilityModules::new)
                    .collect(Collectors.toList());
        }
        return student.getStudentCareerModules()
                .stream()
                .map(StudentPortabilityModules::new)
                .collect(Collectors.toList());
    }

    public void addStudentSubjects(Student student, StudentSemesters semesters) {
        Set<StudentSubjectPartial> existentSubjects = student.getSubjects();
        if (existentSubjects.size() != 0) studentSubjectPartialRepository.deleteAll(existentSubjects);
        List<StudentSubjectPartial> subjects = new ArrayList<>();

        for (StudentSubject studentSubject : semesters.getSubjects()) {
            CatSubjectType subjectType = subjectTypeRepository.findById(studentSubject.getSubjectTypeId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
            StudentSubjectPartial subject = new StudentSubjectPartial(student, studentSubject, subjectType);
            subjects.add(subject);
        }
        studentSubjectPartialRepository.saveAll(subjects);

        student.editStudentSubjects(semesters, subjects);
        studentRepository.save(student);
    }

    public List<StudentFormatResult> getDataFormat(StudentDataFormat studentDataFormat, Integer carrerId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> criteriaQuery = builder.createQuery(Object[].class);

        Root<Student> student = criteriaQuery.from(Student.class);

        Join<Student, User> users = student.join("user", JoinType.INNER);
        Join<Student, SchoolCareer> schoolsCarrer = student.join("schoolCareer");
        Join<SchoolCareer, School> schools = schoolsCarrer.join("school");
        Join<SchoolCareer, Career> carrers = schoolsCarrer.join("career");
        Join<School, CatCity> catcitys = schools.join("city");

        predicates.add(builder.equal(student.get(Student_.generation), studentDataFormat.getGeneration()));
        predicates.add(builder.equal(catcitys.get(CatCity_.state), studentDataFormat.getStateId()));
        predicates.add(builder.equal(schools.get(School_.id), studentDataFormat.getSchoolId()));
        predicates.add(builder.equal(carrers.get(Career_.id), carrerId));
        predicates.add(builder.equal(student.get(Student_.status), 1));

        criteriaQuery.multiselect(
                users.get(User_.username),
                users.get(User_.name),
                users.get(User_.firstLastName),
                users.get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                schools.get(School_.cct),
                schools.get(School_.name),
                carrers.get(Career_.careerKey),
                carrers.get(Career_.name),
                student.get(Student_.generation)
        );
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(carrers.get(Career_.id)), builder.asc(student.get(Student_.enrollmentKey)));
        TypedQuery<Object[]> typedQuery = entityManager.createQuery(criteriaQuery);
        List<StudentFormatResult> resultList = new ArrayList<>();
        for (Object[] row : typedQuery.getResultList()) {
            if (row[3] != null) {
                row[3] = row[3].toString();
            } else {
                row[3] = "";
            }
            resultList.add(new StudentFormatResult(
                    row[0].toString(),
                    row[1].toString(),
                    row[2].toString(),
                    row[3].toString(),
                    row[4].toString(),
                    row[5].toString(),
                    row[6].toString(),
                    row[7].toString(),
                    row[8].toString(),
                    row[9].toString()
            ));
        }
        return resultList;
    }

    public List<StudentFormatModule> getCarrerModule(Integer carrerId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentFormatModule> criteriaQuery = builder.createQuery(StudentFormatModule.class);
        Root<CareerModule> careerModuleRoot = criteriaQuery.from(CareerModule.class);
        Root<Module> moduleRoot = criteriaQuery.from(Module.class);
        predicates.add(builder.equal(careerModuleRoot.get(CareerModule_.module), moduleRoot.get(Module_.id)));
        predicates.add(builder.equal(careerModuleRoot.get(CareerModule_.career), carrerId));
        criteriaQuery.multiselect(
                moduleRoot.get(Module_.id),
                moduleRoot.get(Module_.module),
                careerModuleRoot.get(CareerModule_.id),
                careerModuleRoot.get(CareerModule_.order)
        );
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(careerModuleRoot.get(CareerModule_.order)));
        TypedQuery<StudentFormatModule> typedQuery = entityManager.createQuery(criteriaQuery);
        List<StudentFormatModule> moduleList = typedQuery.getResultList();

        return moduleList;
    }

    public Student cancelCertificateStudent(Student student) {
        student.setPartialCertificate(false);
        return studentRepository.save(student);
    }

    //modulos para carga masiuva
    //actualiza campos en la carga del excel
    public Boolean updateStudenForMasiveLoad(Integer student_id, Double finalScore, Boolean reprobate, String enrollmentStartDate,
                                             String enrollmentEndDate, String generation) {
        int afectados = 0;
        afectados = studentRepository.updateStudenForMasiveLoad(student_id, finalScore, reprobate, enrollmentStartDate, enrollmentEndDate, generation);
        if (afectados != 0) {
            return true;
        } else {
            return false;
        }
    }

    public void addPortabilityModulesMasiveLoad(Student student, List<StudentPortabilityModules> modules) {
        System.out.println("previo a borrar modulos");
        //obtenemos si hay actuales
        List<StudentCareerModule> modulosActuales = studentCareerModuleRepository.findAllByID(student.getId());
        for (StudentCareerModule k : modulosActuales) {
            System.out.println("modulos actuales" + k.toString());
        }
        if (modulosActuales.size() > 0) {
            System.out.println("biortrando modulos");
            studentCareerModuleRepository.deleteAll(student.getStudentCareerModules());
        }
        System.out.println("despues de borrar modulos");
        for (StudentPortabilityModules module : modules) {
            CareerModule careerModule = careerModuleRepository.findById(module.getId())
                    .orElseThrow(() -> new AppException(Messages.database_cantFindResource));
            StudentCareerModule studentCareerModule = new StudentCareerModule(student, careerModule, module.getScore());
            studentCareerModuleRepository.saveAndFlush(studentCareerModule);
        }
        System.out.println("despues de insertar modulos");
    }

    public Student getStudentByUsernameML(String username) {
        Student es = studentRepository.getByUsername(username).orElse(es = new Student());
        return es;
    }

    public List<Student> getByStudentSchoolCareer(SchoolCareer schoolCareer) {
        return studentRepository.findBySchoolCareer(schoolCareer);
    }

    public List<Student> careerChange(List<Student> student, SchoolCareer schoolChange) {
        student.forEach(studentData -> studentData.setSchoolCareer(schoolChange));
        return studentRepository.saveAll(student);
    }

    public Integer getCountBySchoolCareer(SchoolCareer schoolCareer) {
        return studentRepository.countBySchoolCareer(schoolCareer);
    }

    public void getUpdateStudentSubject(Student student, StudentSubjectUpdate subject, CatSubjectType subjectType) {
        StudentSubjectPartial periodNumber = studentSubjectPartialRepository.findById(subject.getPartialId()).filter(partial -> partial.getPeriodNumber() > 0).get();
        StudentSubjectPartial partial = new StudentSubjectPartial(student, subject, subjectType, periodNumber.getPeriodNumber());
        studentSubjectPartialRepository.save(partial);
        updateStudentByPartial(subject.getStudentId());
    }

    public void updateStudentByPartial(Integer studentId) {
        User user = userRepository.findById(studentId).orElseThrow(() -> new AppException("Nose puede actualizar por invalidación de usuario de alumno"));
        Student student = studentRepository.findByUser(user).orElseThrow(() -> new AppException("Nose puede actualizar por invalidación de usuario de alumno"));
        student.setPartialCertificate(true);
        studentRepository.save(student);
    }

    public void updateCreditsStudent(Student student, StudentCreditsUpdate studentCreditsUpdate) {
        student.editStudentSubjects(studentCreditsUpdate.getObtainedCredits(), studentCreditsUpdate.getFinalScore());
        student.setPartialCertificate(true);
        studentRepository.save(student);
    }

    public void StudentDeleteScore(Integer PartialId) {
        studentSubjectPartialRepository.deleteById(PartialId);
    }

    public void addSubjectRow(Student student, StudentSubjectRow studentSubjectRow) {
        System.out.println("---" + student.getId() + "---" + student.getSchoolCareer().getSchool().getCct());
        CatSubjectType subjectType = subjectTypeRepository.findById(studentSubjectRow.getSubjectTypeId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        StudentSubjectPartial subjectPartial = new StudentSubjectPartial();
        subjectPartial.setStudent(student);
        subjectPartial.setCct(student.getSchoolCareer().getSchool().getCct());
        subjectPartial.setName(studentSubjectRow.getName());
        subjectPartial.setScore(studentSubjectRow.getScore());
        subjectPartial.setScholarPeriod(studentSubjectRow.getPeriod());
        subjectPartial.setHours(studentSubjectRow.getHours());
        subjectPartial.setCredits(studentSubjectRow.getCredits());
        subjectPartial.setSubjectType(subjectType);
        subjectPartial.setPeriodNumber(studentSubjectRow.getSemester());
        studentSubjectPartialRepository.save(subjectPartial);
    }

    public Boolean isExistSubject(Student student) {
        return studentSubjectPartialRepository.isExistSubject(student.getUser().getId()) > 0;
    }

    public List<StudentRecordScore> selectSubjectData(Student student) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentRecordScore> criteriaQuery = builder.createQuery(StudentRecordScore.class);

        Root<StudentSubjectPartial> partial = criteriaQuery.from(StudentSubjectPartial.class);

        predicates.add(builder.equal(partial.get(StudentSubjectPartial_.student).get(Student_.user).get(User_.id), student.getUser().getId()));

        criteriaQuery.select(builder.construct(
                StudentRecordScore.class,
                partial.get(StudentSubjectPartial_.id),
                partial.get(StudentSubjectPartial_.cct),
                partial.get(StudentSubjectPartial_.subjectType).get(CatSubjectType_.id),
                partial.get(StudentSubjectPartial_.subjectType).get(CatSubjectType_.name),
                partial.get(StudentSubjectPartial_.name),
                partial.get(StudentSubjectPartial_.score),
                partial.get(StudentSubjectPartial_.hours),
                partial.get(StudentSubjectPartial_.credits),
                partial.get(StudentSubjectPartial_.scholarPeriod),
                partial.get(StudentSubjectPartial_.periodNumber)

        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(partial.get(StudentSubjectPartial_.periodNumber)));
        TypedQuery<StudentRecordScore> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getResultList();

    }

    public void addStudentRecord(Student student, Integer schoolId, Integer careerId) {
        SchoolCareer school = schoolCareerRepository.findAll().stream().filter(s -> s.getSchool().getId().equals(schoolId) && s.getCareer().getId().equals(careerId)).findFirst().get();
        student.setSchool(school.getSchool());
        student.getSchoolCareer().setCareer(school.getCareer());
        boolean partialC = (student.getPartialCertificate() == null || student.getPartialCertificate().equals(true)) ? false : true;
        boolean ending = (student.getIsPortability() == null || student.getIsPortability().equals(false)) ? false : true;
        boolean abrogate = (student.getAbrogadoCertificate() == null || student.getAbrogadoCertificate().equals(false)) ? false : true;
        Integer type = 0;
        if (partialC) type = 2;
        if (ending) type = 1;
        if (abrogate) type = 3;
        StudentRecordPartial partial = new StudentRecordPartial(student, type);
        studentRecordPartialRepository.save(partial);

        StudentRecordPartial recordPartial = studentRecordPartialRepository.findAll().stream().filter(s -> s.getSchool().getId().equals(schoolId) && s.getCareer().getId().equals(careerId)).findFirst().get();
        addSubjectRecord(student, recordPartial);
    }

    public void addSubjectRecord(Student student, StudentRecordPartial recordPartial) {
        List<StudentSubjectPartial> partial = studentSubjectPartialRepository.findAll().stream().filter(st -> st.getStudent().equals(student)).collect(Collectors.toList());
        List<StudentRecordCourse> course = new ArrayList<>();
        for (StudentSubjectPartial p : partial) {
            course.add(new StudentRecordCourse(recordPartial, p.getCct(), p.getSubjectType(), p.getName(), p.getScore(), p.getHours(), p.getCredits(), p.getScholarPeriod(), p.getPeriodNumber()));
        }
        List<StudentRecordCourse> list = studentRecordCourseRepository.saveAll(course);
        if (list.size() > 0) {
            studentSubjectPartialRepository.deleteAll(partial);
        }
    }

    public Boolean isExisteRecors(Student student) {
        return studentRecordPartialRepository.isExistRecordStudent(student.getUser().getId()) > 0;
    }

    public List<StudentRecordData> selectStudentRecordPartial(Student student) {
        List<StudentRecordData> data = new ArrayList<>();
        List<StudentRecordPartial> partials = studentRecordPartialRepository.findByStudentId(student.getUser().getId());
        partials.forEach(r -> {
            data.add(new StudentRecordData(
                    r.getId(), r.getUser().getUsername(), r.getUser().getName(), r.getUser().getFirstLastName(),
                    r.getUser().getSecondLastName(), r.getUser().getEmail(), r.getEnrollmentKey(),
                    r.getSchool().getCity().getState().getId(), r.getSchool().getCity().getState().getName(),
                    r.getSchool().getId(), r.getSchool().getName(), r.getCareer().getId(), r.getCareer().getName(),
                    r.getSchool().getCct(), r.getEnrollmentStartDate(), r.getEnrollmentEndDate(),
                    r.getUser().getStudent().getStatus(), r.getGeneration(), r.getUser().getStudent().getIsPortability(),
                    r.getUser().getStudent().getPartialCertificate(), r.getUser().getStudent().getAbrogadoCertificate()
            ));

        });
        return data;

    }

    public boolean isExistCourse(StudentRecordPartial partial) {
        return studentRecordCourseRepository.findAll().stream().filter(course -> course.getStudentRecordPartial().getId().equals(partial.getId())).count() > 0;
    }

    public StudentRecordPartial findByRecordId(Integer recordId) {
        return studentRecordPartialRepository.findByRecordId(recordId);
    }

    public List<StudentRecordScore> getSubjectPartial(Integer recordId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentRecordScore> criteriaQuery = builder.createQuery(StudentRecordScore.class);

        Root<StudentRecordCourse> partial = criteriaQuery.from(StudentRecordCourse.class);

        predicates.add(builder.equal(partial.get(StudentRecordCourse_.studentRecordPartial).get(StudentRecordPartial_.id), recordId));

        criteriaQuery.select(builder.construct(
                StudentRecordScore.class,
                partial.get(StudentRecordCourse_.id),
                partial.get(StudentRecordCourse_.cct),
                partial.get(StudentRecordCourse_.subjectType).get(CatSubjectType_.id),
                partial.get(StudentRecordCourse_.subjectType).get(CatSubjectType_.name),
                partial.get(StudentRecordCourse_.name),
                partial.get(StudentRecordCourse_.score),
                partial.get(StudentRecordCourse_.hours),
                partial.get(StudentRecordCourse_.credits),
                partial.get(StudentRecordCourse_.scholarPeriod),
                partial.get(StudentRecordCourse_.periodNumber)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(partial.get(StudentRecordCourse_.periodNumber)));
        TypedQuery<StudentRecordScore> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getResultList();
    }

    public void returnCourseRecors(Student student, StudentRecordData data, StudentRecordPartial recordPartial, List<StudentSubjectPartial> partials) {
        if (partials.size() > 0) {
            List<StudentSubjectPartial> partialList = studentSubjectPartialRepository.saveAll(partials);
            if (partialList.size() > 0) {
                SchoolCareer schoolCareer = schoolCareerRepository.findAll().stream().filter(sc -> sc.getSchool().getId().equals(data.getSchoolId()) && sc.getCareer().getId().equals(data.getCareerId())).findFirst().get();
                if (recordPartial.getTypeCertificate() == 0) {
                    student.setAbrogadoCertificate(null);
                    student.setIsPortability(false);
                    student.setPartialCertificate(false);
                }
                if (recordPartial.getTypeCertificate() == 1) student.setIsPortability(true);
                if (recordPartial.getTypeCertificate() == 2) student.setPartialCertificate(true);
                if (recordPartial.getTypeCertificate() == 3) student.setAbrogadoCertificate(true);

                student.setSchoolCareer(schoolCareer);
                studentRepository.save(student);
                List<StudentRecordCourse> recordCourses = studentRecordCourseRepository.findAll().stream().filter(score -> score.getStudentRecordPartial().getId().equals(recordPartial.getId())).collect(Collectors.toList());
                studentRecordCourseRepository.deleteAll(recordCourses);
                studentRecordPartialRepository.delete(recordPartial);
            }
        } else {
            SchoolCareer schoolCareer = schoolCareerRepository.findAll().stream().filter(sc -> sc.getSchool().getId().equals(data.getSchoolId()) && sc.getCareer().getId().equals(data.getCareerId())).findFirst().get();
            if (recordPartial.getTypeCertificate() == 0) {
                student.setAbrogadoCertificate(null);
                student.setIsPortability(false);
                student.setPartialCertificate(false);
            }
            if (recordPartial.getTypeCertificate() == 1) student.setIsPortability(true);
            if (recordPartial.getTypeCertificate() == 2) student.setPartialCertificate(true);
            if (recordPartial.getTypeCertificate() == 3) student.setAbrogadoCertificate(true);

            student.setSchoolCareer(schoolCareer);
            studentRepository.save(student);
            List<StudentRecordCourse> recordCourses = studentRecordCourseRepository.findAll().stream().filter(score -> score.getStudentRecordPartial().getId().equals(recordPartial.getId())).collect(Collectors.toList());
            studentRecordCourseRepository.deleteAll(recordCourses);
            studentRecordPartialRepository.delete(recordPartial);
        }
    }

    public boolean isExistCertificate(Integer type, Integer studentId) {
        return certificateRepository.countCertificateTypeeAndStudent(type, studentId) > 0;

    }

    public Integer countCertificate(Integer type, Integer studentId) {
        Integer count = certificateRepository.countCertificateTypeeAndStudent(type, studentId);
        Integer result = 0;
        if (count > 0) result = count;
        else result = 0;
        return result;
    }

    public List<CertificateData> selectIssuedCertificates(Integer type, Student student) {
        List<CertificateData> list = new ArrayList<>();
        List<Certificate> certifica = certificateRepository.selectRowFindByType(student.getUser().getId(), type);
        try {
            if (certifica.size() > 0) {
                certifica.forEach(r -> {
                    String fechaSep = "";
                    String name = r.getStudent().getUser().getSecondLastName() != null ? r.getStudent().getUser().getName() + " " + r.getStudent().getUser().getFirstLastName() + " " + r.getStudent().getUser().getSecondLastName() : r.getStudent().getUser().getName() + " " + r.getStudent().getUser().getFirstLastName();
                    if (r.getDateSep() == null) fechaSep = "";
                    else fechaSep = r.getDateSep();
                    list.add(new CertificateData(r.getFolio(), name, r.getStudent().getUser().getUsername(), r.getStudent().getSchool().getName(), fechaSep, r.getStatus(), r.getCertificateTypeId().toString(), r.getStudent().getFinalScore(), AppFunctions.scoreToLetter(r.getStudent().getFinalScore()), r.getStudent().getSchoolCareer().getCareer().getName(), r.getStudent().getSchool().getCity().getState().getName(), fechaSep, "", ""));
                });
            }

        } catch (Exception exception) {
            throw new AppException("Collección de registro con datos vacios.");
        }
        return list;
    }

    //para carga CTE
    public Periods getPeriodosByStateGeneration(String entidad, String generacion) {

        Periods periodos = null;
        periodos = studentRepository.getPeriodosByStateGeneration(entidad, generacion);
        return periodos;
    }

    private String gen1 = "H";
    private String gen2 = "M";

    public String newGeneration() {
        Calendar fecha = Calendar.getInstance();
        int year = fecha.get(Calendar.YEAR);
        int mes = fecha.get(Calendar.MONTH) + 1;
        int dia = fecha.get(Calendar.DAY_OF_MONTH);
        String ngeneration;
        if (mes >= 8) {
            ngeneration = year + "-" + (year + 3);
        } else {
            int yearAnt = year - 1;
            ngeneration = yearAnt + "-" + (yearAnt + 3);
        }
        return ngeneration;
    }

    private String generation = newGeneration();

    public List<CountNew> getConteo() {
        List<CountNew> result = new ArrayList<>();
        //System.out.println(newGeneration());
        Integer total = studentRepository.countByGeneration(generation);
        Integer hombre = studentRepository.countByGenerationAndGender(generation, gen1);
        Integer mujer = studentRepository.countByGenerationAndGender(generation, gen2);
        result.add(new CountNew(total, hombre, mujer));
        return result;
    }

    public List<CountNew> getConteoState(Integer stateId) {
        List<CountNew> result = new ArrayList<>();
        Integer total = studentRepository.countByGenerationAndState(generation, stateId);
        Integer hombre = studentRepository.countByGenerationAndGenderAndState(generation, gen1, stateId);
        Integer mujer = studentRepository.countByGenerationAndGenderAndState(generation, gen2, stateId);
        result.add(new CountNew(total, hombre, mujer));
        return result;
    }

    public List<CountNew> getConteoStateAndSchool(Integer stateId, Integer schoolId) {
        List<CountNew> result = new ArrayList<>();
        Integer total = studentRepository.countByGenerationAndStateAndSchool(generation, stateId, schoolId);
        Integer hombre = studentRepository.countByGenerationAndGenderAndStateAndSchool(generation, gen1, stateId, schoolId);
        Integer mujer = studentRepository.countByGenerationAndGenderAndStateAndSchool(generation, gen2, stateId, schoolId);
        result.add(new CountNew(total, hombre, mujer));
        return result;
    }

    public List<CountNew> getConteoSchool(Integer schoolId) {
        List<CountNew> result = new ArrayList<>();
        Integer total = studentRepository.countByGenerationAndSchool(generation, schoolId);
        Integer hombre = studentRepository.countByGenerationAndGenderAndSchool(generation, gen1, schoolId);
        Integer mujer = studentRepository.countByGenerationAndGenderAndSchool(generation, gen2, schoolId);
        result.add(new CountNew(total, hombre, mujer));
        return result;
    }

    public void deleteRowRecord(StudentRecordPartial recordPartial) {
        boolean isExist = isExistCourse(recordPartial);
        studentRecordPartialRepository.delete(recordPartial);
        if (isExist){
            List<StudentRecordCourse> recordCourses = studentRecordCourseRepository.findAll().stream().filter(score -> score.getStudentRecordPartial().getId().equals(recordPartial.getId())).collect(Collectors.toList());
            studentRecordCourseRepository.deleteAll(recordCourses);
        }
    }

    public boolean studentExists(User user) {
        return studentRepository.countByUser(user) > 0;
    }

    private boolean validarCURP(String curp) {
        String regex =
                "[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
                        "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
                        "[HM]{1}" +
                        "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
                        "[B-DF-HJ-NP-TV-Z]{3}" +
                        "[0-9A-Z]{1}[0-9]{1}$";

        Pattern patron = Pattern.compile(regex);
        if(!patron.matcher(curp).matches()){
            return false;
        }else {
            return true;
        }
    }
    private boolean validarControl(String cadena){
        boolean isNumerico=cadena.matches("[+-]?\\d*(\\.\\d+)?");
        if(!isNumerico){
            return false;
        }else{
            return true;
        }
    }
    public List<StudentSearchResult> studentSearchCopy(String texto, Set<Integer> availableSchoolIds) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentSearchResult> criteriaQuery = builder.createQuery(StudentSearchResult.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        Predicate predicateFilter;
        ///validar si es CURP, NUMControl o texto
        boolean isCurp=validarCURP(texto);
        boolean isnControl=validarControl(texto);
        if (isCurp){
            if (!StringUtils.isEmpty(texto)) {
                predicateFilter = curpFilter(builder, student, texto);
                predicates.add(predicateFilter);
            }
        }else if(isnControl){
            if (!StringUtils.isEmpty(texto)) {
                predicateFilter = nuControlFilter(builder, student, texto);
                predicates.add(predicateFilter);
            }
        }else{
            if (!StringUtils.isEmpty(texto)) {
                predicateFilter = textFilterCopy(builder, student, texto);
                predicates.add(predicateFilter);
            }
        }
        predicateFilter=availableSchoolsFilter(availableSchoolIds,student);
        predicates.add(predicateFilter);

        criteriaQuery.select(builder.construct(
                StudentSearchResult.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.generation),
                student.get(Student_.user).get(User_.status)
        ));

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }
    public Student editStatus(Student student,Boolean status){
        student.editStatus(status);
        return studentRepository.save(student);

    }
}
