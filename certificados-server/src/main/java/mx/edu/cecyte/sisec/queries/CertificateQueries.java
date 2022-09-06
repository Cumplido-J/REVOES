package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.classes.certificate.*;
import mx.edu.cecyte.sisec.dto.catalogs.ConfigPeriodData;
import mx.edu.cecyte.sisec.dto.degree.CancelStampExternal;
import mx.edu.cecyte.sisec.dto.school.SchoolEquivalentData;
import mx.edu.cecyte.sisec.model.catalogs.*;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.mec.CertificateStatus;
import mx.edu.cecyte.sisec.model.mec.Certificate_;
import mx.edu.cecyte.sisec.model.met.CanceledStamps;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial_;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.User_;
import mx.edu.cecyte.sisec.queries.filters.CertificateFilter;
import mx.edu.cecyte.sisec.repo.catalogs.ConfigPeriodCertificateRepository;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.degree.CanceledStampsRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolEquivalentRepository;
import mx.edu.cecyte.sisec.repo.mec.CertificateRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CertificateQueries extends CertificateFilter {
    @Autowired private CertificateRepository certificateRepository;
    @Autowired private EntityManager entityManager;
    @Autowired private SchoolEquivalentRepository schoolEquivalentRepository;
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private ConfigPeriodCertificateRepository configPeriodCertificateRepository;
    @Autowired private StateRepository stateRepository;
    @Autowired private CanceledStampsRepository canceledStampsRepository;

    public List<Certificate> validateStudents(List<Student> students, Integer certificateType) {
        List<Certificate> certificates = students.stream().map(student -> new Certificate(student, certificateType)).collect(Collectors.toList());
        return certificateRepository.saveAll(certificates);
    }

    public List<Certificate> getCertificatesByFilename(List<String> fileNames) {
        return certificateRepository.findAllByFileName(fileNames);
    }

    public Certificate findInProcessByFileName(String fileName) {
        return certificateRepository.findInProcessByFileName(fileName, CertificateStatus.inProcess).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Certificate findValidatedByUsername(String username) {
        return certificateRepository.findByUsernameAndStatus(username, CertificateStatus.validated).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public List<Certificate> saveAllCertificates(List<Certificate> certificates) {
        return certificateRepository.saveAll(certificates);
    }

    public List<EndingCertificateValidationStudent> searchEndingCertificateStudents(CertificateSearchFilter filter, Set<Integer> availableSchoolIds, Integer searchType) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<EndingCertificateValidationStudent> criteriaQuery = builder.createQuery(EndingCertificateValidationStudent.class);

        Root<Student> student = criteriaQuery.from(Student.class);

        predicates.add(builder.isFalse(student.get(Student_.partialCertificate)));
        predicates.add(builder.isFalse(student.get(Student_.abrogadoCertificate)));
        getStudentFilters(filter, availableSchoolIds, predicates, builder, student);

        Predicate predicateFilter;
        if (searchType.equals(AppCatalogs.CERTIFICATESEARCH_VALIDATE)) {
            predicateFilter = studentDontHaveEndingCertificate(builder, student, criteriaQuery);
            predicates.add(predicateFilter);
        } else if (searchType.equals(AppCatalogs.CERTIFICATESEARCH_UPLOAD)) {
            predicateFilter = studentIsValidated(builder, student, criteriaQuery);
            predicates.add(predicateFilter);
        }

        Predicate studentCanCertificate = studentCanCertificate(builder, student, criteriaQuery);
        criteriaQuery.select(builder.construct(
                EndingCertificateValidationStudent.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                builder.selectCase().when(studentCanCertificate, true).otherwise(false),
                student.get(Student_.isPortability),
                student.get(Student_.reprobate)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<EndingCertificateValidationStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<AbrogatedCertificateValidationStudent> searchAbrogatedCertificateStudents(CertificateSearchFilter filter, Set<Integer> availableSchoolIds, Integer searchType) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<AbrogatedCertificateValidationStudent> criteriaQuery = builder.createQuery(AbrogatedCertificateValidationStudent.class);

        Root<Student> student = criteriaQuery.from(Student.class);

        predicates.add(builder.isTrue(student.get(Student_.abrogadoCertificate)));
        predicates.add(builder.isFalse(student.get(Student_.partialCertificate)));
        predicates.add(builder.isFalse(student.get(Student_.isPortability)));
        getStudentFilters(filter, availableSchoolIds, predicates, builder, student);

        Predicate predicateFilter;
        if (searchType.equals(AppCatalogs.CERTIFICATESEARCH_VALIDATE)) {
            predicateFilter = studentDontHaveAbrogatedCertificate(builder, student, criteriaQuery);
            predicates.add(predicateFilter);
        } else if (searchType.equals(AppCatalogs.CERTIFICATESEARCH_UPLOAD)) {
            predicateFilter = studentIsValidatedAbrogated(builder, student, criteriaQuery);
            predicates.add(predicateFilter);
        }

        Predicate studentCanCertificate = studentCanCertificateAbrogated(builder, student, criteriaQuery);
        criteriaQuery.select(builder.construct(
                AbrogatedCertificateValidationStudent.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                builder.selectCase().when(studentCanCertificate, true).otherwise(false),
                student.get(Student_.isPortability),
                student.get(Student_.reprobate)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<AbrogatedCertificateValidationStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<PartialCertificateValidationStudent> searchPartialCertificateValidationStuents(CertificateSearchFilter filter, Set<Integer> availableSchoolIds, Integer searchType) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<PartialCertificateValidationStudent> criteriaQuery = builder.createQuery(PartialCertificateValidationStudent.class);

        Root<Student> student = criteriaQuery.from(Student.class);

        predicates.add(builder.isTrue(student.get(Student_.partialCertificate)));
        getStudentFilters(filter, availableSchoolIds, predicates, builder, student);

        Predicate predicateFilter;
        if (searchType.equals(AppCatalogs.CERTIFICATESEARCH_VALIDATE)) {
            predicateFilter = studentDontHavePartialCertificate(builder, student, criteriaQuery);
            predicates.add(predicateFilter);
        } else if (searchType.equals(AppCatalogs.CERTIFICATESEARCH_UPLOAD)) {
            predicateFilter = studentIsValidatedPartial(builder, student, criteriaQuery);
            predicates.add(predicateFilter);
        }

        criteriaQuery.select(builder.construct(
                PartialCertificateValidationStudent.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<PartialCertificateValidationStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    private void getStudentFilters(CertificateSearchFilter filter, Set<Integer> availableSchoolIds, List<Predicate> predicates, CriteriaBuilder builder, Path<Student> student) {
        Predicate predicateFilter;
        if (AppFunctions.positiveInteger(filter.getStateId())) {
            predicateFilter = stateFilter(builder, student, filter.getStateId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(filter.getSchoolId())) {
            predicateFilter = schoolFilter(builder, student, filter.getSchoolId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(filter.getCareerId())) {
            predicateFilter = careerFilter(builder, student, filter.getCareerId());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(filter.getSearchText())) {
            predicateFilter = textFilter(builder, student, filter.getSearchText());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(filter.getGeneration())) {
            predicateFilter = generationFilter(builder, student, filter.getGeneration());
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(student.get(Student_.id), -1));
        }

        predicateFilter = availableSchoolsFilter(availableSchoolIds, student);
        predicates.add(predicateFilter);
    }

    public List<CertificateQueryStudent> studentQuerySearch(CertificateSearchFilter filter, Set<Integer> availableSchoolIds) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<CertificateQueryStudent> criteriaQuery = builder.createQuery(CertificateQueryStudent.class);

        Root<Certificate> certificate = criteriaQuery.from(Certificate.class);
        Path<Student> student = certificate.get(Certificate_.student);

        predicates.add(studentQuery(builder, certificate, criteriaQuery));

        if (filter.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_PARTIAL)){
            predicates.add(builder.isTrue(student.get(Student_.partialCertificate)));
        }
        else if (filter.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ENDING)){
            predicates.add(builder.isFalse(student.get(Student_.partialCertificate)));
            predicates.add(builder.isFalse(student.get(Student_.abrogadoCertificate)));
        }
        else if (filter.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ABROGATED)){
            predicates.add(builder.isTrue(student.get(Student_.abrogadoCertificate)));
            predicates.add(builder.isFalse(student.get(Student_.partialCertificate)));
            predicates.add(builder.isFalse(student.get(Student_.isPortability)));
        }
        /*else {
            predicates.add(builder.isFalse(student.get(Student_.partialCertificate)));
            if (filter.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ABROGATED)){
                predicates.add(builder.isTrue(student.get(Student_.abrogadoCertificate)));
            } else {
                predicates.add(builder.isFalse(student.get(Student_.abrogadoCertificate)));
            }
        }*/
        getStudentFilters(filter, availableSchoolIds, predicates, builder, student);

        criteriaQuery.select(builder.construct(
                CertificateQueryStudent.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                certificate.get(Certificate_.status),
                certificate.get(Certificate_.folio)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<CertificateQueryStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }


    public StudentEndingDecData getStudentEndingDecData(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentEndingDecData> criteriaQuery = builder.createQuery(StudentEndingDecData.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = studentIdFilter(builder, student, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(student.get(Student_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentEndingDecData.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.enrollmentStartDate).as(java.sql.Date.class),
                student.get(Student_.enrollmentEndDate).as(java.sql.Date.class),
                student.get(Student_.finalScore),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfName),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfNumber),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfFinalName),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.schoolType).get(CatSchoolType_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.iems).get(CatIems_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.educationalOption).get(CatEducationalOption_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.state).get(CatState_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.localityId),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.studyType).get(CatStudyType_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.totalCredits),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.profileType).get(CatProfileType_.name),
                //student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.disciplinaryField).get(CatDisciplinaryField_.id),
                //student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.disciplinaryField).get(CatDisciplinaryField_.name),
                //student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.disciplinaryField).get(CatDisciplinaryField_.studyArea),
                student.get(Student_.disciplinaryField).get(CatDisciplinaryField_.id),
                student.get(Student_.disciplinaryField).get(CatDisciplinaryField_.name),
                student.get(Student_.disciplinaryField).get(CatDisciplinaryField_.studyArea),
                student.get(Student_.isPortability)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentEndingDecData> query = entityManager.createQuery(criteriaQuery);
        StudentEndingDecData studentData = query.getSingleResult();
        studentData.setModules(getStudentEndingDecDataModules(studentId));
        return studentData;
    }

    public StudentAbrogatedDecData getStudentAbrogatedDecData(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentAbrogatedDecData> criteriaQuery = builder.createQuery(StudentAbrogatedDecData.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = studentIdFilter(builder, student, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(student.get(Student_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentAbrogatedDecData.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.enrollmentStartDate).as(java.sql.Date.class),
                student.get(Student_.enrollmentEndDate).as(java.sql.Date.class),
                student.get(Student_.finalScore),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfName),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfNumber),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfFinalName),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.schoolType).get(CatSchoolType_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.iems).get(CatIems_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.educationalOption).get(CatEducationalOption_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.state).get(CatState_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.localityId),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.studyType).get(CatStudyType_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.totalCredits),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.profileType).get(CatProfileType_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.disciplinaryField).get(CatDisciplinaryField_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.disciplinaryField).get(CatDisciplinaryField_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.disciplinaryField).get(CatDisciplinaryField_.studyArea),
                student.get(Student_.isPortability)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentAbrogatedDecData> query = entityManager.createQuery(criteriaQuery);
        StudentAbrogatedDecData studentData = query.getSingleResult();
        studentData.setModules(getStudentAbrogatedDecDataModules(studentId));
        //Genero del plantel
        studentData.setGender(1);
        return studentData;
    }

    public StudentPartialDecData getStudentPartialDecData(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentPartialDecData> criteriaQuery = builder.createQuery(StudentPartialDecData.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = studentIdFilter(builder, student, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(student.get(Student_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentPartialDecData.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                student.get(Student_.enrollmentKey),
                student.get(Student_.enrollmentStartDate).as(java.sql.Date.class),
                student.get(Student_.enrollmentEndDate).as(java.sql.Date.class),
                student.get(Student_.finalScore),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfName),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfNumber),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.pdfFinalName),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.schoolType).get(CatSchoolType_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.iems).get(CatIems_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.educationalOption).get(CatEducationalOption_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.state).get(CatState_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.localityId),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.studyType).get(CatStudyType_.id),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.name),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.careerKey),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.totalCredits),
                student.get(Student_.obtainedCredits),
                student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.profileType).get(CatProfileType_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentPartialDecData> query = entityManager.createQuery(criteriaQuery);
        StudentPartialDecData studentData = query.getSingleResult();
        studentData.setUacs(getStudentPartialDecDataUacs(studentId));
        return studentData;
    }

    private List<StudentEndingDecDataModule> getStudentEndingDecDataModules(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentEndingDecDataModule> criteriaQuery = builder.createQuery(StudentEndingDecDataModule.class);

        Root<StudentCareerModule> studentCareerModule = criteriaQuery.from(StudentCareerModule.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = studentCareerIdFilter(builder, studentCareerModule, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(studentCareerModule.get(StudentCareerModule_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentEndingDecDataModule.class,
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.order),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.module).get(Module_.module),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.module).get(Module_.emsadCompetence),
                studentCareerModule.get(StudentCareerModule_.score),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.hours),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.credits)
        ));
        criteriaQuery.orderBy(builder.asc(studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.order)));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentEndingDecDataModule> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    private List<StudentAbrogatedDecDataModule> getStudentAbrogatedDecDataModules(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentAbrogatedDecDataModule> criteriaQuery = builder.createQuery(StudentAbrogatedDecDataModule.class);

        Root<StudentCareerModule> studentCareerModule = criteriaQuery.from(StudentCareerModule.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = studentCareerIdFilter(builder, studentCareerModule, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(studentCareerModule.get(StudentCareerModule_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentAbrogatedDecDataModule.class,
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.order),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.module).get(Module_.module),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.module).get(Module_.emsadCompetence),
                studentCareerModule.get(StudentCareerModule_.score),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.hours),
                studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.credits)
        ));
        criteriaQuery.orderBy(builder.asc(studentCareerModule.get(StudentCareerModule_.careerModule).get(CareerModule_.order)));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentAbrogatedDecDataModule> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    private List<StudentPartialDecDataUac> getStudentPartialDecDataUacs(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentPartialDecDataUac> criteriaQuery = builder.createQuery(StudentPartialDecDataUac.class);

        Root<StudentSubjectPartial> studentSubjectPartial = criteriaQuery.from(StudentSubjectPartial.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = partialUacStudentFilter(builder, studentSubjectPartial, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(studentSubjectPartial.get(StudentSubjectPartial_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentPartialDecDataUac.class,
                studentSubjectPartial.get(StudentSubjectPartial_.cct),
                studentSubjectPartial.get(StudentSubjectPartial_.subjectType).get(CatSubjectType_.id),
                studentSubjectPartial.get(StudentSubjectPartial_.name),
                studentSubjectPartial.get(StudentSubjectPartial_.score),
                studentSubjectPartial.get(StudentSubjectPartial_.hours),
                studentSubjectPartial.get(StudentSubjectPartial_.credits),
                studentSubjectPartial.get(StudentSubjectPartial_.scholarPeriod),
                studentSubjectPartial.get(StudentSubjectPartial_.periodNumber)
        ));
        List<Order> orderList = new ArrayList<>();
        orderList.add(builder.asc(studentSubjectPartial.get(StudentSubjectPartial_.periodNumber)));
        orderList.add(builder.asc(studentSubjectPartial.get(StudentSubjectPartial_.subjectType).get(CatSubjectType_.id)));
        orderList.add(builder.asc(studentSubjectPartial.get(StudentSubjectPartial_.id)));
        criteriaQuery.orderBy(orderList);
//        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentPartialDecDataUac> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<Certificate> findByUsernameListAndStatus(List<String> curps, String status) {
        return certificateRepository.findListByStatusAndUsername(curps, status);
    }

    public AdminDecData getAdminDecData(User userAdmin) {
        return new AdminDecData(userAdmin);
    }


    public Certificate findByFolioNumber(String folioNumber) {
        return certificateRepository.findByFolio(folioNumber).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Certificate findByFolioNumberOrNull(String folioNumber) {
        return certificateRepository.findByFolio(folioNumber).orElse(null);
    }

    public boolean getPendientBatches(Integer stateId) {
        return certificateRepository.countInProcessByStateId(stateId, CertificateStatus.inProcess) > 0;
    }

    public Set<Integer> getPendientBatchesNumber(Integer stateId) {
        List<Certificate> certificates = certificateRepository.findInProcessByStateId(stateId, CertificateStatus.inProcess);
        return certificates.stream().map(Certificate::getMecBatchNumber).collect(Collectors.toSet());
    }

    public Integer findCertificateTypeIdFromBatchNumber(Integer mecBatchNumber) {
        List<Certificate> certificates = certificateRepository.findByMecBatchNumber(mecBatchNumber);
        if (certificates.size() == 0) return 0;
        return certificates.get(0).getCertificateTypeId();
    }

    public Certificate findCertifiedByUsername(String curp) {
        return certificateRepository.findByUsernameAndStatus(curp, CertificateStatus.certified).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Certificate getByStudentAndCertificateTypeIdAndStatus(Student student, Integer certificateType, String status) {
        return certificateRepository.getByStudentAndCertificateTypeIdAndStatus(student, certificateType, status).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Certificate cancelCertificate(Certificate certificate) {
        certificate.cancel();
        return certificateRepository.save(certificate);
    }

    public boolean countByUsernameCertificate(Student student) {
        return certificateRepository.countByStudent(student) > 0;
    }

    public Certificate findByCertificateLimit2(Student student){
        return certificateRepository.findFirstByStudentOrderByIdDesc(student).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public StudentAbrogatedDecData getStudentAbrogatedDecDataEquivalent(Integer studentId, Integer schoolId) {
        SchoolEquivalent equivalentData = schoolEquivalentRepository.findBySchool(schoolId);
        StudentAbrogatedDecData studentData = getStudentAbrogatedDecData(studentId);
        studentData.setPdfName(equivalentData.getPdfName());
        studentData.setPdfNumber(equivalentData.getPdfName());
        studentData.setCct(equivalentData.getCct());
        studentData.setStateId(equivalentData.getCity().getState().getId());
        studentData.setLocalityId(equivalentData.getCity().getLocalityId());
        studentData.setModules(getStudentAbrogatedDecDataModules(studentId));
        studentData.setGender(equivalentData.getGender());
        return studentData;
    }

    public ConfigPeriodData selectPeriodCerticate(Integer stateId, String generation) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ConfigPeriodData> criteriaQuery = builder.createQuery(ConfigPeriodData.class);

        Root<ConfigPeriodCertificate> periodCertificate = criteriaQuery.from(ConfigPeriodCertificate.class);

        predicates.add(builder.equal(periodCertificate.get(ConfigPeriodCertificate_.state).get(CatState_.id), stateId));

        criteriaQuery.select(builder.construct(
                ConfigPeriodData.class,
                periodCertificate.get(ConfigPeriodCertificate_.state).get(CatState_.id),
                periodCertificate.get(ConfigPeriodCertificate_.dateStart),
                periodCertificate.get(ConfigPeriodCertificate_.endDate1),
                periodCertificate.get(ConfigPeriodCertificate_.generation).get(CatGeneration_.generation)
        ));

        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<ConfigPeriodData> typedQuery = entityManager.createQuery(criteriaQuery);
        ConfigPeriodData periodData = typedQuery.getSingleResult();
        return periodData;
    }

    public void certificateCancelExternal(CancelStampExternal cancelStamp, int codigo, String mensaje) {
        CatState state = stateRepository.findByStateId(cancelStamp.getStateId());
        CanceledStamps stamps = new CanceledStamps();
        stamps.insertCanceledStamps(state, cancelStamp, codigo, mensaje);
        canceledStampsRepository.save(stamps);
    }
}
