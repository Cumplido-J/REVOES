package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.classes.SchoolFilter;
import mx.edu.cecyte.sisec.dto.dashboard.SchoolList;
import mx.edu.cecyte.sisec.dto.school.*;
import mx.edu.cecyte.sisec.model.catalogs.*;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.queries.filters.SchoolSearchFilter;
import mx.edu.cecyte.sisec.repo.catalogs.CityRepository;
import mx.edu.cecyte.sisec.repo.catalogs.EducationalOptionRepository;
import mx.edu.cecyte.sisec.repo.catalogs.IemsRepository;
import mx.edu.cecyte.sisec.repo.catalogs.SchoolTypeRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolCareerRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolEquivalentRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SchoolSearchQueries extends SchoolSearchFilter {
    @Autowired private EntityManager entityManager;

    @Autowired private SchoolRepository schoolRepository;
    @Autowired private CityRepository cityRepository;
    @Autowired private SchoolTypeRepository schoolTypeRepository;
    @Autowired private IemsRepository iemsRepository;
    @Autowired private EducationalOptionRepository educationalOptionRepository;
    @Autowired private CareerQueries careerQueries;
    @Autowired private SchoolCareerRepository schoolCareerRepository;
    @Autowired private SchoolCareerQueries schoolCareerQueries;
    @Autowired private SchoolEquivalentRepository schoolEquivalentRepository;

    public List<SchoolSearchResult> schoolSearch(SchoolFilter schoolFilter, Set<Integer> availableSchoolIds) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SchoolSearchResult> criteriaQuery = builder.createQuery(SchoolSearchResult.class);

        Root<School> school = criteriaQuery.from(School.class);
        Predicate filtro;

        if (AppFunctions.positiveInteger(schoolFilter.getStateId())) {
            filtro = stateFilter(builder, school, schoolFilter.getStateId());
            predicates.add(filtro);
        }

        if (AppFunctions.positiveInteger(schoolFilter.getCareerId())) {
            filtro = careerFilter(builder, school, schoolFilter.getCareerId());
            predicates.add(filtro);
        }

        if (AppFunctions.positiveInteger(schoolFilter.getSchoolTypeId())) {
            filtro = schoolTypeFilter(builder, school, schoolFilter.getSchoolTypeId());
            predicates.add(filtro);
        }

        if (!StringUtils.isEmpty(schoolFilter.getCct())) {
            filtro = cctFilter(builder, school, schoolFilter.getCct());
            predicates.add(filtro);
        }

        /*filtro = availableSchoolsFilter(availableSchoolIds, school);
        predicates.add(filtro);*/

        Predicate isCecyte = isCecyte(builder, school);

        criteriaQuery.select(builder.construct(
                SchoolSearchResult.class,
                school.get(School_.id),
                school.get(School_.cct),
                school.get(School_.name),
                school.get(School_.pdfFinalName),
                school.get(School_.status),
                school.get(School_.city).get(CatCity_.name),
                builder.selectCase().when(isCecyte, "CECyTE").otherwise("EMSaD"),
                school.get(School_.sinemsDate).as(java.sql.Date.class)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SchoolSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public School getSchoolByCct(String cct) {
        return schoolRepository.findByCct(cct).orElseThrow(() -> new AppException(Messages.school_doesntExist));
    }

    public School editSchool(School school, SchoolData schoolData) {
        Integer iemsId = AppFunctions.getIemsIdByStateId(schoolData.getStateId());
        Integer educationalOptionId = AppFunctions.getEducationalOptionBySchoolTypeId(schoolData.getSchoolTypeId());

        CatCity city = cityRepository.findById(schoolData.getCityId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatSchoolType schoolType = schoolTypeRepository.findById(schoolData.getSchoolTypeId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatIems iems = iemsRepository.findById(iemsId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatEducationalOption educationalOption = educationalOptionRepository.findById(educationalOptionId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        school.editSchoolData(schoolData, city, schoolType, iems, educationalOption);
        return schoolRepository.save(school);
    }

    public boolean cctExists(String cct) {
        return schoolRepository.countByCct(cct) > 0;
    }

    public School addNewSchool(SchoolData schoolData) {
        Integer iemsId = AppFunctions.getIemsIdByStateId(schoolData.getStateId());
        Integer educationalOptionId = AppFunctions.getEducationalOptionBySchoolTypeId(schoolData.getSchoolTypeId());

        CatCity city = cityRepository.findById(schoolData.getCityId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatSchoolType schoolType = schoolTypeRepository.findById(schoolData.getSchoolTypeId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatIems iems = iemsRepository.findById(iemsId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatEducationalOption educationalOption = educationalOptionRepository.findById(educationalOptionId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        School school = new School(schoolData, city, schoolType, iems, educationalOption);
        return schoolRepository.save(school);
    }

    public School getSchoolById(Integer schoolId) {
        return schoolRepository.findById(schoolId).orElseThrow(() -> new AppException(Messages.school_doesntExist));
    }

    public List<SchoolCareer> addNewSchoolCareer(SchoolCareerData schoolData) {
        System.out.println("");
        School school=getSchoolByCct(schoolData.getCct());
        List<Career> careers= careerQueries.findByIdList(schoolData.getCareerTypeId());
        List<SchoolCareer> schoolCareer=
                careers.stream().map(career -> new SchoolCareer(school , career)).collect(Collectors.toList());
        return schoolCareerRepository.saveAll(schoolCareer);
    }

    public void deleteSchoolCareer(SchoolCareerData schoolData) {
        Integer id= Integer.parseInt(schoolData.getCct());
        List<SchoolCareer>schoolCareer=schoolCareerQueries.findByCareerIdList(schoolData.getCareerTypeId(),id);
        schoolCareerRepository.deleteAll(schoolCareer);
    }

    public void deleteCareer(Integer id) {
        schoolCareerRepository.deleteById(id);
    }

    public boolean schooEquivalentExist(String cct) {
        return schoolEquivalentRepository.countByCct(cct) > 0;
    }

    public void addSchoolEquivalent(SchoolEquivalent equivalent) {
        schoolEquivalentRepository.save(equivalent);
    }

    public List<SchoolEquivalentData> selectSchoolEquivalent(Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SchoolEquivalentData> criteriaQuery = builder.createQuery(SchoolEquivalentData.class);

        Root<SchoolEquivalent> school = criteriaQuery.from(SchoolEquivalent.class);

        predicates.add(builder.equal(school.get(SchoolEquivalent_.school).get(School_.id), schoolId));

        criteriaQuery.select(builder.construct(
                SchoolEquivalentData.class,
                school.get(SchoolEquivalent_.school).get(School_.id),
                school.get(SchoolEquivalent_.cct),
                school.get(SchoolEquivalent_.pdfName),
                school.get(SchoolEquivalent_.city).get(CatCity_.id),
                school.get(SchoolEquivalent_.city).get(CatCity_.name),
                school.get(SchoolEquivalent_.city).get(CatCity_.state).get(CatState_.id),
                school.get(SchoolEquivalent_.city).get(CatCity_.state).get(CatState_.name),
                school.get(SchoolEquivalent_.id),
                school.get(SchoolEquivalent_.gender)
        ));

        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SchoolEquivalentData> typedQuery = entityManager.createQuery(criteriaQuery);
        List<SchoolEquivalentData> dataList = typedQuery.getResultList();
        return dataList;
    }

    public boolean isSchoolEquivalentExist(Integer schoolId) {
        return schoolEquivalentRepository.ifexistSchool(schoolId) > 0;
    }

    public SchoolEquivalent findBySchool(Integer schoolId) {
        return schoolEquivalentRepository.findBySchool(schoolId);
    }

    public void deleteSchoolEquivalent(SchoolEquivalent equivalent) {
        schoolEquivalentRepository.delete(equivalent);
    }

    public List<SchoolEquivalentSearchResult> schoolEquivalentSearch(SchoolFilter schoolFilter, Set<Integer> availableSchoolIds) {
        List<SchoolEquivalentSearchResult> result = new ArrayList<>();
        //List<SchoolSearchResult> resultList = schoolSearch(schoolFilter, availableSchoolIds);
        List<SchoolSearchResult> resultList = schoolFilterEquivalent(schoolFilter);

        resultList.forEach(row->{
            Optional<School> school = schoolRepository.findById(row.getIdschool());
            Integer stateId = school.get().getCity().getState().getId();
            boolean ifExist = isSchoolEquivalentExist(row.getIdschool());
            if (ifExist) ifExist = true;
            else ifExist = false;
            result.add(new SchoolEquivalentSearchResult(row.getIdschool(), row.getCct(), row.getName(), row.getFinalname(), row.getStatus(), row.getCity(), row.getSchoolType(), row.getSinemsDate(), ifExist, stateId));
        });
        return result;
    }

    private List<SchoolSearchResult> schoolFilterEquivalent(SchoolFilter schoolFilter) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SchoolSearchResult> criteriaQuery = builder.createQuery(SchoolSearchResult.class);

        Root<School> school = criteriaQuery.from(School.class);
        Predicate filtro;

        if (AppFunctions.positiveInteger(schoolFilter.getStateId())) {
            filtro = stateFilter(builder, school, schoolFilter.getStateId());
            predicates.add(filtro);
        }

        if (AppFunctions.positiveInteger(schoolFilter.getCareerId())) {
            filtro = careerFilter(builder, school, schoolFilter.getCareerId());
            predicates.add(filtro);
        }

        if (AppFunctions.positiveInteger(schoolFilter.getSchoolTypeId())) {
            filtro = schoolTypeFilter(builder, school, schoolFilter.getSchoolTypeId());
            predicates.add(filtro);
        }

        if (!StringUtils.isEmpty(schoolFilter.getCct())) {
            filtro = cctFilter(builder, school, schoolFilter.getCct());
            predicates.add(filtro);
        }

        //filtro = availableSchoolsFilter(availableSchoolIds, school);
        //predicates.add(filtro);

        Predicate isCecyte = isCecyte(builder, school);

        criteriaQuery.select(builder.construct(
                SchoolSearchResult.class,
                school.get(School_.id),
                school.get(School_.cct),
                school.get(School_.name),
                school.get(School_.pdfFinalName),
                school.get(School_.status),
                school.get(School_.city).get(CatCity_.name),
                builder.selectCase().when(isCecyte, "CECyTE").otherwise("EMSaD"),
                school.get(School_.sinemsDate).as(java.sql.Date.class)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SchoolSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public boolean hasSchoolEquivalent(School school) {
       return schoolEquivalentRepository.countBySchool(school)>0;
    }

    //codigo dasboard
    public List<SchoolSearchResult> schoolSearchByState(Integer stateId, Set<Integer> availableSchoolIds) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SchoolSearchResult> criteriaQuery = builder.createQuery(SchoolSearchResult.class);

        Root<School> school = criteriaQuery.from(School.class);
        Predicate filtro;

        if (AppFunctions.positiveInteger(stateId)) {
            filtro = stateFilter(builder, school, stateId);
            predicates.add(filtro);
        }

        filtro = availableSchoolsFilter(availableSchoolIds, school);
        predicates.add(filtro);

        Predicate isCecyte = isCecyte(builder, school);

        criteriaQuery.select(builder.construct(
                SchoolSearchResult.class,
                school.get(School_.id),
                school.get(School_.cct),
                school.get(School_.name),
                school.get(School_.pdfFinalName),
                school.get(School_.status),
                school.get(School_.city).get(CatCity_.name),
                builder.selectCase().when(isCecyte, "CECyTE").otherwise("EMSaD"),
                school.get(School_.sinemsDate).as(java.sql.Date.class)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SchoolSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }
    //codigo dashboard

    public List<SchoolList> getSchools(){
        return schoolRepository.findByLatitude()
                .stream().map(school -> new SchoolList(school.getId(), school.getName(), school.getLatitude(),school.getLongitude()))
                .collect(Collectors.toList());
    }
    public List<SchoolList> getStateSchool(Integer stateId){
        return schoolRepository.findByStateId(stateId)
                .stream().map(school -> new SchoolList(school.getId(), school.getName(), school.getLatitude(),school.getLongitude()))
                .collect(Collectors.toList());
    }
    public List<SchoolList> getStateSchoolById(Integer stateId,Integer id){
        return schoolRepository.findByStateIdAndSchoolId(stateId,id)
                .stream().map(school -> new SchoolList(school.getId(), school.getName(), school.getLatitude(),school.getLongitude()))
                .collect(Collectors.toList());
    }
    public List<SchoolList> getLatitudeSchoolById(Integer id){
        return schoolRepository.findByLatitudeAndSchoolId(id)
                .stream().map(school -> new SchoolList(school.getId(), school.getName(), school.getLatitude(),school.getLongitude()))
                .collect(Collectors.toList());
    }
}
