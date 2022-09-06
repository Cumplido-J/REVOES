package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.user.UserData;
import mx.edu.cecyte.sisec.dto.masiveload.AlumnoCarga;
import mx.edu.cecyte.sisec.model.catalogs.CatCity;
import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.model.met.MetCredentials;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.*;
//import mx.edu.cecyte.sisec.repo.admin.CertificationAdminRepository;
//import mx.edu.cecyte.sisec.repo.admin.DegreeAdminRepository;
//import mx.edu.cecyte.sisec.repo.admin.GraduateTracingAdminRepository;
//import mx.edu.cecyte.sisec.repo.admin.SchoolControlAdminRepository;
import mx.edu.cecyte.sisec.repo.StudentCareerModuleRepository;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.repo.users.*;
import mx.edu.cecyte.sisec.service.CatalogService;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserQueries {

    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private UserRepository userRepository;
    @Autowired private StateRepository stateRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private RoleBCSRepository roleBCSRepository;
    @Autowired private CatalogService catalogService;
    @Autowired private UserQueries userQueries;
    @Autowired private UserRoleBCSRepository userRoleBCSRepository;
    @Autowired private AuditingQueries auditingQueries;
    //@Autowired private CertificationAdminRepository certificationAdminRepository;
    //@Autowired private SchoolControlAdminRepository schoolControlAdminRepository;
    @Autowired private UserRoleRepository userRoleRepository;
    //@Autowired private GraduateTracingAdminRepository graduateTracingAdminRepository;
    //@Autowired private DegreeAdminRepository degreeAdminRepository;
    @Autowired private AdminUserScopeRepository adminUserScopeRepository;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private PermissionsRepository permissionsRepository;
    @Autowired private CatUserScopeRepository catUserScopeRepository;
    @Autowired private ScopeDetailRepository scopeDetailRepository;

    public User getUserById(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new AppException(Messages.user_wrongUsername));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new AppException(Messages.user_wrongUsername));
    }

    public Set<Integer> getRolesIdByUser(User user) {
        return user.getUserRoles().stream().map(UserRole::getRole).map(Role::getId).collect(Collectors.toSet());
    }

    public Set<Integer> getAvailableStateIdsByAdminUser(User user) {
        return user.getAdminUserScope().getCatUserScope().getScopeDetails().stream().map(scopeDetail ->scopeDetail.getState().getId()).collect(Collectors.toSet());
    }

    /*public Set<Integer> getAvailableStateIdsByAdminUser(User user) {
        Set<Integer> availableStateIds = new HashSet<>();

        Set<Integer> rolesId = getRolesIdByUser(user);

        if (rolesId.contains(AppCatalogs.ROLE_DEV)) {
            return stateRepository.findAll().stream().map(CatState::getId).collect(Collectors.toSet());
        }
        if (rolesId.contains(AppCatalogs.ROLE_TRACING_ADMIN)) {

            if (user.getGraduateTracingAdmin().getSchool() != null)
                availableStateIds.add(user.getGraduateTracingAdmin().getSchool().getCity().getState().getId());

            if (user.getGraduateTracingAdmin().getState() != null)
                availableStateIds.add(user.getGraduateTracingAdmin().getState().getId());

        }

        if (rolesId.contains(AppCatalogs.ROLE_CERTIFICATION_ADMIN))
            availableStateIds.add(user.getCertificationAdmin().getState().getId());

        if (rolesId.contains(AppCatalogs.ROLE_SCHOOL_CONTROL)) {

            if (user.getSchoolControlAdmin().getSchool() != null)
                availableStateIds.add(user.getSchoolControlAdmin().getSchool().getCity().getState().getId());

            if (user.getSchoolControlAdmin().getState() != null)
                availableStateIds.add(user.getSchoolControlAdmin().getState().getId());

        }
        if (rolesId.contains(AppCatalogs.ROLE_TITULACION_ADMIN)){
            availableStateIds.add(user.getDegreeAdmim().getState().getId());
        }
        if (rolesId.contains(AppCatalogs.ROLE_PLANNING_ADMIN)){
            if (user.getPlaneacionAdmin().getSchool() != null)
                availableStateIds.add(user.getPlaneacionAdmin().getSchool().getCity().getState().getId());

            if (user.getPlaneacionAdmin().getState() != null)
                availableStateIds.add(user.getPlaneacionAdmin().getState().getId());
        }

        return availableStateIds;
    }*/


    public Set<Integer> getAvailableSchoolIdsByAdminUserV2(Integer stateId,User user, boolean isStateOrSchool) {

       Integer resultStateId = isStateOrSchool ? stateId : catalogQueries.getStateBySchoolId(stateId);

        Set<Integer> resultList = new HashSet<>();

        user.getAdminUserScope().getCatUserScope().getScopeDetails()
        .stream().filter(scopeDetail -> scopeDetail.getState().getId() == resultStateId)
        .map(scopeDetail -> {
            return
                    scopeDetail.getSchool() != null ? resultList.add( scopeDetail.getSchool().getId() )
                            :
                    resultList.addAll(schoolRepository.findAllByStateId(
                            scopeDetail.getState().getId()).stream().map(School::getId).collect(Collectors.toSet())
                    );
            })
        .collect(Collectors.toList());

        if (resultList.isEmpty() && Objects.equals(resultStateId, 0) && Objects.equals(stateId, 0)){
            //System.out.println(resultStateId+"---------------------->>>>>>>>>>>>>>>>>>>>><<<"+resultList.isEmpty());
            user.getAdminUserScope().getCatUserScope().getScopeDetails()
                    .stream()
                    .map(scopeDetail -> {
                        return
                                scopeDetail.getSchool() != null ? resultList.add( scopeDetail.getSchool().getId() )
                                        :
                                        resultList.addAll(schoolRepository.findAllByStateId(
                                                scopeDetail.getState().getId()).stream().map(School::getId).collect(Collectors.toSet())
                                        );
                    })
                    .collect(Collectors.toList());
        }

        return resultList;
    }

    /*public Set<Integer> getAvailableSchoolIdsByAdminUser(User user) {
        Set<Integer> roleIds = getRolesIdByUser(user);

        if (roleIds.contains(AppCatalogs.ROLE_DEV))
            return schoolRepository.findAll().stream().map(School::getId).collect(Collectors.toSet());

        Set<Integer> resultList = new HashSet<>();

        if (roleIds.contains(AppCatalogs.ROLE_SCHOOL_CONTROL)) {
            SchoolControlAdmin schoolControlAdmin = user.getSchoolControlAdmin();

            if (schoolControlAdmin.getState() != null)
                for (CatCity city : schoolControlAdmin.getState().getCities())
                    resultList.addAll(city.getSchools().stream().map(School::getId).collect(Collectors.toSet()));

            if (schoolControlAdmin.getSchool() != null)
                resultList.add(schoolControlAdmin.getSchool().getId());
        }

        if (roleIds.contains(AppCatalogs.ROLE_TRACING_ADMIN)) {
            GraduateTracingAdmin graduateTracingAdmin = user.getGraduateTracingAdmin();

            if (graduateTracingAdmin.getState() != null)
                for (CatCity city : user.getGraduateTracingAdmin().getState().getCities())
                    resultList.addAll(city.getSchools().stream().map(School::getId).collect(Collectors.toSet()));

            if (graduateTracingAdmin.getSchool() != null)
                resultList.add(graduateTracingAdmin.getSchool().getId());
        }

        if (roleIds.contains(AppCatalogs.ROLE_CERTIFICATION_ADMIN)) {
            for (CatCity city : user.getCertificationAdmin().getState().getCities())
                resultList.addAll(city.getSchools().stream().map(School::getId).collect(Collectors.toSet()));
        }
        if (roleIds.contains(AppCatalogs.ROLE_PLANNING_ADMIN)) {
            PlaneacionAdmin planeacionAdmin= user.getPlaneacionAdmin();
            if (planeacionAdmin.getState() != null) {
                for (CatCity city : user.getPlaneacionAdmin().getState().getCities())
                    resultList.addAll(city.getSchools().stream().map(School::getId).collect(Collectors.toSet()));
            }
            if (planeacionAdmin.getSchool() != null) {
                resultList.add(planeacionAdmin.getSchool().getId());
            }
        }

        if (roleIds.contains(AppCatalogs.ROLE_TITULACION_ADMIN))
            for (CatCity city : user.getDegreeAdmim().getState().getCities())
                resultList.addAll(city.getSchools().stream().map(School::getId).collect(Collectors.toSet()));

        return resultList;
    }*/

    public boolean isStudentAvailableForAdmin(User user, Student student) {
        Integer schoolId = 0;
        if (student.getSchoolCareer() != null) schoolId = student.getSchoolCareer().getSchool().getId();
        else if (student.getSchool() != null) schoolId = student.getSchool().getId();

        return isSchoolAvailableForAdmin(user, schoolId);
    }

    public boolean isStateAvailableForAdmin(User user, Integer schoolId) {
        //return getAvailableSchoolIdsByAdminUser(user).contains(schoolId);
        return getAvailableStateIdsByAdminUser(user).contains(schoolId);
        //return getAvailableSchoolIdsByAdminUserV2(schoolId,user,AppCatalogs.isState).contains(schoolId);
    }

    public boolean isSchoolAvailableForAdmin(User admin, Integer schoolId) {
        //Set<Integer> availableSchoolIds = getAvailableSchoolIdsByAdminUser(admin);
        Set<Integer> availableSchoolIds = getAvailableSchoolIdsByAdminUserV2(schoolId,admin,AppCatalogs.isSchool);
        return availableSchoolIds.contains(schoolId);
    }

    public boolean usernameExists(String username) {
        return userRepository.countByUsername(username) > 0;
    }

    public void updateTemporalPasswords(List<User> studentsWithTemporalPassword) {
        studentsWithTemporalPassword.parallelStream().forEach(user -> user.setPassword(passwordEncoder.encode(user.getStudent().getEnrollmentKey())));
        userRepository.saveAll(studentsWithTemporalPassword);
    }

    public List<User> getStudentsWithTemporalPassword() {
        return userRepository.getStudentsWithTemporalPassword(AppCatalogs.TEMPORAL_PASSWORD);
    }

    public Integer getStudentsWithTemporalPasswordCount() {
        return userRepository.getStudentsWithTemporalPasswordCount(AppCatalogs.TEMPORAL_PASSWORD);
    }

    public boolean isDevAdmin(User adminUser) {
        return getRolesIdByUser(adminUser).contains(AppCatalogs.ROLE_DEV);
    }

    public MecCredentials getMecCredentialsFromAdmin(User userAdmin) {
        /*if (userAdmin.getCertificationAdmin() != null)
            return userAdmin.getCertificationAdmin().getState().getMecCredentials();
        if (userAdmin.getSchoolControlAdmin() != null)
            return userAdmin.getSchoolControlAdmin().getState().getMecCredentials();
        return new MecCredentials();*/

         return userAdmin.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getState().getMecCredentials())
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceMec));
    }

    public MecCredentials getMecCredentialsFromState(Integer stateId) {
        CatState state = stateRepository.findById(stateId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        return state.getMecCredentials();
    }

    public User editUser(User user) {
        return userRepository.save(user);
    }

    public boolean usernameExists2(String username, int id) {
        return userRepository.countByUsernameAndIdNot(username, id) > 0;
    }

    public User addNewUser(User user){
        return userRepository.save(user);
    }

    public User editUserPassword(User user, String newPassword) {
        newPassword = passwordEncoder.encode(newPassword);
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    public UserRole getByidRoleUser(User user,Integer role){
        Role roleUser = roleRepository.findById(role).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        return  new UserRole(user, roleUser);
    }

    public RolesBCS getByIdRoleUserBCS(Integer idRoleBCS){
        return roleBCSRepository.findById(idRoleBCS).get();
    }

    /*public User addNewUserRole_CERTIFICATION_ADMIN( UserData userData, User user){
        UserRole userRoleNew =userQueries.getByidRoleUser(user,AppCatalogs.ROLE_CERTIFICATION_ADMIN);
        user.setUserRoles(userRoleNew.getUser().getUserRoles());
        CatPosition catPosition= catalogService.getCargoById(userData.getCargoId());
        int rol= userData.getAdminSchoolId() == 2 ? AppCatalogs.BCS_ROLE_CERTIFICACION : AppCatalogs.BCS_ROLE_DIRECCION;
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rol);
        UserRoleBCS userRoleBCS = new UserRoleBCS(rolesBCS,"App\\Usuario",user);
        CertificationAdmin certificationAdmin = new CertificationAdmin(user, catPosition, catalogService.getStateById(userData.getStateId()));
        user.setCertificationAdmin(certificationAdmin);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        certificationAdminRepository.save(certificationAdmin);
        userQueries.addNewUser(user);
        userRoleBCSRepository.save(userRoleBCS);
        userRoleRepository.save(userRoleNew);
        return user;
    }*/

    /*public User addNewUserRole_SCHOOL_CONTROL(UserData userData, User user){
        UserRole userRoleNew =userQueries.getByidRoleUser(user,AppCatalogs.ROLE_SCHOOL_CONTROL);
        user.setUserRoles(userRoleNew.getUser().getUserRoles());
        SchoolControlAdmin schoolControlAdmin = new SchoolControlAdmin(user);
        Integer rolTipo=0;
        if (userData.getAdminSchoolId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_ESTATAL ||userData.getAdminSchoolId() == AppCatalogs.CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_ESTATAL){
            schoolControlAdmin.setState(catalogService.getStateById(userData.getStateId()));
            rolTipo = userData.getAdminSchoolId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_ESTATAL ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL;
        }else if (userData.getSuperUserId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL || userData.getSuperUserId() == AppCatalogs.CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_PLANTEL){
            schoolControlAdmin.setSchool(catalogService.getSchoolById(userData.getSchoolId()));
            rolTipo = userData.getSuperUserId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL;
        }
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rolTipo);
        UserRoleBCS userRoleBCS = new UserRoleBCS(rolesBCS,"App\\Usuario",user);
        user.setSchoolControlAdmin(schoolControlAdmin);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        schoolControlAdminRepository.save(schoolControlAdmin);
        userQueries.addNewUser(user);
        userRoleBCSRepository.save(userRoleBCS);
        userRoleRepository.save(userRoleNew);
        return user;
    }*/

    /*public User addNewUserROLE_TRACING_ADMIN(UserData userData, User user){
        UserRole userRoleNew =userQueries.getByidRoleUser(user,userData.getRoleId());
        user.setUserRoles(userRoleNew.getUser().getUserRoles());
        GraduateTracingAdmin graduateTracingAdmin = new GraduateTracingAdmin(user);
        Integer rolTipo=0;
        if (AppCatalogs.CHECK_NIVEL_ESTATAL == userData.getCheckAdminNivel()) {
            graduateTracingAdmin.setState(catalogService.getStateById(userData.getStateId()));
            rolTipo = AppCatalogs.BCS_ROLE_SEGUIMIENTO_ESTATAL;
        }
        else if(AppCatalogs.CHECK_NIVEL_PLANTEL == userData.getCheckAdminNivel()){
            graduateTracingAdmin.setSchool(catalogService.getSchoolById(userData.getSchoolId()));
            rolTipo = AppCatalogs.BCS_ROLE_SEGUIMIENTO_PLANTEL;
        }
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rolTipo);
        UserRoleBCS userRoleBCS = new UserRoleBCS(rolesBCS,"App\\Usuario",user);
        user.setGraduateTracingAdmin(graduateTracingAdmin);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        graduateTracingAdminRepository.save(graduateTracingAdmin);
        userQueries.addNewUser(user);
        userRoleBCSRepository.save(userRoleBCS);
        userRoleRepository.save(userRoleNew);
        return user;
    }*/

    /*public User addNewUserROLE_DEV(UserData userData, User user){
        UserRole userRoleNew =userQueries.getByidRoleUser(user,userData.getRoleId());
        user.setUserRoles(userRoleNew.getUser().getUserRoles());
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(AppCatalogs.BCS_ROLE_DEV);
        UserRoleBCS userRoleBCS = new UserRoleBCS(rolesBCS,"App\\Usuario",user);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        userQueries.addNewUser(user);
        userRoleBCSRepository.save(userRoleBCS);
        userRoleRepository.save(userRoleNew);
        return user;
    }*/

    /*public User editUserRole_CERTIFICATION_ADMIN(UserData userData, User user){
        int rol= userData.getAdminSchoolId() == 2 ? AppCatalogs.BCS_ROLE_CERTIFICACION : AppCatalogs.BCS_ROLE_DIRECCION;
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rol);
        UserRoleBCS userRoleBCS = user.getUserRolesBCS();
        userRoleBCS.setRolebcs(rolesBCS);
        CertificationAdmin certificationAdmin = user.getCertificationAdmin();
        certificationAdmin.updateUserCatState(catalogService.getCargoById(userData.getCargoId()),catalogService.getStateById(userData.getStateId()));
        user.setCertificationAdmin(certificationAdmin);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        certificationAdminRepository.save(certificationAdmin);
        userRoleBCSRepository.save(userRoleBCS);
        userQueries.editUser(user);
        return user;
    }*/

   /*public User editUserRole_SCHOOL_CONTROL(UserData userData, User user){
        Integer rolTipo=0;
        SchoolControlAdmin schoolControlAdmin = user.getSchoolControlAdmin();
        if (userData.getAdminSchoolId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_ESTATAL ||userData.getAdminSchoolId() == AppCatalogs.CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_ESTATAL){
            schoolControlAdmin.UpdateUserSchoolControlAdmin(null, catalogService.getStateById(userData.getStateId()));
            rolTipo = userData.getAdminSchoolId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_ESTATAL ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL;
            // rolTipo = userData.getAdminSchoolId() == 2 ? AppCatalogs.BCS_ROLE_DIRECCION  : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC;
        }else if (userData.getSuperUserId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL || userData.getSuperUserId() == AppCatalogs.CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_PLANTEL){
            schoolControlAdmin.UpdateUserSchoolControlAdmin(catalogService.getSchoolById(userData.getSchoolId()), null);
            rolTipo = userData.getSuperUserId() == AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL;
            //rolTipo = userData.getSuperUserId() == 2 ? AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL : AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC;
        }
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rolTipo);
        UserRoleBCS userRoleBCS = user.getUserRolesBCS();
        userRoleBCS.setRolebcs(rolesBCS);
        user.setSchoolControlAdmin(schoolControlAdmin);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        schoolControlAdminRepository.save(schoolControlAdmin);
        userRoleBCSRepository.save(userRoleBCS);
        userQueries.editUser(user);
        return user;
    }*/

    /*public User editUserROLE_TRACING_ADMIN(UserData userData, User user){
        GraduateTracingAdmin graduateTracingAdmin = user.getGraduateTracingAdmin();
        Integer rolTipo=0;
        //if (userData.getSchoolId() == 0){
        if (userData.getCheckAdminNivel() == AppCatalogs.CHECK_NIVEL_ESTATAL){
            graduateTracingAdmin.UpdateUserGraduateTracingAdmin(null, catalogService.getStateById(userData.getStateId()));
            rolTipo = AppCatalogs.BCS_ROLE_SEGUIMIENTO_ESTATAL;
            //}else {
        }else if (userData.getCheckAdminNivel() == AppCatalogs.CHECK_NIVEL_PLANTEL){
            graduateTracingAdmin.UpdateUserGraduateTracingAdmin(catalogService.getSchoolById(userData.getSchoolId()),null);
            rolTipo = AppCatalogs.BCS_ROLE_SEGUIMIENTO_PLANTEL;
        }
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rolTipo);
        UserRoleBCS userRoleBCS = user.getUserRolesBCS();
        userRoleBCS.setRolebcs(rolesBCS);
        user.setGraduateTracingAdmin(graduateTracingAdmin);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        graduateTracingAdminRepository.save(graduateTracingAdmin);
        userRoleBCSRepository.save(userRoleBCS);
        userQueries.editUser(user);
        return user;
    }*/

    public User editUserROLE_DEV(UserData userData, User user){
        return user;
    }
    //metodo para actualizar nombre en la carga masiva
    public void updateFullName(String name, String firstLastName, String secondLastName, Integer id) {
       userRepository.updateFullName(name, firstLastName, secondLastName, id);
    }
    public MetCredentials getMetCredentialsFromAdmin(User userAdmin) {
        /*if (userAdmin.getDegreeAdmim() != null)
            return userAdmin.getDegreeAdmim().getState().getMetCredentials();
        if (userAdmin.getCertificationAdmin() != null)
            return userAdmin.getCertificationAdmin().getState().getMetCredentials();
        if (userAdmin.getSchoolControlAdmin() != null)
            return userAdmin.getSchoolControlAdmin().getState().getMetCredentials();*/
        //return getMetCredentialsFromState(1).getState().getMetCredentials();
        return  userAdmin.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter(scopeDetail -> scopeDetail.getStatus() == true)
                .map( scopeDetail -> scopeDetail.getState().getMetCredentials())
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceMet))
                ;
        //return new MetCredentials();
    }

    public MetCredentials getMetCredentialsFromState(Integer stateId) {
        CatState state = stateRepository.findById(stateId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        return state.getMetCredentials();
    }

    /*public User addNewUserRole_TITULACION_ADMIN(UserData userData, User user) {
        UserRole userRoleNew =userQueries.getByidRoleUser(user,AppCatalogs.ROLE_TITULACION_ADMIN);
        user.setUserRoles(userRoleNew.getUser().getUserRoles());
        CatPosition catPosition= catalogService.getCargoById(userData.getCargoId());
        int rol= userData.getAdminSchoolId() == 5 ? AppCatalogs.BCS_ROLE_TITULACION : AppCatalogs.BCS_ROLE_DIRECCION;
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rol);
        UserRoleBCS userRoleBCS = new UserRoleBCS(rolesBCS,"App\\Usuario",user);
        DegreeAdmim degreeAdmim = new DegreeAdmim(user, catPosition, catalogService.getStateById(userData.getStateId()));
        user.setDegreeAdmim(degreeAdmim);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        degreeAdminRepository.save(degreeAdmim);
        userQueries.addNewUser(user);
        userRoleBCSRepository.save(userRoleBCS);
        userRoleRepository.save(userRoleNew);
        return user;
    }*/


    /*public User editUserRole_DEGREE_ADMIN(UserData userData, User user) {
        int rol= userData.getAdminSchoolId() == 5 ? AppCatalogs.BCS_ROLE_TITULACION : AppCatalogs.BCS_ROLE_DIRECCION;
        RolesBCS rolesBCS = userQueries.getByIdRoleUserBCS(rol);
        UserRoleBCS userRoleBCS = user.getUserRolesBCS();
        userRoleBCS.setRolebcs(rolesBCS);
        DegreeAdmim degreeAdmim = user.getDegreeAdmim();
        degreeAdmim.updateUserCatState(catalogService.getCargoById(userData.getCargoId()),catalogService.getStateById(userData.getStateId()));
        user.setDegreeAdmim(degreeAdmim);
        user.setUserRolesBCS(userRoleBCS.getUser().getUserRolesBCS());
        degreeAdminRepository.save(degreeAdmim);
        userRoleBCSRepository.save(userRoleBCS);
        userQueries.editUser(user);
        return user;
    }*/

    /*public Integer userSearchAdmin(Integer userId) {
        Integer values = 0;
        if (certificationAdminRepository.existsById(userId)) values = 1;
        if (degreeAdminRepository.existsById(userId)) values = 2;
        return values;
    }*/
    public boolean findByRoleBCSByName(String name){
        return roleBCSRepository.countByName(name) > 0;
    }

    public boolean findByRoleBCSByNameAndIdNot(String name, Integer id){
        return roleBCSRepository.countByNameAndIdNot(name, id) > 0;
    }

    public boolean findByRoleBCSById(Integer id){
        return roleBCSRepository.countById( id) > 0;
    }


    public boolean isExistsAssociationWithPermissionAndUserTheGroup(Integer id){
        RolesBCS rolesBCS= roleBCSRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        return ( rolesBCS.getPermissions().isEmpty() == true  && rolesBCS.getUserRolesBCS().isEmpty() == true ) ? true: false;
    }

    //
    public boolean findByPermissionByName(String name){
        return permissionsRepository.countByName(name) > 0;
    }

    public boolean findByPermissionByNameAndIdNot(String name, Integer id){
        return permissionsRepository.countByNameAndIdNot(name, id) > 0;
    }

    public boolean findByPermissionById(Integer id){
        return permissionsRepository.countById( id) > 0;
    }

    public boolean isExistsAssociationWithPermissionAndUserThePermission(Integer id){
        Permissions permissions= permissionsRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        return ( permissions.getRolesBCS().isEmpty() == true ) ? true: false;
    }

    public Role getByIdRole(Integer role){
        return  roleRepository.findById(role).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public boolean findByCatScopeByName(String name){
        return catUserScopeRepository.countByName(name) > 0;
    }

    public boolean findByCatScopeByNameAndIdNot(String name, Integer id){
        return catUserScopeRepository.countByNameAndIdNot(name, id) > 0;
    }

    public boolean isExistsAssociationWithPermissionAndUserTheCatScope(Integer id){
        CatUserScope catUserScope = catUserScopeRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        return ( catUserScope.getAdminUserScopes().isEmpty() == true  && catUserScope.getScopeDetails().isEmpty() == true ) ? true: false;
    }

    public boolean isExistsAssociationWithPermissionAndUserTheScope(Integer id){
        ScopeDetail scopeDetail = scopeDetailRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        return (scopeDetail.getCatUserScope() != null);
    }

    public boolean findByScopeByStateAndSchool( CatState state, School school ){
        return scopeDetailRepository.countByStateAndSchool( state, school ) > 0;
    }

    public boolean findByScopeByStateAndSchoolIsNot( CatState state, School school, Integer id ){
        return scopeDetailRepository.countByStateAndSchoolAndIdNot( state, school, id ) > 0;
    }
    /*public boolean findByDetailByName(String name){
        return scopeDetailRepository.countByName(name) > 0;
    }

    public boolean findByDetailByNameAndIdNot(String name, Integer id){
        return scopeDetailRepository.countByNameAndIdNot(name, id) > 0;
    }*/

    public boolean ifUserIsActive(String username) {
        return userRepository.coutByUsernameIsActive(username, 1) > 0;
    }
    public User editStatusUser(User user,Boolean status){
        user.editStatusUser(status);
        return userRepository.save(user);
    }
}
