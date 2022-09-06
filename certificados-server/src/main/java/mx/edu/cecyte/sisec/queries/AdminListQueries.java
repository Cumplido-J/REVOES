package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.SelectListUser;
import mx.edu.cecyte.sisec.dto.user.ScopeDetailUtilFilter;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.model.users.*;
import mx.edu.cecyte.sisec.queries.filters.AdminListFilter;
import mx.edu.cecyte.sisec.repo.users.AdminUserScopeRepository;
import mx.edu.cecyte.sisec.repo.users.ScopeDetailRepository;
import mx.edu.cecyte.sisec.repo.users.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminListQueries extends AdminListFilter {

    @Autowired private EntityManager entityManager;
    @Autowired private UserRoleRepository userRoleRepository;
    @Autowired private AdminUserScopeRepository adminUserScopeRepository;
    @Autowired
    private ScopeDetailRepository scopeDetailRepository;
    @Autowired
    private UserQueries userQueries;
    /*public List<UserSearchResult> certificationAdminSearch(Integer stateId, Integer adminSchoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<UserSearchResult> criteriaQuery = builder.createQuery(UserSearchResult.class);
        Root<CertificationAdmin> certificationAdmin = criteriaQuery.from(CertificationAdmin.class);
        Integer rol = adminSchoolId == AppCatalogs.CATALOG_CERTIFY_ESTATAL ? AppCatalogs.BCS_ROLE_CERTIFICACION : AppCatalogs.BCS_ROLE_DIRECCION;
        Predicate predicateFilter;
        predicates.add(builder.equal(
                certificationAdmin.get(CertificationAdmin_.user).get(User_.userRolesBCS).get(UserRoleBCS_.rolebcs).get(RolesBCS_.id),rol
        ));
        if (AppFunctions.positiveInteger(stateId)) {
            predicateFilter = stateFilterCertificationAdmin(builder, certificationAdmin, stateId);
            predicates.add(predicateFilter);
        }
        criteriaQuery.select(builder.construct(
                UserSearchResult.class,
                certificationAdmin.get(CertificationAdmin_.user).get(User_.username),
                certificationAdmin.get(CertificationAdmin_.user).get(User_.name),
                certificationAdmin.get(CertificationAdmin_.user).get(User_.firstLastName),
                certificationAdmin.get(CertificationAdmin_.user).get(User_.secondLastName),
                certificationAdmin.get(CertificationAdmin_.state).get(CatState_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<UserSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();

    }*/

    //@Autowired private SchoolControlAdminRepository schoolControlAdminRepository;

    //@Autowired private GraduateTracingAdminRepository graduateTracingAdminRepository;

    /*public List<UserSearchResult> schoolControlAdminSearch(Integer stateId, Integer schoolId, Integer rolId, Integer check, Integer nivelCheck) {
        List<UserSearchResult> userSearchResult =new ArrayList<>();
        if (check == 0){
            userSearchResult = schoolControlAdminRepository.findByStateAndSchoolAndRole(rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        else if (check == 1 && nivelCheck == 1){
            userSearchResult = schoolControlAdminRepository.findByStateAndRole(stateId, rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        else if (check == 1 && nivelCheck == 2){
            userSearchResult = schoolControlAdminRepository.findByStateAndRole2(stateId, rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        else if (check == 2){
            userSearchResult = schoolControlAdminRepository.findBySchoolAndRole(schoolId,  rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        return userSearchResult;
    }*/

    /*public List<UserSearchResult>graduateTracingAdminSearch(Integer stateId, Integer schoolId, Integer rolId, Integer check, Integer nivelCheck) {
        List<UserSearchResult> userSearchResult =new ArrayList<>();
        if (check == 0){
            userSearchResult = graduateTracingAdminRepository.findByStateAndSchoolAndRole(rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        else if (check == 1 && nivelCheck == 1){
            userSearchResult = graduateTracingAdminRepository.findByStateAndRole(stateId, rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        else if (check == 1 && nivelCheck == 2){
            userSearchResult = graduateTracingAdminRepository.findByStateAndRole2(stateId, rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        else if (check == 2){
            userSearchResult = graduateTracingAdminRepository.findBySchoolAndRole(schoolId,  rolId)
                    .stream()
                    .map(UserSearchResult::new)
                    .collect(Collectors.toList());
        }
        return userSearchResult;
    }*/

   /* public List<UserSearchResult> tracingAdminSearch(Integer stateId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<UserSearchResult> criteriaQuery = builder.createQuery(UserSearchResult.class);

        Root<GraduateTracingAdmin> graduateTracingAdmin = criteriaQuery.from(GraduateTracingAdmin.class);
        Predicate predicateFilter;

        if (AppFunctions.positiveInteger(stateId)) {
            predicateFilter = stateFilterTracingAdmin(builder, graduateTracingAdmin, stateId);
            predicates.add(predicateFilter);
        }
        criteriaQuery.select(builder.construct(
                UserSearchResult.class,
                graduateTracingAdmin.get(GraduateTracingAdmin_.user).get(User_.username),
                graduateTracingAdmin.get(GraduateTracingAdmin_.user).get(User_.name),
                graduateTracingAdmin.get(GraduateTracingAdmin_.user).get(User_.firstLastName),
                graduateTracingAdmin.get(GraduateTracingAdmin_.user).get(User_.secondLastName),
                graduateTracingAdmin.get(GraduateTracingAdmin_.state).get(CatState_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<UserSearchResult> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();

    }*/

    public List<SelectListUser> searchAllRole(Role role) {
        return userRoleRepository.findAllByRole(role)
                .stream()
                .map(userRole -> new SelectListUser(userRole.getUser()))
                .collect(Collectors.toList());
    }

    public List<SelectListUser> searchAllRoleAndStateAndSchool(CatState state,Integer adminTypeId,Integer schoolId) {
        List<SelectListUser> resultList = new ArrayList<>();
        scopeDetailRepository.findAllByState(state).stream()
                .filter(scopeDetail -> scopeDetail.getCatUserScope()!=null)
                .filter( scopeDetail -> ScopeDetailUtilFilter.isSerch(scopeDetail,state,schoolId))
                .map(scopeDetail -> {
                    scopeDetail.getCatUserScope().getAdminUserScopes().stream().map(adminUserScope -> {
                        resultList.addAll(
                        adminUserScope.getUser().getUserRoles().stream()
                        .filter(userRole -> Objects.equals(userRole.getRole().getId(), adminTypeId))
                        .map(userRole -> {
                            return new SelectListUser(adminUserScope.getUser(),scopeDetail.getState().getName(),scopeDetail.getSchool()!=null?scopeDetail.getSchool().getName():"");
                        }).collect(Collectors.toList()));
                        return null;
                    }).collect(Collectors.toList());
                    return null;
                }).collect(Collectors.toList());
        return resultList;
    }

    public List<SelectListUser> searchUsername(String username) {
        User user = userQueries.getUserByUsername(username);
        List<SelectListUser> resultList = new ArrayList<>();
        resultList.add( new SelectListUser(user) );
        return  resultList;
    }

    public List<SelectListUser> devAdminSearch() {
        return userRoleRepository.findAllDev()
                .stream()
                .map(userRole -> new SelectListUser(userRole.getUser()))
                .collect(Collectors.toList());
    }

    public List<SelectListUser> selectListUser(Integer adminTypeId, Integer stateId, Integer schoolId) {
        System.out.println(adminTypeId+"--"+stateId+"--"+schoolId);
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SelectListUser> criteriaQuery = builder.createQuery(SelectListUser.class);

        Root<AdminUserScope> adminUserScope = criteriaQuery.from(AdminUserScope.class);
        Join<AdminUserScope, User> user = adminUserScope.join(AdminUserScope_.user);

        Root<UserRole> userRole = criteriaQuery.from(UserRole.class);
        Join<UserRole, Role> role = userRole.join(UserRole_.role);
        
        Root<ScopeDetail> scopeDetail = criteriaQuery.from(ScopeDetail.class);
        Join<ScopeDetail, CatUserScope> catUserScope = scopeDetail.join(ScopeDetail_.catUserScope);
        Join<ScopeDetail, CatState> state = scopeDetail.join(ScopeDetail_.state);
        Join<ScopeDetail, School> school = scopeDetail.join(ScopeDetail_.school);

        predicates.add(builder.equal(adminUserScope.get(AdminUserScope_.user).get(User_.id), userRole.get(UserRole_.user).get(User_.id)));
        //if(adminTypeId < 5) {
            predicates.add(builder.equal(adminUserScope.get(AdminUserScope_.catUserScope).get(CatUserScope_.id), scopeDetail.get(ScopeDetail_.catUserScope).get(CatUserScope_.id)));
        //}
        Predicate filterA = builder.equal(role.get(Role_.id), adminTypeId);
        System.out.println(filterA);
        Predicate filterB = builder.equal(state.get(CatState_.id), stateId);

        Predicate filterC = builder.equal(school.get(School_.id), schoolId);

        //if (adminTypeId != 0 && stateId == 0 && schoolId == 0) {
            predicates.add(filterA);
        //}
        if (adminTypeId != 0 && stateId != 0 && schoolId == 0) { predicates.add(filterB); }
        if (adminTypeId != 0 && stateId != 0 && schoolId != 0) { predicates.add(filterB); predicates.add(filterC); }

        criteriaQuery.multiselect(
                user.get(User_.username),
                user.get(User_.name),
                user.get(User_.firstLastName),
                user.get(User_.secondLastName),

                builder.selectCase()
                        .when(builder.isNotNull(state), state.get(CatState_.name))
                        .otherwise(("")),
                builder.selectCase()
                        .when(builder.isNotNull(school), school.get(School_.name))
                        .otherwise((""))
        );

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SelectListUser> typedQuery = entityManager.createQuery(criteriaQuery);

        return typedQuery.getResultList();
    }


    /*public List<UserSearchResult> degreeAdminSearch(Integer stateId, Integer adminSchoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<UserSearchResult> criteriaQuery = builder.createQuery(UserSearchResult.class);
        Root<DegreeAdmim> degreeAdmim = criteriaQuery.from(DegreeAdmim.class);
        Integer rol = adminSchoolId == AppCatalogs.CATALOG_DEGREE_ESTATAL ? AppCatalogs.BCS_ROLE_TITULACION : AppCatalogs.BCS_ROLE_DIRECCION;
        Predicate predicateFilter;
        predicates.add(builder.equal(
                degreeAdmim.get(DegreeAdmim_.user).get(User_.userRolesBCS).get(UserRoleBCS_.rolebcs).get(RolesBCS_.id), rol
        ));
        if (AppFunctions.positiveInteger(stateId)) {
            predicateFilter = stateFillterDegreeAdmin(builder, degreeAdmim, stateId);
            predicates.add(predicateFilter);
        }
        criteriaQuery.select(builder.construct(
                UserSearchResult.class,
                degreeAdmim.get(DegreeAdmim_.user).get(User_.username),
                degreeAdmim.get(DegreeAdmim_.user).get(User_.name),
                degreeAdmim.get(DegreeAdmim_.user).get(User_.firstLastName),
                degreeAdmim.get(DegreeAdmim_.user).get(User_.secondLastName),
                degreeAdmim.get(DegreeAdmim_.state).get(CatState_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<UserSearchResult> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getResultList();
    }*/
}
