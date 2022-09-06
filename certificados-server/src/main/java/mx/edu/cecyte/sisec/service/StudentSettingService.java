package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.student.StudentSettingRole;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.StudentSettingQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentSettingService {
    @Autowired
    private StudentSettingQueries studentSettingQueries;
    @Autowired
    private UserQueries userQueries;
    @Autowired
    private StudentQueries studentQueries;

    public List<StudentSettingRole> selectUserRole(String username, String curp) {
        List<StudentSettingRole> role = new ArrayList<>();
        User user = userQueries.getUserByUsername(username);
        Student student = studentQueries.getStudentByUsername(curp);
        boolean isExistUserRole = studentSettingQueries.isExisttudentRole(student.getUser().getId());
        UserRole userRole = new UserRole();
        if (isExistUserRole) {
            userRole = studentSettingQueries.selectttudentRole(student.getUser().getId());
            role.add(new StudentSettingRole(userRole, student));
        } else {
            role.add(new StudentSettingRole(student.getUser().getId(), student.getUser().getUsername(), null, null, "", student.getUser().getStatus() == 1 ? true : false, student.getStatus()));
        }
        return role;
    }

    public StudentSettingRole assignRole(Integer studentId) {
        StudentSettingRole assign = new StudentSettingRole();
        Student student = studentQueries.getStudentById(studentId);
        Role role = studentSettingQueries.selectRoleName("ROLE_ALUMNO");
        studentSettingQueries.saveUserRole(student, role);
        return assign;
    }
}
