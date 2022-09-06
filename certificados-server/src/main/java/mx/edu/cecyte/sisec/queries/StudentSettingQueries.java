package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.repo.users.RoleRepository;
import mx.edu.cecyte.sisec.repo.users.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentSettingQueries {
    @Autowired private UserRoleRepository userRoleRepository;
    @Autowired private RoleRepository roleRepository;

    public Boolean isExisttudentRole(Integer studentId) {
        return userRoleRepository.countUserRol(studentId) > 0;
    }

    public UserRole selectttudentRole(Integer studentId) {
        return userRoleRepository.findAll().stream().filter(rol -> rol.getUser().getId().equals(studentId)).findFirst().get();
    }

    public Role selectRoleName(String roleName) {
        return roleRepository.selectRoleName(roleName);
    }

    public void saveUserRole(Student student, Role role) {
        UserRole userRole = new UserRole(student.getUser(), role);
        userRoleRepository.save(userRole);
    }
}
