package mx.edu.cecyte.sisec.queries.degree;

import mx.edu.cecyte.sisec.classes.degree.StudentPeriodDate;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.degree.DegreeIntituteDgp;
import mx.edu.cecyte.sisec.dto.degree.DgpSchoolSelect;
import mx.edu.cecyte.sisec.model.catalogs.degree.*;
import mx.edu.cecyte.sisec.model.education.SchoolCareer_;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.model.met.Degree;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.users.User_;
import mx.edu.cecyte.sisec.repo.degree.catalogs.*;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class DegreeCatalogQueries {
    @Autowired
    private EntityManager entityManager;

    @Autowired private DegreeAntecedentRepository degreeAntecedentRepository;
    @Autowired private DegreeReasonRepository degreeReasonRepository;
    @Autowired private DegreeAuthRepository degreeAuthRepository;
    @Autowired private DegreeModalityRepository degreeModalityRepository;
    @Autowired private DegreeSignerRepository degreeSignerRepository;
    @Autowired private DegreeStateRepository degreeStateRepository;
    @Autowired private DegreeSocialServiceRepository degreeSocialServiceRepository;
    @Autowired private DegreeCareerDgpRepository degreeCareerDgpRepository;
    @Autowired private DegreeCombinationDgpRepository degreeCombinationDgpRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private DegreeInstituteRepository degreeInstituteRepository;
    public List<Catalog> getAntecedents() {
        return degreeAntecedentRepository.findAll()
                .stream().filter(antecedent->antecedent.getId().equals(6))
                .map(antecedent -> new Catalog(antecedent.getId(), antecedent.getName(), antecedent.getType()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getReasons() {
        return degreeReasonRepository.findAll()
                .stream()
                .map(reason -> new Catalog(reason.getId(), reason.getName(), reason.getDescription()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getAuths() {
        return degreeAuthRepository.findAll()
                .stream()
                .map(auth -> new Catalog(auth.getId(), auth.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getModalities() {
        return degreeModalityRepository.findAll()
                .stream()
                .map(modality -> new Catalog(modality.getId(), modality.getName(), modality.getType()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getSigners() {
        return degreeModalityRepository.findAll()
                .stream()
                .map(signer -> new Catalog(signer.getId(), signer.getName(), signer.getType()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getSocialService() {
        return degreeSocialServiceRepository.findAll()
                .stream().filter(s->s.getId()==2)
                .map(socialService -> new Catalog(socialService.getId(), socialService.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getDegreeStates(Set<Integer> availableStateIds) {
        return degreeStateRepository.findAllById(availableStateIds)
                .stream().map(state -> new Catalog(state.getId(), state.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getDegreeCarrer(Integer schoolId){
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<CatDegreeCombinationDgp> carrer = criteriaQuery.from(CatDegreeCombinationDgp.class);
        predicates.add(builder.equal(carrer.get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.school).get(School_.id), schoolId));
        criteriaQuery.select(builder.construct(
                Catalog.class,
                carrer.get(CatDegreeCombinationDgp_.id),
                carrer.get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                carrer.get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name)
                ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(carrer.get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave)));
        TypedQuery<Catalog> typedQuery = entityManager.createQuery(criteriaQuery);
        List<Catalog> catalogList = typedQuery.getResultList();
        return catalogList;
    }

    public Integer getchooltId(String curp) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Integer> criteriaQuery = builder.createQuery(Integer.class);
        Root<Student> student = criteriaQuery.from(Student.class);
        predicates.add(builder.equal(student.get(Student_.user).get(User_.username), curp));
        criteriaQuery.select(builder.construct(Integer.class,
                student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.id)
        ));
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<Integer> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getResultList().stream().filter(integer->integer.intValue()>0).findFirst().get();
    }

    public List<DgpSchoolSelect> getDegreeSchools(Integer stateId, Set<Integer> availableSchoolIds) {

        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<CatDegreeInstitute> institute = criteriaQuery.from(CatDegreeInstitute.class);
        Join<CatDegreeInstitute, CatDegreeState> entity = institute.join(CatDegreeInstitute_.entity, JoinType.INNER);
        //predicates.add(builder.equal(institute.get(CatDegreeInstitute_.school).get(School_.id), availableSchoolIds));
        predicates.add(builder.equal(entity.get(CatDegreeState_.id), stateId));
        criteriaQuery.select(builder.construct(
                Catalog.class,
                institute.get(CatDegreeInstitute_.id),
                institute.get(CatDegreeInstitute_.clave),
                institute.get(CatDegreeInstitute_.name)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(institute.get(CatDegreeInstitute_.clave)));
        TypedQuery<Catalog> typedQuery = entityManager.createQuery(criteriaQuery);
        List<Catalog> catalogList = typedQuery.getResultList();

        List<DgpSchoolSelect> schoolList = new ArrayList<>();
        catalogList.forEach(row->{
            List<Catalog> career = getDegreeCarrers(row.getId());
            long totalCareer = career.stream().count();
            schoolList.add(new DgpSchoolSelect(row.getId(), row.getDescription1(), row.getDescription2(), totalCareer > 0 ? true: false, (int) totalCareer));
        });
        return schoolList;
    }

    public List<Catalog> getDegreeCarrers(Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);

        Root<CatDegreeCombinationDgp> carrer = criteriaQuery.from(CatDegreeCombinationDgp.class);
        Join<CatDegreeCombinationDgp, CatDegreeInstitute> institute = carrer.join(CatDegreeCombinationDgp_.institute, JoinType.INNER);
        predicates.add(builder.equal(carrer.get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.id), schoolId));
        criteriaQuery.select(builder.construct(
                Catalog.class,
                carrer.get(CatDegreeCombinationDgp_.id),
                carrer.get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.clave),
                carrer.get(CatDegreeCombinationDgp_.career).get(CatDegreeCareerDgp_.name)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(institute.get(CatDegreeInstitute_.clave)));
        TypedQuery<Catalog> typedQuery = entityManager.createQuery(criteriaQuery);
        List<Catalog> catalogList = typedQuery.getResultList();
        return catalogList;
    }

    public List<Catalog> degreeAllStates(Set<Integer> availableStateIds) {
        return degreeStateRepository.findAllById(availableStateIds)
                .stream().map(state -> new Catalog(state.getId(), state.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> careerAllDgp() {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<CatDegreeCareerDgp> careerDgp = criteriaQuery.from(CatDegreeCareerDgp.class);
        criteriaQuery.select(builder.construct(
                Catalog.class,
                careerDgp.get(CatDegreeCareerDgp_.id),
                careerDgp.get(CatDegreeCareerDgp_.clave),
                careerDgp.get(CatDegreeCareerDgp_.name)
                ));
        criteriaQuery.orderBy(builder.asc(careerDgp.get(CatDegreeCareerDgp_.clave)));
        TypedQuery<Catalog> typedQuery = entityManager.createQuery(criteriaQuery);
        List<Catalog> catalogList = typedQuery.getResultList();
        return catalogList;
    }

    public List<Catalog> searSchoolDgpFindById(Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<CatDegreeInstitute> institute = criteriaQuery.from(CatDegreeInstitute.class);
        predicates.add(builder.equal(institute.get(CatDegreeInstitute_.id), schoolId));
        criteriaQuery.multiselect(
                institute.get(CatDegreeInstitute_.id),
                institute.get(CatDegreeInstitute_.clave),
                institute.get(CatDegreeInstitute_.name)
        );
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        TypedQuery<Catalog> typedQuery = entityManager.createQuery(criteriaQuery);
        List<Catalog> catalogList = typedQuery.getResultList();
        return catalogList;
    }

    public List<Catalog> schoolsNormalAll() {
        return schoolRepository.findAll()
                .stream()
                .map(school -> new Catalog(school.getId(), school.getCct(), school.getName()))
                .collect(Collectors.toList());
    }

    public List<StudentPeriodDate> studentPeriodDate(Integer studentId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentPeriodDate> criteriaQuery = builder.createQuery(StudentPeriodDate.class);
        Root<Student> student = criteriaQuery.from(Student.class);
        predicates.add(builder.equal(student.get(Student_.id), studentId));
        criteriaQuery.select(builder.construct(
                StudentPeriodDate.class,
                student.get(Student_.enrollmentStartDate).as(java.sql.Date.class),
                student.get(Student_.enrollmentEndDate).as(java.sql.Date.class)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        TypedQuery<StudentPeriodDate> typedQuery = entityManager.createQuery(criteriaQuery);
        List<StudentPeriodDate> catalogList = typedQuery.getResultList();
        return catalogList;
    }

    public List<Catalog> stateListAll() {
        return degreeStateRepository.findAll()
                .stream()
                .map(state-> new Catalog(state.getId(), state.getName(), state.getAbbreviation()))
                .collect(Collectors.toList());
    }

    public DgpSchoolSelect getDegreeSchools2(Integer stateId, Integer intValue) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<CatDegreeInstitute> institute = criteriaQuery.from(CatDegreeInstitute.class);
        Join<CatDegreeInstitute, CatDegreeState> entity = institute.join(CatDegreeInstitute_.entity, JoinType.INNER);
        predicates.add(builder.equal(institute.get(CatDegreeInstitute_.school).get(School_.id), intValue));
        predicates.add(builder.equal(entity.get(CatDegreeState_.id), stateId));
        criteriaQuery.select(builder.construct(
                Catalog.class,
                institute.get(CatDegreeInstitute_.id),
                institute.get(CatDegreeInstitute_.clave),
                institute.get(CatDegreeInstitute_.name)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        criteriaQuery.orderBy(builder.asc(institute.get(CatDegreeInstitute_.clave)));
        TypedQuery<Catalog> typedQuery = entityManager.createQuery(criteriaQuery);
        List<Catalog> catalogList = typedQuery.getResultList();

        DgpSchoolSelect schoolList = new DgpSchoolSelect();

            catalogList.forEach(row->{
                List<Catalog> career = getDegreeCarrers(row.getId());
                long totalCareer = career.stream().count();
                schoolList.setId(row.getId());
                schoolList.setClave(row.getDescription1());
                schoolList.setName(row.getDescription2());
                schoolList.setHasACareer(totalCareer > 0 ? true: false);
                schoolList.setTotalCareer((int) totalCareer);
            });

        return schoolList;
    }
}
