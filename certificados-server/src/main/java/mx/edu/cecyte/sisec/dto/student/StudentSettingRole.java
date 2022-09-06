package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSettingRole {
    private Integer studentId;
    private String curp;
    protected Integer userRoleId;
    private Integer roleId;
    private String roleName;
    private boolean statusSignIn;
    private  boolean statusStudent;

    public StudentSettingRole(UserRole userRole, Student student) {
        this.studentId = student != null ? student.getUser().getId() : null;
        this.curp = student != null ? student.getUser().getUsername() : "";
        this.userRoleId = userRole != null ? userRole.getId() : null;
        this.roleId = userRole != null ? userRole.getRole().getId() : null;
        this.roleName = userRole.getRole().getName();
        this.statusSignIn =student != null ? student.getUser().getStatus() == 1 ? true : false : false;
        this.statusStudent = student != null ? student.getStatus() ? true : false : false;
    }
}
