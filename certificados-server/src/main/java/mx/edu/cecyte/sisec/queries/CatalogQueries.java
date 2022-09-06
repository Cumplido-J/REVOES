package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.catalogs.*;
import mx.edu.cecyte.sisec.model.catalogs.*;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.model.users.ScopeDetail;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.filters.CatalogQueriesFilter;
import mx.edu.cecyte.sisec.repo.PositionRepository;
import mx.edu.cecyte.sisec.repo.SubjectTypeRepository;
import mx.edu.cecyte.sisec.repo.catalogs.*;
import mx.edu.cecyte.sisec.repo.education.CareerRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.repo.users.ParticularPermissionRepository;
import mx.edu.cecyte.sisec.repo.users.PermissionsRepository;
import mx.edu.cecyte.sisec.repo.users.RoleBCSRepository;
import mx.edu.cecyte.sisec.repo.users.RoleRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CatalogQueries extends CatalogQueriesFilter {
    @Autowired private EntityManager entityManager;

    @Autowired private StateRepository stateRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private CareerRepository careerRepository;
    @Autowired private GenerationRepository generationRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PositionRepository positionRepository;
    @Autowired private CargosRepository cargosRepository;
    @Autowired private ParticularPermissionRepository particularPermissionRepository;
    @Autowired private PerfilTypeRepository perfilTypeRepository;
    @Autowired private EstudioTypeRepository estudioTypeRepository;
    @Autowired private DiciplinaryRepository diciplinaryRepository;
    @Autowired private SubjectTypeRepository subjectTypeRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private RoleBCSRepository roleBCSRepository;
    @Autowired private PermissionsRepository permissionsRepository;
    @Autowired private CatSchoolCycleRepository schoolCycleRepository;
    @Autowired private ConfigPeriodCertificateRepository configPeriodCertificateRepository;


    public List<Catalog> getStateCatalogs(Set<Integer> availableStateIds) {
        return stateRepository.findAllById(availableStateIds)
                .stream().map(state -> new Catalog(state.getId(), state.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getSchoolCatalogsByStateId(Integer stateId, Set<Integer> availableSchoolIds) {
        return schoolRepository.findAllByIdAndStateId(stateId, availableSchoolIds)
                .stream().map(school -> new Catalog(school.getId(), school.getCct(), school.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getCareersBySchoolId(Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<SchoolCareer> schoolCareer = criteriaQuery.from(SchoolCareer.class);

        Predicate predicateFilter;
        predicateFilter = filterCareersBySchoolId(builder, schoolCareer, schoolId);
        predicates.add(predicateFilter);

        criteriaQuery.select(builder.construct(
                Catalog.class,
                schoolCareer.get(SchoolCareer_.career).get(Career_.id),
                schoolCareer.get(SchoolCareer_.career).get(Career_.careerKey),
                schoolCareer.get(SchoolCareer_.career).get(Career_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<Catalog> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<Catalog> getCareersByStateId(Integer stateId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalog> criteriaQuery = builder.createQuery(Catalog.class);
        Root<SchoolCareer> schoolCareer = criteriaQuery.from(SchoolCareer.class);

        Predicate predicateFilter;
        predicateFilter = filterCareersByStateId(builder, schoolCareer, stateId);
        predicates.add(predicateFilter);

        criteriaQuery.select(builder.construct(
                Catalog.class,
                schoolCareer.get(SchoolCareer_.career).get(Career_.id),
                schoolCareer.get(SchoolCareer_.career).get(Career_.careerKey),
                schoolCareer.get(SchoolCareer_.career).get(Career_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<Catalog> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<Catalog> getCityCatalogs(Integer stateId) {
        CatState state = stateRepository.findById(stateId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        return state.getCities().stream().map(city -> new Catalog(city.getId(), city.getName())).collect(Collectors.toList());
    }

    public List<Catalog> getAllCareersCatalogs() {
        return careerRepository.findAll()
                .stream()
                .map(career -> new Catalog(career.getId(), career.getCareerKey(), career.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getModulesByCareer(Career career) {
        return career.getCareerModules()
                .stream()
                .map(careerModule -> new Catalog(careerModule.getId(), careerModule.getModule().getModule()))
                .collect(Collectors.toList());
    }

    public List<GenerationCatalog> getAllGenerationDes(){
        List<GenerationCatalog> list = new ArrayList<>();
        List<CatGeneration> generations = generationRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        for(CatGeneration generation: generations){
            list.add(new GenerationCatalog(generation.getGeneration(), generation.getGeneration()));
        }
        return list;
    }

    public List<Catalog> getRoleCatalogs(Set<Integer> availableStateIds) {
        return roleRepository.findAllById(availableStateIds)
                .stream().filter(role -> role.getId() != 3)
                .map(role -> new Catalog(role.getId(), role.getName(), role.getDescription()))
                .collect(Collectors.toList());
    }
    public List<Catalog> getCargoCatalogs(Set<Integer> availableStateIds) {
        return positionRepository.findAllById(availableStateIds)
                .stream().map(cargo -> new Catalog(cargo.getId(), cargo.getName()))
                .collect(Collectors.toList());
    }

    public CatPosition getCargoById( Integer idCargo) {
        return positionRepository.findById(idCargo).get();
    }

    public CatState getStateById(Integer idState){
        return stateRepository.findById(idState).get();
    }

    public School getSchoolById( Integer idSchool){
        return schoolRepository.findById(idSchool).get();
    }
    public List<CatalogOrder> getModulesByCareerOrder(Career career) {
        return career.getCareerModules()
                .stream()
                .map(careerModule -> new CatalogOrder(careerModule.getId(), careerModule.getModule().getModule(),careerModule.getOrder()))
                .collect(Collectors.toList());
    }
    public List<CargoCatalog> getCargosCatalogs() {
        return cargosRepository.findAll()
                .stream().map(cargo -> new CargoCatalog(cargo.getId(), cargo.getCargo()))
                .collect(Collectors.toList());
    }

    public List< Catalog > getPersonalRole( User user) {
        return particularPermissionRepository.findByUserAndStatus(user, true)
                .stream()
                .map(particularPermission -> new Catalog(particularPermission.getId(),particularPermission.getComponentPermission().getName()))
                .collect(Collectors.toList());
    }

    public List< Catalogdos > getCareersBySchoolIddos( Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Catalogdos> criteriaQuery = builder.createQuery(Catalogdos.class);
        Root<SchoolCareer> schoolCareer = criteriaQuery.from(SchoolCareer.class);

        Predicate predicateFilter;
        predicateFilter = filterCareersBySchoolId(builder, schoolCareer, schoolId);
        predicates.add(predicateFilter);

        criteriaQuery.select(builder.construct(
                Catalogdos.class,
                schoolCareer.get(SchoolCareer_.career).get(Career_.id),
                schoolCareer.get(SchoolCareer_.id),
                schoolCareer.get(SchoolCareer_.career).get(Career_.careerKey),
                schoolCareer.get(SchoolCareer_.career).get(Career_.name),
                schoolCareer.get(SchoolCareer_.school).get(School_.id)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        //criteriaQuery.groupBy(schoolCareer.get(SchoolCareer_.career).get(Career_.id));
        TypedQuery<Catalogdos> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<Catalog> getPerfil() {
        return perfilTypeRepository.findAll()
                .stream().map(perfil -> new Catalog(perfil.getId(), perfil.getName()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getEstudio() {
        return estudioTypeRepository.findAll()
                .stream().map(estudio -> new Catalog(estudio.getId(), estudio.getName()))
                .collect(Collectors.toList());
    }
    public List<Catalog> getDiciplinar() {
        return diciplinaryRepository.findAll()
                .stream().map(diciplina -> new Catalog(diciplina.getId(), diciplina.getStudyArea()!=null ? diciplina.getName()+" "+diciplina.getStudyArea():""+diciplina.getName() ))
                .collect(Collectors.toList());
    }
    public List<Catalog> getSubject() {
        return subjectTypeRepository.findAll()
                .stream().map(subject -> new Catalog(subject.getId(), subject.getAsignatureCompetencies()))
                .collect(Collectors.toList());
    }

    public List<CareerModuleCatalog> getCompetencias(Integer careerId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<CareerModuleCatalog> criteriaQuery = builder.createQuery(CareerModuleCatalog.class);
        Root< CareerModule > careerModule = criteriaQuery.from(CareerModule.class);

        Predicate predicateFilter;
        predicateFilter = filterCompetenciasByCareerId(builder, careerModule,careerId);
        predicates.add(predicateFilter);

        criteriaQuery.select(builder.construct(
                CareerModuleCatalog.class,
                careerModule.get(CareerModule_.id),
                careerModule.get(CareerModule_.career).get(Career_.id),
                careerModule.get(CareerModule_.module).get(Module_.module),
                careerModule.get(CareerModule_.order),
                careerModule.get(CareerModule_.credits),
                careerModule.get(CareerModule_.hours)
                //careerModule.get(CareerModule_.career).get(Career_.name)
        ));
        criteriaQuery.orderBy(builder.asc(careerModule.get(CareerModule_.order)));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<CareerModuleCatalog> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<Catalog> getCompetencias() {
        return moduleRepository.findAll()
                .stream().map(compet -> new Catalog(compet.getId(), compet.getModule(), compet.getEmsadCompetence()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getSubjectType() {
        return subjectTypeRepository.findAll()
                .stream().filter(subject->subject.getId()<=5)
                .map(subject-> new Catalog(subject.getId(), subject.getName(), subject.getAsignatureCompetencies()))
                .collect(Collectors.toList());
    }

    public List<Catalog> getDiciplinaryCompentenceIsNotNullTrayecto() {
        return diciplinaryRepository.findByStudyAreaIsNotNull()
                .stream().map(displinary -> new Catalog(displinary.getId(),displinary.getName(),displinary.getStudyArea()))
                .collect(Collectors.toList());
    }

    public Integer getStateId(User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getState().getId())
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceState));
    }

    public Integer getSearchAndComparabilityTheStateById(Integer stateId,User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> Objects.equals(scopeDetail.getState().getId(), stateId))
                .map( scopeDetail -> scopeDetail.getState().getId())
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceState));
    }

    public Integer getSchoolId(User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter(scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getSchool().getId() )
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceSchool));
    }

    public Integer getSearchAndComparabilityTheSchoolById(Integer schoolId,User userId){

        Integer stateId = getStateBySchoolId(schoolId);

        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> Objects.equals(scopeDetail.getState().getId(), stateId))
                .map( scopeDetail -> {
                    return scopeDetail.getSchool() != null ? scopeDetail.getSchool().getId() : schoolId;
                     })
                .filter(integer -> Objects.equals(integer, schoolId))
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceSchool))
        ;
    }

    public CatState getStateModel(User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> scopeDetail.getStatus() == true )
                .map(ScopeDetail::getState)
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceState));
    }

    public List< CatState> getAllStateModel(User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .sorted(Comparator.comparing(scopeDetail -> scopeDetail.getState().getId()) )
                .map(ScopeDetail::getState)
                .distinct()
                .collect(Collectors.toList());
    }

    public Integer getStateBySchoolId(Integer schoolId){
        School school = schoolRepository.findById(schoolId).orElseThrow(() -> new AppException(Messages.cantFindResourceSchool));
        //System.out.println("---->"+school.getCity().getState().getName());
        return school.getCity().getState().getId();
    }

    public List<Catalog> getAllGroups() {
        String pattern = "yyyy-MM-dd";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        return roleBCSRepository.findAll().stream().map(rolesBCS -> new Catalog(rolesBCS.getId(), rolesBCS.getName(),
                        simpleDateFormat.format(rolesBCS.getCreated())
                ))
                .collect(Collectors.toList());
    }

    public List<Catalog> getAllPermissions() {
        return permissionsRepository.findAll().stream().map( rolesBCS -> new Catalog(rolesBCS.getId(), rolesBCS.getName(),rolesBCS.getDetail() )).collect(Collectors.toList());
    }

    public List<Catalog> getSchoolCycle() {
        return schoolCycleRepository.findAllByStatus(true).stream()
                .sorted(Comparator.comparing(CatSchoolCycle::getId).reversed())
                .map(
                catSchoolCycle -> new Catalog( catSchoolCycle.getId(),catSchoolCycle.getGeneration() )
        ).collect(Collectors.toList());
    }

    public  CatGeneration getGeneration(String generaation){
        return generationRepository.findCatGeneration(generaation);
    }
    public boolean isExistStateIdAndGenerationId(Integer stateId, String generation) {
        return configPeriodCertificateRepository.isExistStateAndGeneration(stateId, generation) > 0;
    }

    public List<Catalog> selectPeriodFinished(Integer stateId, String generation, List<Catalog> catalogs) {
        ConfigPeriodCertificate periodCertificate = configPeriodCertificateRepository.selectPeriodFinished(stateId, generation);
        System.out.println("-->: "+periodCertificate.getDateStart()+"  "+periodCertificate.getEndDate1());
        System.out.println("--"+AppFunctions.parseDateToDegStringDate(periodCertificate.getDateStart()));
        LocalDate d1 = LocalDate.parse(periodCertificate.getDateStart().toString(), DateTimeFormatter.ISO_LOCAL_DATE);

        catalogs.add(new Catalog(1, periodCertificate.getEndDate1().toString(), periodCertificate.getGeneration().getGeneration()));
        catalogs.add(new Catalog(2, periodCertificate.getEndDate2().toString(), periodCertificate.getGeneration().getGeneration()));
        catalogs.add(new Catalog(3, periodCertificate.getEndDate3().toString(), periodCertificate.getGeneration().getGeneration()));
        return catalogs.stream().collect(Collectors.toList());
    }

}