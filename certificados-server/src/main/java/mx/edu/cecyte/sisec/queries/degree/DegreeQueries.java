package mx.edu.cecyte.sisec.queries.degree;

import mx.edu.cecyte.sisec.business.degree.DegreeSigner;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.classes.certificate.AdminDecData;
import mx.edu.cecyte.sisec.classes.degree.DegreeSearchFilter;
import mx.edu.cecyte.sisec.classes.degree.StudentDegreeData;
import mx.edu.cecyte.sisec.dto.dashboard.TotalList;
import mx.edu.cecyte.sisec.dto.degree.*;

import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.catalogs.degree.*;
import mx.edu.cecyte.sisec.model.education.SchoolCareer_;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.model.met.*;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.User_;
import mx.edu.cecyte.sisec.queries.filters.DegreeFilter;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.degree.CanceledStampsRepository;
import mx.edu.cecyte.sisec.repo.degree.DegreeDataRepository;
import mx.edu.cecyte.sisec.repo.degree.DegreeRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeAcademicRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeManagingRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeStateRepository;
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
public class DegreeQueries extends DegreeFilter {
    @Autowired private DegreeRepository degreeRepository;
    @Autowired private EntityManager entityManager;
    @Autowired private DegreeDataRepository degreeDataRepository;
    @Autowired private DegreeStateRepository degreeStateRepository;
    @Autowired private DegreeManagingRepository degreeManagingRepository;
    @Autowired private DegreeAcademicRepository degreeAcademicRepository;
    @Autowired private StateRepository stateRepository;
    @Autowired private CanceledStampsRepository canceledStampsRepository;
    public List<Degree> validateStudents(List<Student> students) {
        List<Degree> degrees = students.stream().map(Degree::new).collect(Collectors.toList());
        return degreeRepository.saveAll(degrees);
    }

    public List<Degree> getDegreesByFilename(List<String> fileNames) {
        return degreeRepository.findAllByFileName(fileNames);
    }

    public Degree findInProcessByFileName(String fileName) {
        return degreeRepository.findInProcessByFileName(fileName, DegreeStatus.inProcess).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Degree findValidatedByUsername(String username) {
        return degreeRepository.findByUsernameAndStatus(username, DegreeStatus.validated).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public List<Degree> saveAllDegrees(List<Degree> degrees) {
        return degreeRepository.saveAll(degrees);
    }

    public List<DegreeQueryStudent> studentQuerySearch(DegreeSearchFilter filter, Set<Integer> availableSchoolIds) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DegreeQueryStudent> criteriaQuery = builder.createQuery(DegreeQueryStudent.class);

        Root<Degree> degree = criteriaQuery.from(Degree.class);
        Root<DegreeData> degreeData = criteriaQuery.from(DegreeData.class);
        predicates.add(builder.equal(degree.get(Degree_.student).get(Student_.id), degreeData.get(DegreeData_.student).get(Student_.id)));
        predicates.add(studentQuery(builder, degree, criteriaQuery));

        getStudentFilters(filter, availableSchoolIds, predicates, builder, degreeData);

        criteriaQuery.select(builder.construct(
                DegreeQueryStudent.class,
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.username),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.name),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.firstLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.secondLastName),
                degreeData.get(DegreeData_.student).get(Student_.enrollmentKey),
                degreeData.get(DegreeData_.student).get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.cct),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                degree.get(Degree_.status),
                degree.get(Degree_.folio)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<DegreeQueryStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }


    public StudentDegreeData getStudentDegreeData(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentDegreeData> criteriaQuery = builder.createQuery(StudentDegreeData.class);

        Root<DegreeData> degreeData = criteriaQuery.from(DegreeData.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(studentId)) {
            predicateFilter = studentIdFilter(builder, degreeData, studentId);
            predicates.add(predicateFilter);
        }
        if (predicates.size() == 0) {
            predicates.add(builder.equal(degreeData.get(DegreeData_.student).get(Student_.id), -1));
        }

        criteriaQuery.select(builder.construct(
                StudentDegreeData.class,
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.username),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.name),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.firstLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.secondLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.email),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name),
                degreeData.get(DegreeData_.startDateCarrer).as(java.sql.Date.class),
                degreeData.get(DegreeData_.endDateCarrer).as(java.sql.Date.class),
                degreeData.get(DegreeData_.autorizationId).get(CatDegreeAuth_.id),
                degreeData.get(DegreeData_.autorizationId).get(CatDegreeAuth_.name),
                degreeData.get(DegreeData_.expeditionData).as(java.sql.Date.class),
                degreeData.get(DegreeData_.modalityId).get(CatDegreeModality_.id),
                degreeData.get(DegreeData_.modalityId).get(CatDegreeModality_.name),
                degreeData.get(DegreeData_.examinationDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.exemptionDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.socialService),
                degreeData.get(DegreeData_.legalBasisId).get(CatDegreeSocialService_.id),
                degreeData.get(DegreeData_.legalBasisId).get(CatDegreeSocialService_.name),
                degreeData.get(DegreeData_.federalEntityId),
                degreeData.get(DegreeData_.federalEntityName),
                degreeData.get(DegreeData_.institutionOrigin),
                degreeData.get(DegreeData_.institutionOriginTypeId).get(CatDegreeAntecedent_.id),
                degreeData.get(DegreeData_.institutionOriginTypeId).get(CatDegreeAntecedent_.name),
                degreeData.get(DegreeData_.federalEntityOriginId).get(CatDegreeState_.id),
                degreeData.get(DegreeData_.federalEntityOriginId).get(CatDegreeState_.name),
                degreeData.get(DegreeData_.startDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.endDate).as(java.sql.Date.class),
                builder.selectCase().when(builder.notEqual(degreeData.get(DegreeData_.socialService),1), "").otherwise("")
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentDegreeData> query = entityManager.createQuery(criteriaQuery);
        return query.getSingleResult();
    }

    public List<Degree> findByUsernameListAndStatus(List<String> curps, String status) {
        return degreeRepository.findListByStatusAndUsername(curps, status);
    }

    public AdminDecData getAdminDecData(User userAdmin) {
        return new AdminDecData(userAdmin);
    }


    public Degree findByFolioNumber(String folioNumber) {
        return degreeRepository.findByFolio(folioNumber).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Degree findByFolioNumberOrNull(String folioNumber) {
        return degreeRepository.findByFolio(folioNumber).orElse(null);
    }

    public boolean getPendientBatches(Integer stateId) {
        return degreeRepository.countInProcessByStateId(stateId, DegreeStatus.inProcess) > 0;
    }

    public Set<Integer> getPendientBatchesNumber(Integer stateId) {
        List<Degree> degrees = degreeRepository.findInProcessByStateId(stateId, DegreeStatus.inProcess);
        return degrees.stream().map(Degree::getBatchNumber).collect(Collectors.toSet());
    }

    public Degree findDegreeByUsername(String curp) {
        return degreeRepository.findByUsernameAndStatus(curp, DegreeStatus.degreed).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Degree getByStudentAndAndStatus(Student student, String status) {
        return degreeRepository.getByStudentAndStatus(student, status).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Degree cancelDegree(Degree degree) {
        degree.cancel();
        return degreeRepository.save(degree);
    }

    public DegreeSigner getDegreeSignerData(MetCredentials stateId, User userAdmin, Fiel fiel) {
        ManagingDirector managingDirector = degreeManagingRepository.findAll()
                .stream()
                .filter(s->s.getState().getId().equals(stateId.getState().getId()))
                .findFirst().get();
        String curp = managingDirector.getCurp();
        String name = managingDirector.getName();
        String firstLastName = managingDirector.getFirstLastName();
        String secondLastName = managingDirector.getSecondLastName();
        Integer positionId = managingDirector.getSigner().getId();
        String position = managingDirector.getSigner().getName();
        return new DegreeSigner(curp, name, firstLastName, secondLastName, positionId, position, fiel);
    }

    public Long existeStudent(Integer studentId) {
        return degreeDataRepository.findAll()
                .stream()
                .filter(integer->integer.getStudent().getId().equals(studentId))
                .count();
    }

    public CatDegreeState getDegreeEntity(Integer careerId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> criteriaQuery = builder.createQuery(Object[].class);
        Root<CatDegreeCombinationDgp> career = criteriaQuery.from(CatDegreeCombinationDgp.class);
        predicates.add(builder.equal(career.get(CatDegreeCombinationDgp_.id), careerId));
        criteriaQuery.select(builder.construct(Object[].class,
                career.get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.id),
                career.get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.name)
                ));
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<Object[]> typedQuery = entityManager.createQuery(criteriaQuery);
        CatDegreeState state = new CatDegreeState();
        typedQuery.getResultList().forEach(row->{
            System.out.println(row[0]);
            state.setId((Integer) row[0]);
            state.setName((String) row[1]);
        });
        return state;
    }

    public DegreeData antecedentsDataSaveAll(DegreeDataAntecedents data) {
        Student student = new Student();
        student.setId(data.getStudentId());
        CatDegreeCombinationDgp carrer = new CatDegreeCombinationDgp();
        carrer.setId(data.getCarrerId());
        CatDegreeAuth auth = new CatDegreeAuth();
        auth.setId(data.getAutorizationId());
        CatDegreeModality modality = new CatDegreeModality();
        modality.setId(data.getModalityId());
        CatDegreeSocialService legal = new CatDegreeSocialService();
        legal.setId(data.getLegalBasisId());
        CatDegreeAntecedent antecedent = new CatDegreeAntecedent();
        antecedent.setId(data.getInstitutionOriginTypeId());
        CatDegreeState state = new CatDegreeState();
        state.setId(data.getFederalEntityOriginId());
        DegreeData datos = new DegreeData(data, student, carrer, auth, modality, legal, antecedent, state);
        degreeDataRepository.save(datos);
        return datos;
    }
    //**Consulta Carga de Lista para Validar
    public List<DegreeValidationStudent> searchDegreeStudents(DegreeSearchFilter filter, Set<Integer> availableSchoolIds, Integer searchType) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DegreeValidationStudent> criteriaQuery = builder.createQuery(DegreeValidationStudent.class);

        Root<DegreeData> degreeData = criteriaQuery.from(DegreeData.class);
        getStudentFilters(filter, availableSchoolIds, predicates, builder, degreeData);
        Predicate predicateFilter;
        if (searchType.equals(AppCatalogs.DEGREESEARCH_VALIDATE)) {
            predicateFilter = studentDontHaveDegree(builder, degreeData, criteriaQuery);
            predicates.add(predicateFilter);
        } else if (searchType.equals(AppCatalogs.DEGREESEARCH_UPLOAD)) {
            predicateFilter = studentIsValidated(builder, degreeData, criteriaQuery);
            predicates.add(predicateFilter);
        }
        Predicate studentCanDegree = studentHasEndingCertificate(builder, degreeData, criteriaQuery);
        criteriaQuery.select(builder.construct(
                DegreeValidationStudent.class,
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.username),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.name),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.firstLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.secondLastName),
                degreeData.get(DegreeData_.student).get(Student_.enrollmentKey),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                degreeData.get(DegreeData_.socialService),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.school).get(School_.cct),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.school).get(School_.name),
                builder.selectCase().when(builder.notEqual(degreeData.get(DegreeData_.socialService),1), false).otherwise(true)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<DegreeValidationStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public void getStudentFilters(DegreeSearchFilter filter, Set<Integer> availableSchoolIds, List<Predicate> predicates, CriteriaBuilder builder, Root<DegreeData> degreeData){
        Predicate predicateFilter = schoolTypeFilter(builder, degreeData, AppCatalogs.SCHOOLTYPE_CECYTE);
        predicates.add(predicateFilter);

        if (AppFunctions.positiveInteger(filter.getStateId())) {
            predicateFilter = stateFilter(builder, degreeData, filter.getStateId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(filter.getSchoolId())) {
            predicateFilter = schoolFilter(builder, degreeData, filter.getSchoolId());
            predicates.add(predicateFilter);
        }
        if (AppFunctions.positiveInteger(filter.getCareerId())) {
            predicateFilter = careerFilter(builder, degreeData, filter.getCareerId());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(filter.getSearchText())) {
            predicateFilter = textFilter(builder, degreeData, filter.getSearchText());
            predicates.add(predicateFilter);
        }
        if (!StringUtils.isEmpty(filter.getGeneration())) {
            predicateFilter = generationFilter(builder, degreeData, filter.getGeneration());
            predicates.add(predicateFilter);
        }
        predicateFilter = availableSchoolsFilter(availableSchoolIds, degreeData);
        predicates.add(predicateFilter);
    }

    public List<StudentDegreeStructure> getDegreeView(Student studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentDegreeStructure> criteriaQuery = builder.createQuery(StudentDegreeStructure.class);

        Root<DegreeData> degreeData = criteriaQuery.from(DegreeData.class);
        predicates.add(builder.equal(degreeData.get(DegreeData_.student).get(Student_.id), studentId.getId()));
        criteriaQuery.select(builder.construct(
                StudentDegreeStructure.class,
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.username),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.name),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.firstLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.secondLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.email),
                degreeData.get(DegreeData_.student).get(Student_.enrollmentKey),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.id),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name),
                degreeData.get(DegreeData_.startDateCarrer).as(java.sql.Date.class),
                degreeData.get(DegreeData_.endDateCarrer).as(java.sql.Date.class),
                degreeData.get(DegreeData_.autorizationId).get(CatDegreeAuth_.id),
                degreeData.get(DegreeData_.autorizationId).get(CatDegreeAuth_.name),
                degreeData.get(DegreeData_.expeditionData).as(java.sql.Date.class),
                degreeData.get(DegreeData_.modalityId).get(CatDegreeModality_.id),
                degreeData.get(DegreeData_.modalityId).get(CatDegreeModality_.name),
                degreeData.get(DegreeData_.examinationDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.exemptionDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.socialService),
                degreeData.get(DegreeData_.legalBasisId).get(CatDegreeSocialService_.id),
                degreeData.get(DegreeData_.legalBasisId).get(CatDegreeSocialService_.name),
                degreeData.get(DegreeData_.federalEntityId),
                degreeData.get(DegreeData_.federalEntityName),
                degreeData.get(DegreeData_.institutionOrigin),
                degreeData.get(DegreeData_.institutionOriginTypeId).get(CatDegreeAntecedent_.id),
                degreeData.get(DegreeData_.institutionOriginTypeId).get(CatDegreeAntecedent_.name),
                degreeData.get(DegreeData_.federalEntityOriginId).get(CatDegreeState_.id),
                degreeData.get(DegreeData_.federalEntityOriginId).get(CatDegreeState_.name),
                degreeData.get(DegreeData_.startDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.endDate).as(java.sql.Date.class)
        ));
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<StudentDegreeStructure> typedQuery = entityManager.createQuery(criteriaQuery);
        List<StudentDegreeStructure> structureList = typedQuery.getResultList();
        return structureList;
    }

    public DegreeEditStudent getStudentModules(Student student) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DegreeEditStudent> criteriaQuery = builder.createQuery(DegreeEditStudent.class);

        Root<DegreeData> degreeData = criteriaQuery.from(DegreeData.class);
        predicates.add(builder.equal(degreeData.get(DegreeData_.student).get(Student_.id), student.getId()));
        criteriaQuery.select(builder.construct(
                DegreeEditStudent.class,
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.username),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.name),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.firstLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.secondLastName),
                degreeData.get(DegreeData_.student).get(Student_.user).get(User_.email),
                degreeData.get(DegreeData_.student).get(Student_.enrollmentKey),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.id),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name),
                degreeData.get(DegreeData_.startDateCarrer).as(java.sql.Date.class),
                degreeData.get(DegreeData_.endDateCarrer).as(java.sql.Date.class),
                degreeData.get(DegreeData_.autorizationId).get(CatDegreeAuth_.id),
                degreeData.get(DegreeData_.autorizationId).get(CatDegreeAuth_.name),
                degreeData.get(DegreeData_.expeditionData).as(java.sql.Date.class),
                degreeData.get(DegreeData_.modalityId).get(CatDegreeModality_.id),
                degreeData.get(DegreeData_.modalityId).get(CatDegreeModality_.name),
                degreeData.get(DegreeData_.examinationDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.exemptionDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.socialService),
                degreeData.get(DegreeData_.legalBasisId).get(CatDegreeSocialService_.id),
                degreeData.get(DegreeData_.legalBasisId).get(CatDegreeSocialService_.name),
                degreeData.get(DegreeData_.federalEntityId),
                degreeData.get(DegreeData_.federalEntityName),
                degreeData.get(DegreeData_.institutionOrigin),
                degreeData.get(DegreeData_.institutionOriginTypeId).get(CatDegreeAntecedent_.id),
                degreeData.get(DegreeData_.institutionOriginTypeId).get(CatDegreeAntecedent_.name),
                degreeData.get(DegreeData_.federalEntityOriginId).get(CatDegreeState_.id),
                degreeData.get(DegreeData_.federalEntityOriginId).get(CatDegreeState_.name),
                degreeData.get(DegreeData_.startDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.endDate).as(java.sql.Date.class)
        ));
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<DegreeEditStudent> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getSingleResult();
    }

    public DegreeData updateStudentModules(DegreeDataAntecedents data, DegreeData id) {
        Student student = new Student();
        student.setId(data.getStudentId());
        CatDegreeCombinationDgp carrer = new CatDegreeCombinationDgp();
        carrer.setId(data.getCarrerId());
        CatDegreeAuth auth = new CatDegreeAuth();
        auth.setId(data.getAutorizationId());
        CatDegreeModality modality = new CatDegreeModality();
        modality.setId(data.getModalityId());
        CatDegreeSocialService legal = new CatDegreeSocialService();
        legal.setId(data.getLegalBasisId());
        CatDegreeAntecedent antecedent = new CatDegreeAntecedent();
        antecedent.setId(data.getInstitutionOriginTypeId());
        CatDegreeState state = new CatDegreeState();
        state.setId(data.getFederalEntityOriginId());
        DegreeData datos = new DegreeData(id.getId(),data, student, carrer, auth, modality, legal, antecedent, state);
        degreeDataRepository.save(datos);
        return datos;
    }

    public DegreeData getDegreDataId(Student student) {
        return degreeDataRepository.findAll()
                .stream()
                .filter(s->s.getStudent().getId().equals(student.getId())).findFirst().get();
    }

    public DegreeComplementDoc getComplementData(Integer student) {
        ArrayList<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DegreeComplementDoc> criteriaQuery = criteriaBuilder.createQuery(DegreeComplementDoc.class);

        Root<DegreeData> degreeData = criteriaQuery.from(DegreeData.class);
        Root<CatDegreeAcademic> academic = criteriaQuery.from(CatDegreeAcademic.class);
        Root<ManagingDirector> managingDirector = criteriaQuery.from(ManagingDirector.class);
        predicates.add(criteriaBuilder.equal(degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.id), academic.get(CatDegreeAcademic_.entity).get(CatDegreeState_.id)));
        predicates.add(criteriaBuilder.equal(degreeData.get(DegreeData_.student).get(Student_.id), student));
        predicates.add(criteriaBuilder.equal(degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.id), managingDirector.get(ManagingDirector_.state).get(CatState_.id)));
        predicates.add(criteriaBuilder.equal(academic.get(CatDegreeAcademic_.validity), 1));
        criteriaQuery.select(criteriaBuilder.construct(
                DegreeComplementDoc.class,
                degreeData.get(DegreeData_.student).get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.state).get(CatState_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.decreeNumber),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.decreeDate).as(java.sql.Date.class),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.school).get(School_.name),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.state).get(CatState_.name),
                degreeData.get(DegreeData_.student).get(Student_.school).get(School_.city).get(CatCity_.name),
                degreeData.get(DegreeData_.expeditionData).as(java.sql.Date.class),
                managingDirector.get(ManagingDirector_.name),
                managingDirector.get(ManagingDirector_.firstLastName),
                managingDirector.get(ManagingDirector_.secondLastName),
                academic.get(CatDegreeAcademic_.name),
                academic.get(CatDegreeAcademic_.firstLastName),
                academic.get(CatDegreeAcademic_.secondLastName),
                managingDirector.get(ManagingDirector_.gender),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.abbreviation),
                degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.entity).get(CatDegreeState_.id),
                academic.get(CatDegreeAcademic_.curp)
                ));
        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<DegreeComplementDoc> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getSingleResult();
    }

    public DegreeComplementDoc selectComplement(Integer studentId) {
        DegreeComplementDoc complementDoc = new DegreeComplementDoc();
        DegreeData degreeData = degreeDataRepository.findAll().stream().filter(data->data.getStudent().getId()==studentId).findFirst().get();
        complementDoc.setNameState(degreeData.getStudent().getSchoolCareer().getSchool().getCity().getState().getName());
        complementDoc.setCityName(degreeData.getCarrerId().getInstitute().getEntity().getCityName());
        complementDoc.setNumberDecree(degreeData.getCarrerId().getInstitute().getEntity().getDecreeNumber());
        complementDoc.setDateDecree(degreeData.getCarrerId().getInstitute().getEntity().getDecreeDate());
        complementDoc.setNameSchool(degreeData.getStudent().getSchoolCareer().getSchool().getPdfFinalName());
        complementDoc.setNameCity(degreeData.getStudent().getSchoolCareer().getSchool().getCity().getState().getName());
        complementDoc.setNameMunicipality(degreeData.getStudent().getSchoolCareer().getSchool().getCity().getName());
        complementDoc.setDateExpedition(degreeData.getExpeditionData());

        ManagingDirector managingDirector = degreeManagingRepository.findAll().stream().filter(res->res.getState().getId()==degreeData.getCarrerId().getInstitute().getEntity().getState().getId()).findFirst().get();
        complementDoc.setNameDirector(managingDirector.getName());
        complementDoc.setFirstLastNameDirector(managingDirector.getFirstLastName());
        complementDoc.setSecondLastNameDirector(managingDirector.getSecondLastName());
        complementDoc.setGender(managingDirector.getGender());

        CatDegreeAcademic academic = degreeAcademicRepository.findAll().stream().filter(academi->academi.getEntity().getId()==degreeData.getCarrerId().getInstitute().getEntity().getState().getId()).findFirst().get();
        complementDoc.setNameAcademic(academic.getName());
        complementDoc.setFirstLastNameAcademic(academic.getFirstLastName());
        complementDoc.setSecondLastNameAcademic(academic.getSecondLastName());
        complementDoc.setLogoNameAbbreviation(degreeData.getCarrerId().getInstitute().getEntity().getAbbreviation());
        complementDoc.setStateId(degreeData.getCarrerId().getInstitute().getEntity().getId());
        complementDoc.setCurpAcademic(academic.getCurp());

        return complementDoc;
    }

    public boolean isExistFolio(String folio) {
        return degreeRepository.countFolio(folio) > 0;
    }

    public DegreeSearchData searchFolioDegree(String folio) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DegreeSearchData> criteriaQuery = builder.createQuery(DegreeSearchData.class);

        Root<Degree> degree = criteriaQuery.from(Degree.class);
        Root<DegreeData> data = criteriaQuery.from(DegreeData.class);
        predicates.add(builder.equal(degree.get(Degree_.folio), folio));
        predicates.add(builder.equal(data.get(DegreeData_.student).get(Student_.user).get(User_.id), degree.get(Degree_.student).get(Student_.user).get(User_.id)));
        criteriaQuery.multiselect(
                degree.get(Degree_.folio),
                degree.get(Degree_.student).get(Student_.user).get(User_.username),
                degree.get(Degree_.student).get(Student_.user).get(User_.name),
                degree.get(Degree_.student).get(Student_.user).get(User_.firstLastName),
                degree.get(Degree_.student).get(Student_.user).get(User_.secondLastName),
                degree.get(Degree_.student).get(Student_.user).get(User_.email),
                degree.get(Degree_.student).get(Student_.enrollmentKey),
                data.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.clave),
                data.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.name),
                data.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                data.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name),
                data.get(DegreeData_.startDateCarrer).as(java.sql.Date.class),
                data.get(DegreeData_.endDateCarrer).as(java.sql.Date.class),
                data.get(DegreeData_.expeditionData).as(java.sql.Date.class),
                degree.get(Degree_.dateSep),
                data.get(DegreeData_.federalEntityName),
                degree.get(Degree_.excelMessage),
                degree.get(Degree_.excelStatus)
        );
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<DegreeSearchData> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getSingleResult();
    }
    public List<TotalList> getCountDegreedHM() {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = degreeRepository.countBySexo("TITULADO", "H");
        Integer mujer =  degreeRepository.countBySexo("TITULADO", "M");
        result.add(new TotalList(hombre, mujer));
        return result;
    }
    public List<TotalList> getCountDegreedHMByState(Integer stateId) {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = degreeRepository.countBySexoAndStateId("TITULADO", "H",stateId);
        Integer mujer =  degreeRepository.countBySexoAndStateId("TITULADO", "M",stateId);
        result.add(new TotalList(hombre, mujer));
        return result;
    }
    public List<TotalList> getCountDegreedHMByStateAndSchool(Integer stateId,Integer schoolId) {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = degreeRepository.countBySexoAndStateIdAndSchoolId("TITULADO", "H",stateId,schoolId);
        Integer mujer =  degreeRepository.countBySexoAndStateIdAndSchoolId("TITULADO", "M",stateId,schoolId);
        result.add(new TotalList(hombre, mujer));
        return result;
    }
    public List<TotalList> getCountDegreedHMBySchool(Integer schoolId) {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = degreeRepository.countBySexoAndStateIdAndSchoolId("TITULADO", "H",schoolId);
        Integer mujer =  degreeRepository.countBySexoAndStateIdAndSchoolId("TITULADO", "M",schoolId);
        result.add(new TotalList(hombre, mujer));
        return result;
    }

    public void degreeCancelExternal(CancelStampExternal cancelStampExternal, Integer codigo, String mensaje) {
        CatState state = stateRepository.findByStateId(cancelStampExternal.getStateId());
        CanceledStamps stamps = new CanceledStamps();
        stamps.insertCanceledStamps(state, cancelStampExternal, codigo, mensaje);
        canceledStampsRepository.save(stamps);
    }
}
