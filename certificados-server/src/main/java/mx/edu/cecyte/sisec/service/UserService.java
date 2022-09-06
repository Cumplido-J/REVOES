package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.SelectListUser;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.catalogs.CatalogScope;
import mx.edu.cecyte.sisec.dto.people.PersonaData;
import mx.edu.cecyte.sisec.dto.user.*;
import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.people.Persona;
import mx.edu.cecyte.sisec.model.users.*;
import mx.edu.cecyte.sisec.queries.AdminListQueries;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.PersonaSearchQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeManagingRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.repo.people.PersonaRepository;
import mx.edu.cecyte.sisec.repo.users.*;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private AdminListQueries adminListQueries;
    @Autowired
    private UserQueries userQueries;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuditingQueries auditingQueries;
    @Autowired
    private RoleBCSRepository roleBCSRepository;
    @Autowired
    private PermissionsRepository permissionsRepository;

    @Autowired
    private CatUserScopeRepository catUserScopeRepository;

    @Autowired
    private ScopeDetailRepository scopeDetailRepository;

    @Autowired StateRepository stateRepository;
    @Autowired
    SchoolRepository schoolRepository;

    @Autowired private UserRoleBCSRepository userRoleBCSRepository;

    @Autowired private CatalogService catalogService;

    @Autowired private AdminUserScopeRepository adminUserScopeRepository;
    @Autowired private  UserRoleRepository userRoleRepository;

    @Autowired private RoleRepository roleRepository;

    @Autowired private UserRepository userRepository;

    @Autowired private DegreeManagingRepository degreeManagingRepository;

    @Autowired private PersonaSearchQueries personaSearchQueries;

    @Autowired private PersonaRepository personaRepository;

    @Autowired private PersonaService personaService;


    private void validateIsDevAdmin( Integer adminId ) {
        User userAdmin = userQueries.getUserById(adminId);

        boolean isDevAdmin = userQueries.isDevAdmin(userAdmin);
        if (!isDevAdmin) throw new AppException(Messages.dev_noPermissions);
    }

    /*public List<UserSearchResult> adminSearch(Integer adminId, AdminFilter adminFilter) {
        validateIsDevAdmin(adminId);

        if (adminFilter.getAdminTypeId().equals(AppCatalogs.ADMINTYPE_CERTIFICATION))
            return adminListQueries.certificationAdminSearch(adminFilter.getStateId(), adminFilter.getAdminSchoolId());

        if (adminFilter.getAdminTypeId().equals(AppCatalogs.ADMINTYPE_SCHOOLCONTROL)) {
            Integer rol =0;
            Integer check = adminFilter.getSchoolId() > 0 ? 2 : adminFilter.getStateId() > 0 ? 1 : 0 ;
            if (adminFilter.getCheckAdminNivel() == AppCatalogs.CHECK_NIVEL_ESTATAL ){
                rol =adminFilter.getSuperUserId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL;
            }else if(adminFilter.getCheckAdminNivel() == AppCatalogs.CHECK_NIVEL_PLANTEL){
                rol =adminFilter.getSuperUserId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL;
            }
            return adminListQueries.schoolControlAdminSearch(adminFilter.getStateId(), adminFilter.getSchoolId(), rol ,check, adminFilter.getCheckAdminNivel());
        }
        if (adminFilter.getAdminTypeId().equals(AppCatalogs.ADMINTYPE_TRACING)) {
            Integer check = adminFilter.getSchoolId() > 0 ? 2 : adminFilter.getStateId() > 0 ? 1 : 0 ;
            Integer rol = adminFilter.getCheckAdminNivel() == AppCatalogs.CHECK_NIVEL_ESTATAL ? AppCatalogs.BCS_ROLE_SEGUIMIENTO_ESTATAL : AppCatalogs.BCS_ROLE_SEGUIMIENTO_PLANTEL;
            return adminListQueries.graduateTracingAdminSearch(adminFilter.getStateId(),adminFilter.getSchoolId(), rol,check, adminFilter.getCheckAdminNivel());
        }
        if (adminFilter.getAdminTypeId().equals(AppCatalogs.ADMINTYPE_DEV))
            return adminListQueries.devAdminSearch();

        if (adminFilter.getAdminTypeId().equals(AppCatalogs.ADMINTYPE_TITULACION))
            return adminListQueries.degreeAdminSearch(adminFilter.getStateId(), adminFilter.getAdminSchoolId());

        throw new AppException(Messages.adminSearch_incorrectAdminType);
    }*/

    public UserData getUserData( String userName, Integer adminId) {
        validationDev(adminId);
        User user = userQueries.getUserByUsername(userName);

        boolean curpExists = personaSearchQueries.curpExists(userName);
        Persona persona = null;
        if (curpExists) {
            persona = personaRepository.findByCurp(userName).orElseThrow(() -> new AppException(Messages.user_wrongUsername));
        };

        //Set<Integer> rolesId = userQueries.getRolesIdByUser(user);
        //int[] array = rolesId.stream().mapToInt(Integer::intValue).toArray();
        //int rol=array[0];
        return new UserData(user, persona);
    }


    /*public UserData editUser(UserData userData, String username, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");

        boolean usernameExists = userQueries.usernameExists2(userData.getUsername(),userData.getId());
        if (usernameExists){ throw new AppException(Messages.user_usernameIsInUse);}
        User user =userQueries.getUserById(userData.getId());
        user.editUser2(userData);
        //CatState catStateNew = userData.getStateId() != 0 ? catalogService.getStateById(userData.getStateId()) : null;
        if (AppCatalogs.ROLE_SCHOOL_CONTROL == userData.getRoleId()){
            if (AppCatalogs.CHECK_NIVEL_ESTATAL == userData.getCheckAdminNivel()){
                if(userQueries.userSearchAdmin(userData.getId()) == 1 && (userData.getAdminSchoolId() == AppCatalogs.CATALOG_CERTIFY_ESTATAL || userData.getAdminSchoolId() == AppCatalogs.CATALOG_DIRECTOR_ESTATAL)){
                    user = userQueries.editUserRole_CERTIFICATION_ADMIN(userData,user);
                    userData.setRoleId(AppCatalogs.ROLE_CERTIFICATION_ADMIN);
                }
                else if (userQueries.userSearchAdmin(userData.getId()) == 2 && (userData.getAdminSchoolId() == AppCatalogs.CATALOG_DEGREE_ESTATAL || userData.getAdminSchoolId() == AppCatalogs.CATALOG_DIRECTOR_ESTATAL)){
                    user = userQueries.editUserRole_DEGREE_ADMIN(userData, user);
                    userData.setRoleId(AppCatalogs.ROLE_TITULACION_ADMIN);
                } else {
                    user =userQueries.editUserRole_SCHOOL_CONTROL(userData,user);
                }
            }
            else if(AppCatalogs.CHECK_NIVEL_PLANTEL == userData.getCheckAdminNivel()){
                user =userQueries.editUserRole_SCHOOL_CONTROL(userData,user);
            }
        }
        else if (AppCatalogs.ROLE_TRACING_ADMIN == userData.getRoleId()){
            user = userQueries.editUserROLE_TRACING_ADMIN(userData,user);
        }
        else if (AppCatalogs.ROLE_DEV == userData.getRoleId()){
            userQueries.editUser(user);
        }
        auditingQueries.saveAudit("UserService", "editUser", adminId, User.class, user.getId(), "Update user");
        return new UserData(user,userData.getRoleId());
    }*/

    /*public UserData addNewUser(UserData userData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");

        boolean usernameExists = userQueries.usernameExists(userData.getUsername());
        if (usernameExists){ throw new AppException(Messages.user_usernameIsInUse);}
        User user = new User(userData);
        user.setPassword(passwordEncoder.encode(userData.getPassword()));
        //CatState catStateNew = userData.getStateId() != 0 ? catalogService.getStateById(userData.getStateId()) : null;
        int idRol =0;
        if (AppCatalogs.ROLE_SCHOOL_CONTROL == userData.getRoleId()){
            if (AppCatalogs.CHECK_NIVEL_ESTATAL == userData.getCheckAdminNivel()){
                if(userData.getAdminSchoolId() == AppCatalogs.CATALOG_CERTIFY_ESTATAL || userData.getAdminSchoolId() == AppCatalogs.CATALOG_DIRECTOR_ESTATAL ) {
                    user = userQueries.addNewUserRole_CERTIFICATION_ADMIN(userData,user);
                    idRol =AppCatalogs.ROLE_CERTIFICATION_ADMIN;
                } else if (userData.getAdminSchoolId() == AppCatalogs.CATALOG_DEGREE_ESTATAL || userData.getAdminSchoolId() == AppCatalogs.CATALOG_DIRECTOR_ESTATAL ) {
                    user = userQueries.addNewUserRole_TITULACION_ADMIN(userData, user);
                    idRol = AppCatalogs.ROLE_TITULACION_ADMIN;

                } else {
                    user = userQueries.addNewUserRole_SCHOOL_CONTROL(userData,user);
                    idRol =AppCatalogs.ROLE_SCHOOL_CONTROL;
                }


            }
            else if(AppCatalogs.CHECK_NIVEL_PLANTEL == userData.getCheckAdminNivel()){
                user = userQueries.addNewUserRole_SCHOOL_CONTROL(userData,user); idRol =AppCatalogs.ROLE_SCHOOL_CONTROL;
            }
        }
        else if (AppCatalogs.ROLE_TRACING_ADMIN == userData.getRoleId()){
            user = userQueries.addNewUserROLE_TRACING_ADMIN(userData,user); idRol =AppCatalogs.ROLE_TRACING_ADMIN;
        }
        else if (AppCatalogs.ROLE_DEV == userData.getRoleId()){
            user = userQueries.addNewUserROLE_DEV(userData,user); idRol =AppCatalogs.ROLE_DEV;
        }
        auditingQueries.saveAudit("UserService", "addNewUser", adminId, User.class, user.getId(), "Created user");
        return new UserData(user,idRol);
    }*/

    public void editUserPassword( String userName, Integer adminId, UserData userData ) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin = userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");

        User user = userQueries.getUserByUsername(userName);
        user = userQueries.editUserPassword(user, userData.getPassword());
        auditingQueries.saveAudit("UserService", "editUserPassword", adminId, User.class, user.getId(), "Edited user password");
    }

    public User getUserByCURP( String CURP ) {
        User user = userQueries.getUserByUsername(CURP);
        if (user.getId().equals(""))
            throw new AppException(Messages.school_noEditPermissions);
        return user;
    }

    public void validationDev( Integer adminId ) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin = userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
    }

    public void addGroup( GroupData groupData, Integer adminId ) {
        validationDev(adminId);
        RolesBCS rolesBCS = new RolesBCS(groupData);
        boolean groupnameExists = userQueries.findByRoleBCSByName(rolesBCS.getName());
        if (groupnameExists) {
            throw new AppException(Messages.nameIsInUse);
        }
        roleBCSRepository.save(rolesBCS);
        auditingQueries.saveAudit("UserService", "addGroup", adminId, User.class, adminId, "Add Group");
    }

    public GroupData findByGroup( Integer id, Integer adminId ) {
        validationDev(adminId);
        return new GroupData(roleBCSRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource)));
    }

    public void updateGroup( GroupData groupData, Integer adminId ) {
        validationDev(adminId);
        RolesBCS rolesBCS = roleBCSRepository.findById(groupData.getId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        rolesBCS.RolesBCSUpdate(groupData);
        boolean groupnameExists = userQueries.findByRoleBCSByNameAndIdNot(rolesBCS.getName(), rolesBCS.getId());
        if (groupnameExists) {
            throw new AppException(Messages.nameIsInUse);
        }
        roleBCSRepository.save(rolesBCS);
        auditingQueries.saveAudit("UserService", "updateGroup", adminId, User.class, adminId, "updateGroup");
    }

    public void deleteGroup( GroupData groupData, Integer adminId ) {
        validationDev(adminId);
        boolean groupnameExists = userQueries.findByRoleBCSById(groupData.getId());
        if (!groupnameExists) {
            throw new AppException(Messages.registrationIsNotExist);
        }
        boolean isExistsAssociation = userQueries.isExistsAssociationWithPermissionAndUserTheGroup(groupData.getId());
        if (!isExistsAssociation) {
            throw new AppException(Messages.isExistAssociation);
        }
        roleBCSRepository.deleteById(groupData.getId());
        auditingQueries.saveAudit("UserService", "deleteGroup", adminId, User.class, adminId, "deleteGroup");
    }

    public void addPermission( GroupData groupData, Integer adminId ) {
        validationDev(adminId);
        Permissions permissions = new Permissions(groupData);
        boolean nameExists = userQueries.findByPermissionByName(permissions.getName());
        if (nameExists) {
            throw new AppException(Messages.nameIsInUse);
        }
        permissionsRepository.save(permissions);
        auditingQueries.saveAudit("UserService", "addPermission", adminId, User.class, adminId, "Add Permission");
    }

    public GroupData findByPermission( Integer id, Integer adminId ) {

        validationDev(adminId);
        return new GroupData(permissionsRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource)));
    }

    public void updatePermission( GroupData groupData, Integer adminId ) {
        validationDev(adminId);
        Permissions permissions = permissionsRepository.findById(groupData.getId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        permissions.PermissionUpdate(groupData);
        boolean nameExists = userQueries.findByPermissionByNameAndIdNot(permissions.getName(), permissions.getId());
        if (nameExists) {
            throw new AppException(Messages.nameIsInUse);
        }
        permissionsRepository.save(permissions);
        auditingQueries.saveAudit("UserService", "updatePermission", adminId, User.class, adminId, "updatePermission");
    }

    public void deletePermission( GroupData groupData, Integer adminId ) {
        validationDev(adminId);
        boolean nameExists = userQueries.findByPermissionById(groupData.getId());
        if (!nameExists) {
            throw new AppException(Messages.registrationIsNotExist);
        }
        boolean isExistsAssociation = userQueries.isExistsAssociationWithPermissionAndUserThePermission(groupData.getId());
        if (!isExistsAssociation) {
            throw new AppException(Messages.isExistAssociation);
        }
        permissionsRepository.deleteById(groupData.getId());
        auditingQueries.saveAudit("UserService", "deletePermission", adminId, User.class, adminId, "deletePermission");
    }

    public Set< TransferPermissionData > findByPermissionNotAssignedToGroup( Integer id ) {
        Set< TransferPermissionData > resultList = new HashSet<>();
        RolesBCS rolesBCS = roleBCSRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        List< Integer > ids = rolesBCS.getPermissions().stream().sorted(Comparator.comparing(Permissions::getId))
                .distinct()
                .map(permissions -> {
                    resultList.add(new TransferPermissionData(permissions.getId(), permissions.getName(), 0));
                    return permissions.getId();
                })
                .collect(Collectors.toList());
        if (ids.isEmpty()) {
            permissionsRepository.findAll().stream().sorted(Comparator.comparing(Permissions::getId))
                    .distinct()
                    .map(permissions -> resultList.add(new TransferPermissionData(permissions.getId(), permissions.getName(), 1)))
                    .collect(Collectors.toList());
        }
        else {
            permissionsRepository.findByIdNotIn(ids)
                    .stream().sorted(Comparator.comparing(Permissions::getId))
                    .distinct()
                    .map(permissions -> resultList.add(new TransferPermissionData(permissions.getId(), permissions.getName(), 1)))
                    .collect(Collectors.toList());
        }
        return resultList;
    }

    public void addPermissionTheGroup( ListGroupData groupData, Integer adminId ) {
        validationDev(adminId);
        List< Permissions > permissions =permissionsRepository.findAllById(groupData.getIdPermission());
        RolesBCS rolesBCS = roleBCSRepository.findById(groupData.getIdGroup()).orElseThrow(() -> new AppException(Messages.registrationIsNotExist));

        permissions.forEach(permissions1 -> permissions1.addGroups(rolesBCS) );

        auditingQueries.saveAudit("UserService", "addPermissionTheGroup", adminId, User.class, adminId, "addPermissionTheGroup");
    }

    public void removePermissionTheGroup( ListGroupData groupData,Integer adminId) {
        validationDev(adminId);
        List< Permissions > permissions =permissionsRepository.findAllById(groupData.getIdPermission());
        RolesBCS rolesBCS = roleBCSRepository.findById(groupData.getIdGroup()).orElseThrow(() -> new AppException(Messages.registrationIsNotExist));

        permissions.forEach(permissions1 -> permissions1.removeGroups(rolesBCS) );
        auditingQueries.saveAudit("UserService", "removePermissionTheGroup", adminId, User.class, adminId, "removePermissionTheGroup");
    }

    public List<TransferPermissionData> findByPermissionOfGroup( Integer id, Integer adminId ) {
        validationDev(adminId);
        RolesBCS rolesBCS= roleBCSRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        List<TransferPermissionData> permissionData = rolesBCS.getPermissions().stream().sorted(Comparator.comparing(Permissions::getId))
                .distinct()
                .map(permissions -> new TransferPermissionData( permissions.getId(),permissions.getName()))
                .collect(Collectors.toList());
        return permissionData;
    }

    public List<SuggestionGroupAndPermiissionData> SuggestionGroupAndPermiissionData( ListGroupData listGroupData, Integer adminId ) {

        List<RolesBCS> rolesBCSRows= roleBCSRepository.findAllById(listGroupData.getIdPermission());
        List<SuggestionGroupAndPermiissionData> suggestionGroupAndPermiissionData = rolesBCSRows.stream().map(
                rolesBCS -> {
                    List<TransferKeyData> children= rolesBCS.getPermissions().stream().map(
                            permissions -> new TransferKeyData("0-"+rolesBCS.getId()+"-"+permissions.getId(), permissions.getName())
                    ).collect(Collectors.toList());

                    return new SuggestionGroupAndPermiissionData("0-"+rolesBCS.getId(),rolesBCS.getName(),children);
                }
        ).collect(Collectors.toList());

        return suggestionGroupAndPermiissionData;
    }

    public List<Catalog> getAllScope() {
        return catUserScopeRepository.findAll().stream().map(catUserScope -> new Catalog(catUserScope.getId(),catUserScope.getName())).collect(Collectors.toList());
    }

    public List<Catalog> getAllScope2() {
        return catUserScopeRepository.findAll().stream().map(catUserScope -> new Catalog(catUserScope.getId(),catUserScope.getName(),catUserScope.getDescription())).collect(Collectors.toList());
    }

    public List<CatalogScope> getAllScopeDetail() {

        return scopeDetailRepository.findAll().stream().map(scopeDetail -> {
                    CatalogScope scope = new CatalogScope();
                    if (scopeDetail.getSchool()!=null) {
                        scope = new CatalogScope(scopeDetail.getId(), scopeDetail.getState().getName(), scopeDetail.getSchool().getName(), scopeDetail.getStatus() ? 1 : 0);
                    }else {
                        scope = new CatalogScope(scopeDetail.getId(), scopeDetail.getState().getName(), scopeDetail.getStatus() ? 1 : 0);
                    }
                    return scope;
                }).sorted(Comparator.comparing(CatalogScope::getId))
                .collect(Collectors.toList());


    }

    public List<SuggestionGroupAndPermiissionData> getAllScopeDetailByIdUserScope(Integer id) {
        CatUserScope catUserScope = catUserScopeRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        List< SuggestionGroupAndPermiissionData > suggestionGroupAndPermiissionData =
                catUserScope.getScopeDetails().stream()
                        .map(
                                scopeDetail -> {
                                    if (scopeDetail.getSchool()!=null) {
                                        return new SuggestionGroupAndPermiissionData("0-"+scopeDetail.getId(),scopeDetail.getState().getName()+" "+scopeDetail.getSchool().getName() + " CCT :" + scopeDetail.getSchool().getCct() );
                                    }else {
                                        List<TransferKeyData> transferKeyData = schoolRepository.findAllByStateId(scopeDetail.getState().getId()).stream().map(school -> new TransferKeyData("0-" + scopeDetail.getId() + "-" + school.getId(), school.getName() + " CCT:" + school.getCct())).collect(Collectors.toList());
                                        return new SuggestionGroupAndPermiissionData("0-"+scopeDetail.getId(),scopeDetail.getState().getName(),transferKeyData);
                                    }
                                }
                        ).sorted(Comparator.comparing(SuggestionGroupAndPermiissionData::getTitle)).collect(Collectors.toList());

        return suggestionGroupAndPermiissionData;
    }

    public UserData addNewUser(UserData userData, Integer adminId) {
        validationDev(adminId);
        boolean usernameExists = userQueries.usernameExists(userData.getUsername());
        if (usernameExists){ throw new AppException(Messages.user_usernameIsInUse);}
        User user = new User(userData);
        user.setPassword(passwordEncoder.encode(userData.getPassword()));

        UserRole userRole =userQueries.getByidRoleUser(user, userData.getRoleId());

        UserRoleBCS userRoleBCS= saveUserGroup(userData.getGroupId(),user);

        CatUserScope catUserScope= catUserScopeRepository.findById(userData.getScopeId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        CatPosition catPosition =  userData.getCargoId() != 0 ? catalogService.getCargoById(userData.getCargoId()) : null;

        AdminUserScope adminUserScope= new AdminUserScope(user,catPosition,false,catUserScope);

        if (userData.getCargoIdTitulo() != 0){
            PersonaData personaData= new PersonaData(userData);
            personaSearchQueries.addNewPersona(personaData);
        }
        userQueries.addNewUser(user);
        userRoleBCSRepository.save(userRoleBCS);
        adminUserScopeRepository.save(adminUserScope);
        userRoleRepository.save(userRole);
        auditingQueries.saveAudit("UserService", "addNewUser", adminId, User.class, adminId, "addNewUser");
        return userData;
    }

    public UserRoleBCS saveUserGroup(Integer idGroup, User user){
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(idGroup);
        return new UserRoleBCS(rolesBCS,"App\\Usuario",user);
    }

    public UserData editUser(UserData userData, String username, Integer adminId) {
        validationDev(adminId);
        boolean usernameExists = userQueries.usernameExists2(userData.getUsername(),userData.getId());
        if (usernameExists){ throw new AppException(Messages.user_usernameIsInUse);}
        User user =userQueries.getUserById(userData.getId());
        user.editUser2(userData);

        Role roleUser = roleRepository.findById(userData.getRoleId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        UserRole userRole = userRoleRepository.findById(user.getUserRoles().stream().map(UserRole::getId).findFirst().orElse(0)).orElseThrow(() -> new AppException(Messages.cantFindResourceMec));
        userRole.setRole(roleUser);

        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(userData.getGroupId());
        UserRoleBCS userRoleBCS= user.getUserRolesBCS();
        userRoleBCS.setRolebcs(rolesBCS);

        CatPosition catPosition =  userData.getCargoId() != 0 ? catalogService.getCargoById(userData.getCargoId()) : null;
        CatUserScope catUserScope= catUserScopeRepository.findById(userData.getScopeId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        AdminUserScope adminUserScope= user.getAdminUserScope();
        adminUserScope.setPosition(catPosition);
        adminUserScope.setCatUserScope(catUserScope);

        Persona persona = null;
        if (userData.getCargoIdTitulo() != 0) {
            PersonaData personaData = new PersonaData(userData);

            persona = personaService.editPersonaDuplicatedUser(personaData, username);
        }
        userRepository.save(user);
        userRoleBCSRepository.save(userRoleBCS);
        adminUserScopeRepository.save(adminUserScope);
        userRoleRepository.save(userRole);
        auditingQueries.saveAudit("UserService", "editUser", adminId, User.class, adminId, "editUser");
        return new UserData(user, persona);
    }

    public void addNewCatScope(CatalogScope scope, Integer adminId) {
        validationDev(adminId);
        boolean nameExists = userQueries.findByCatScopeByName(scope.getDescription2());
        if (nameExists) { throw new AppException(Messages.nameIsInUse); }
        CatUserScope catUserScope = new CatUserScope(scope.getDescription2(), scope.getDescription3());
        catUserScopeRepository.save(catUserScope);
        auditingQueries.saveAudit("UserService", "addNewCatScope", adminId, User.class, adminId, "addNewCatScope");
    }

    public void editCatScope(CatalogScope scope, Integer adminId) {
        validationDev(adminId);
        boolean nameExists = userQueries.findByCatScopeByNameAndIdNot(scope.getDescription2(), scope.getId());
        if (nameExists) { throw new AppException(Messages.nameIsInUse); }
        CatUserScope catUserScope = catUserScopeRepository.findById(scope.getId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        catUserScope.setName(scope.getDescription2());
        catUserScope.setDescription(scope.getDescription3());
        catUserScopeRepository.save(catUserScope);
        auditingQueries.saveAudit("UserService", "editCatScope", adminId, User.class, adminId, "editCatScope");
    }

    public CatalogScope getByIdCatScope(Integer idCat){
        return new CatalogScope(catUserScopeRepository.findById(idCat).orElseThrow(() -> new AppException(Messages.database_cantFindResource)));
    }

    public void deleteCatScope( CatalogScope scope, Integer adminId ) {
        validationDev(adminId);

        boolean isExistsAssociation = userQueries.isExistsAssociationWithPermissionAndUserTheCatScope(scope.getId());
        if (!isExistsAssociation) {
            throw new AppException(Messages.isExistAssociation);
        }
        catUserScopeRepository.deleteById(scope.getId());
        auditingQueries.saveAudit("UserService", "deleteCatScope", adminId, User.class, adminId, "deleteCatScope");
    }

    public List<SelectListUser> selectListUser(Integer id, Integer adminTypeId, Integer stateId, Integer schoolId, String username) {
        List<SelectListUser> list = new ArrayList<>();
        if (adminTypeId >0){
            Role role = roleRepository.findById(adminTypeId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
            if ( stateId < 1) {
                list = adminListQueries.searchAllRole(role);
            }else if (stateId > 0 ){
                CatState state = stateRepository.findById(stateId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
                list = adminListQueries.searchAllRoleAndStateAndSchool(state, adminTypeId, schoolId);
            }
        }else if (!username.equals("")){
            list = adminListQueries.searchUsername(username);
        }
        /*if (adminTypeId.equals(1)) {
            list = adminListQueries.devAdminSearch();
        }
        if (adminTypeId != 1) {
            list = adminListQueries.selectListUser(adminTypeId, stateId, schoolId);
        }*/


        return list;
    }

    public void addNewScope(scopeData data, Integer adminId) {
        validationDev(adminId);
        CatState state = stateRepository.findById(data.getStateId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        School school = null;
        if (data.getSchoolId() != 0){
            school = schoolRepository.findById(data.getSchoolId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        }
        //Boolean noRepeat=userQueries.findByScopeByStateAndSchool(state, school);
        //if ( noRepeat ) { throw new AppException(Messages.recordInUse); }
        Boolean status= data.getStatusId() == 1;
        ScopeDetail scopeDetail = new ScopeDetail(state, school, status);
        scopeDetailRepository.save(scopeDetail);
        auditingQueries.saveAudit("UserService", "addNewScope", adminId, User.class, adminId, "addNewScope");
    }

    public scopeData getByIdScope(Integer idCat){
        return new scopeData(scopeDetailRepository.findById(idCat).orElseThrow(() -> new AppException(Messages.database_cantFindResource)));
    }

    public void updateScope(scopeData data, Integer adminId) {
        validationDev(adminId);
        ScopeDetail scopeDetail = scopeDetailRepository.findById(data.getId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatState state = stateRepository.findById(data.getStateId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        School school = scopeDetail.getSchool();
        if (data.getSchoolId() != 0){
            school = schoolRepository.findById(data.getSchoolId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        }
        //Boolean noRepeat=userQueries.findByScopeByStateAndSchoolIsNot(state, school, data.getId());
        //if ( noRepeat ) { throw new AppException(Messages.recordInUse); }
        Boolean status= data.getStatusId() == 1;
        scopeDetail.updateScopeDetail(state, school, status);
        scopeDetailRepository.save(scopeDetail);

        auditingQueries.saveAudit("UserService", "updateScope", adminId, User.class, adminId, "updateScope");
    }

    public void deleteScope(scopeData data, Integer adminId) {
        validationDev(adminId);
        boolean isExistsAssociation = userQueries.isExistsAssociationWithPermissionAndUserTheScope(data.getId());
        if (isExistsAssociation) {
            throw new AppException(Messages.isExistAssociation);
        }
        scopeDetailRepository.deleteById(data.getId());

        auditingQueries.saveAudit("UserService", "deleteScope", adminId, User.class, adminId, "deleteScope");
    }

    public Set< TransferPermissionData > findByPermissionNotAssignedToScope( Integer id ) {
        Set< TransferPermissionData > resultList = new HashSet<>();
        CatUserScope catUserScope = catUserScopeRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        List< Integer > ids = catUserScope.getScopeDetails().stream().sorted(Comparator.comparing(scopeDetail -> scopeDetail.getState().getName()))
                .map(
                    scopeDetail -> {
                        String name= scopeDetail.getSchool() != null ? scopeDetail.getSchool().getName():"";
                        resultList.add(new TransferPermissionData(scopeDetail.getId(), scopeDetail.getId()+") "+scopeDetail.getState().getName()+" "+name,0));
                        return scopeDetail.getId();
                    }
                ).collect(Collectors.toList());
        if (ids.isEmpty()) {
            scopeDetailRepository.findAllByCatUserScopeIsNull().stream().sorted(Comparator.comparing(scopeDetail -> scopeDetail.getState().getName()))
                    .map(scopeDetail -> {

                                String name =  scopeDetail.getSchool() != null ? scopeDetail.getSchool().getName() : "";
                                return resultList.add(new TransferPermissionData(scopeDetail.getId(), scopeDetail.getId()+") "+scopeDetail.getState().getName() + " " +name,1));
                            }).collect(Collectors.toList());
        }else {
            scopeDetailRepository.findAllByCatUserScopeIsNullAndIdNotIn(ids).stream().sorted(Comparator.comparing(scopeDetail -> scopeDetail.getState().getName()))
                    .map(scopeDetail -> {
                        String name =  scopeDetail.getSchool() != null ? scopeDetail.getSchool().getName() : "";
                        return resultList.add(new TransferPermissionData(scopeDetail.getId(), scopeDetail.getId()+") "+scopeDetail.getState().getName() + " " +name,1));
                    }).collect(Collectors.toList());
        }

        return resultList;
    }

    public void addPermissionTheScope( ListGroupData groupData, Integer adminId ) {
        validationDev(adminId);
        List< ScopeDetail > scopeDetails = scopeDetailRepository.findAllById(groupData.getIdPermission());
        CatUserScope catUserScope = catUserScopeRepository.findById(groupData.getIdGroup()).orElseThrow(() -> new AppException(Messages.registrationIsNotExist));
        scopeDetails.forEach(scopeDetail -> scopeDetail.setCatUserScope(catUserScope));
        scopeDetailRepository.saveAll(scopeDetails);
        auditingQueries.saveAudit("UserService", "addPermissionTheScope", adminId, User.class, adminId, "addPermissionTheScope");
    }

    public void removePermissionTheScope( ListGroupData groupData,Integer adminId) {
        validationDev(adminId);
        List< ScopeDetail > scopeDetails = scopeDetailRepository.findAllById(groupData.getIdPermission());
        scopeDetails.forEach(scopeDetail -> scopeDetail.setCatUserScope(null));
        scopeDetailRepository.saveAll(scopeDetails);
        auditingQueries.saveAudit("UserService", "removePermissionTheScope", adminId, User.class, adminId, "removePermissionTheScope");
    }
}
