package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.student.StudentData;
import mx.edu.cecyte.sisec.dto.user.UserData;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "usuario")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "username") private String username;
    @Column(name = "password") private String password;
    @Column(name = "nombre") private String name;
    @Column(name = "primerApellido") private String firstLastName;
    @Column(name = "segundoApellido") private String secondLastName;
    @Column(name = "email") private String email;
    @Column(name = "estatus") private int status;

    @OneToMany(mappedBy = "user") Set<UserRole> userRoles;
    @OneToMany(mappedBy = "user") Set<StudentRecordPartial> studentRecordPartials;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private Student student;
    //@OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private GraduateTracingAdmin graduateTracingAdmin;
    //@OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private CertificationAdmin certificationAdmin;
    //@OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private SchoolControlAdmin schoolControlAdmin;
    //@OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private DegreeAdmim degreeAdmim;
    @OneToOne(mappedBy = "user") private UserRoleBCS userRolesBCS;

    //@OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private PlaneacionAdmin planeacionAdmin;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "user") private AdminUserScope adminUserScope;

    public User(StudentData studentData, String password) {
        username = studentData.getCurp();
        this.password = password;
        name = studentData.getName();
        firstLastName = studentData.getFirstLastName();
        if (!StringUtils.isEmpty(studentData.getSecondLastName())) secondLastName = studentData.getSecondLastName();
        if (!StringUtils.isEmpty(studentData.getEmail())) email = studentData.getEmail();
        this.status = 1;
    }

    public void editUser(StudentData studentData, String newPassword) {
        this.username = studentData.getCurp();
        this.password = newPassword;
        this.name = studentData.getName();
        this.firstLastName = studentData.getFirstLastName();
        if (!StringUtils.isEmpty(studentData.getSecondLastName()))
            this.secondLastName = studentData.getSecondLastName();
        else this.secondLastName = null;
        if (!StringUtils.isEmpty(studentData.getEmail())) this.email = studentData.getEmail();
        else this.email = null;
    }

    public User( UserData userData){
        this.username = userData.getUsername();
        this.name = userData.getName();
        this.firstLastName = userData.getFirstLastName();
        this.secondLastName = userData.getSecondLastName();
        this.email = userData.getEmail();
        this.status = userData.getStatusId() == 1 ? 1 :0;
    }

    public void editUser2(UserData userData){
        this.username = userData.getUsername();
        this.name = userData.getName();
        this.firstLastName = userData.getFirstLastName();
        this.secondLastName = userData.getSecondLastName();
        this.email = userData.getEmail();
        this.status = userData.getStatusId() == 1 ? 1 :0;
    }
    public void editStatusUser(Boolean status){
        this.status=status==true ? 1:0;
    }
}
