package mx.edu.cecyte.sisec.devfunctions;

import mx.edu.cecyte.sisec.model.catalogs.CatCity;
import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.users.*;
import mx.edu.cecyte.sisec.repo.PositionRepository;
//import mx.edu.cecyte.sisec.repo.admin.CertificationAdminRepository;
//import mx.edu.cecyte.sisec.repo.admin.GraduateTracingAdminRepository;
//import mx.edu.cecyte.sisec.repo.admin.SchoolControlAdminRepository;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.users.RoleRepository;
import mx.edu.cecyte.sisec.repo.users.UserRepository;
import mx.edu.cecyte.sisec.repo.users.UserRoleRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DevUserCreationService {
    @Autowired private UserRepository userRepository;
    //@Autowired private CertificationAdminRepository certificationAdminRepository;
    @Autowired private StateRepository stateRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRoleRepository userRoleRepository;
    //@Autowired private SchoolControlAdminRepository schoolControlAdminRepository;
    //@Autowired private GraduateTracingAdminRepository graduateTracingAdminRepository;
    @Autowired private PositionRepository positionRepository;

    /*public List<UserPassword> generateAllTracingAdmins() {
        List<UserPassword> userPasswords = new ArrayList<>();
        List<CatState> states = stateRepository.findAll();
        for (CatState state : states) {
            if (state.getId().equals(1)) {
                UserPassword userPassword = generateStateTracingAguascalientes(state);
                userPasswords.add(userPassword);
            }
            for (CatCity city : state.getCities()) {
                for (School school : city.getSchools()) {
                    if (school.getGraduateTracingAdmins().size() == 0) {
                        UserPassword userPassword = generateStateTracingSchool(school);
                        userPasswords.add(userPassword);
                    }
                }
            }
        }
        return userPasswords;
    }*/

    /*private UserPassword generateStateTracingAguascalientes(CatState state) {
        Role role = roleRepository.findById(AppCatalogs.ROLE_TRACING_ADMIN).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        String username = "GUSK940430MASTNR03";

        String name = "Karla Stephanie";
        String firstLastName = "Gutiérrez";
        String secondLastName = "Santibañez";
        String password = generatePassword();

        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setFirstLastName(firstLastName);
        user.setPassword(passwordEncoder.encode(password));
        user = userRepository.save(user);

        UserRole userRole = new UserRole(user, role);
        userRole = userRoleRepository.save(userRole);

        GraduateTracingAdmin graduateTracingAdmin = new GraduateTracingAdmin();
        graduateTracingAdmin.setUser(user);
        graduateTracingAdmin.setState(state);
        graduateTracingAdmin = graduateTracingAdminRepository.save(graduateTracingAdmin);

        UserPassword userPassword = new UserPassword(username, password,state.getName(), null, "Seguimiento egresados estado");
        System.out.println(userPassword);
        return userPassword;
    }*/

    /*private UserPassword generateStateTracingSchool(School school) {
        Role role = roleRepository.findById(AppCatalogs.ROLE_TRACING_ADMIN).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        String username = "EGRESADOS_" + school.getCct();

        String name = "Seguimiento Egresados";
        String firstLastName = school.getCct();
        String password = generatePassword();

        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setFirstLastName(firstLastName);
        user.setPassword(passwordEncoder.encode(password));
        user = userRepository.save(user);

        UserRole userRole = new UserRole(user, role);
        userRole = userRoleRepository.save(userRole);

        GraduateTracingAdmin graduateTracingAdmin = new GraduateTracingAdmin();
        graduateTracingAdmin.setUser(user);
        graduateTracingAdmin.setSchool(school);
        graduateTracingAdmin = graduateTracingAdminRepository.save(graduateTracingAdmin);

        UserPassword userPassword = new UserPassword(username, password, school.getCity().getState().getName(), school.getName(), "Seguimiento egresados plantel");
        System.out.println(userPassword);
        return userPassword;
    }*/


    /*public List<UserPassword> generateAllSchoolControlAdmins() {
        List<UserPassword> userPasswords = new ArrayList<>();
        List<CatState> states = stateRepository.findAll();
        for (CatState state : states) {
            if (state.getSchoolControlAdmins().size() == 0) {
                UserPassword userPassword = generateStateSchoolControl(state);
                userPasswords.add(userPassword);
            }
            for (CatCity city : state.getCities()) {
                for (School school : city.getSchools()) {
                    if (school.getSchoolControlAdmins().size() == 0) {
                        UserPassword userPassword = generateStateSchoolControl(school);
                        userPasswords.add(userPassword);
                    }
                }
            }
        }
//        userPasswords = generateDirectors();
        return userPasswords;
    }*/

    /*private UserPassword generateStateSchoolControl(School school) {
        Role role = roleRepository.findById(AppCatalogs.ROLE_SCHOOL_CONTROL).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        String username = "CONTROL_" + school.getCct();

        String name = "Administracion";
        String firstLastName = school.getCct();
        String password = generatePassword();

        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setFirstLastName(firstLastName);
        user.setPassword(passwordEncoder.encode(password));
        user = userRepository.save(user);

        UserRole userRole = new UserRole(user, role);
        userRole = userRoleRepository.save(userRole);

        SchoolControlAdmin schoolControlAdmin = new SchoolControlAdmin();
        schoolControlAdmin.setUser(user);
        schoolControlAdmin.setSchool(school);
        schoolControlAdmin = schoolControlAdminRepository.save(schoolControlAdmin);

        UserPassword userPassword = new UserPassword(username, password, school.getCity().getState().getName(), school.getName(), "Control escolar plantel");
        System.out.println(userPassword);
        return userPassword;
    }*/

    /*private UserPassword generateStateSchoolControl(CatState state) {
        Role role = roleRepository.findById(AppCatalogs.ROLE_SCHOOL_CONTROL).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

        String username = "CONTROL_";
        if (state.getId() < 10) username += "0";
        username += state.getId() + "_CER";

        String name = "Administracion";
        String firstLastName = state.getName();
        String password = generatePassword();

        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setFirstLastName(firstLastName);
        user.setPassword(passwordEncoder.encode(password));
        user = userRepository.save(user);

        UserRole userRole = new UserRole(user, role);
        userRole = userRoleRepository.save(userRole);

        SchoolControlAdmin schoolControlAdmin = new SchoolControlAdmin();
        schoolControlAdmin.setUser(user);
        schoolControlAdmin.setState(state);
        schoolControlAdmin = schoolControlAdminRepository.save(schoolControlAdmin);

        UserPassword userPassword = new UserPassword(username, password, state.getName(), "", "Control escolar colegio");
        System.out.println(userPassword);
        return userPassword;
    }*/

    /*private List<UserPassword> generateDirectors() {
        List<UserPassword> userPasswords = new ArrayList<>();
        List<TempUser> tempUsers = new ArrayList<>();
//        tempUsers.add(new TempUser("Liliana", "Lopez", "Reyes", "LORL830418MHGPYL03", 13, generatePassword(), 2));
//        tempUsers.add(new TempUser("José", "Hérnandez", "Arreola", "HEAJ740918HMNRRS03", 16, generatePassword(), 1));
//        tempUsers.add(new TempUser("Sandro", "Hernández", "Piñón", "HEPS771214HCSRXN07", 7, generatePassword(), 1));
//        tempUsers.add(new TempUser("Gustavo Rodolfo", "Cruz", "Chávez", "CUCG691103HDFRHS02", 3, generatePassword(), 1));
//        tempUsers.add(new TempUser("Jaime", "Carmona", "Huerta", "CAHJ650425HGRRRM05", 12, generatePassword(), 1));
//        tempUsers.add(new TempUser("Isidoro", "Del Camino", "Ramos", "CARI431018HPLMMS08", 24, generatePassword(), 1));
        tempUsers.add(new TempUser("Leonel Gerardo", "Cordero", "Lerma", "COLL600512HZSRRN08", 32, generatePassword(), 1));
//        tempUsers.add(new TempUser("Misael Jafet", "Loera", "Gaytán", "LOGM740510HASRYS09", 1, generatePassword(), 1));
//        tempUsers.add(new TempUser("Luis Fernando", "Pantoja", "Amaro", "PAAL630724HDFNMS04", 22, generatePassword(), 1));
//        tempUsers.add(new TempUser("Javier", "Baizabal", "Cordero", "BACJ680104HVZZRV06", 30, generatePassword(), 1));
//        tempUsers.add(new TempUser("Demetrio Antonio", "Zúñiga", "Sánchez", "ZUSD600211HCLXNM07", 5, generatePassword(), 1));
//        tempUsers.add(new TempUser("José Adán Ignacio", "Rubí", "Salazar", "RUSA601219HMCBLD06", 15, generatePassword(), 1));

        for (TempUser tempUser : tempUsers) {
            CatState state = stateRepository.findById(tempUser.getStateId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
            CatPosition position = positionRepository.findById(tempUser.getPositionId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
            Role role = roleRepository.findById(AppCatalogs.ROLE_CERTIFICATION_ADMIN).orElseThrow(() -> new AppException(Messages.database_cantFindResource));

            User user = new User();
            user.setUsername(tempUser.getUsername());
            user.setName(tempUser.getName());
            user.setFirstLastName(tempUser.getFirstLastName());
            user.setPassword(passwordEncoder.encode(tempUser.getPassword()));
            user = userRepository.save(user);

            UserRole userRole = new UserRole(user, role);
            userRole = userRoleRepository.save(userRole);

            CertificationAdmin certificationAdmin = new CertificationAdmin();
            certificationAdmin.setUser(user);
            certificationAdmin.setState(state);
            certificationAdmin.setPosition(position);
            certificationAdmin = certificationAdminRepository.save(certificationAdmin);

            UserPassword userPassword = new UserPassword(tempUser.getUsername(), tempUser.getPassword(), state.getName(), "", "Director general");
            System.out.println(userPassword);
            userPasswords.add(userPassword);
        }

        return userPasswords;
    }*/

    private String generatePassword() {
        return UUID.randomUUID().toString().substring(24, 36);
    }

}
