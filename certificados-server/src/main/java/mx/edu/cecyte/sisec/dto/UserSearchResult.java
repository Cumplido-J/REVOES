package mx.edu.cecyte.sisec.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.GraduateTracingAdmin;
import mx.edu.cecyte.sisec.model.users.SchoolControlAdmin;
import mx.edu.cecyte.sisec.model.users.User;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserSearchResult {
    private String username;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String state;
    private String schoolName;

    public UserSearchResult(String username, String name, String firstLastName, String secondLastName, String state) {
        this.username = username;
        this.name = name;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.state = state;
    }

    public UserSearchResult(User user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.firstLastName = user.getFirstLastName();
        this.secondLastName = user.getSecondLastName();
    }

    /*public UserSearchResult(SchoolControlAdmin schoolControlAdmin) {
        this.username = schoolControlAdmin.getUser().getUsername();
        this.name = schoolControlAdmin.getUser().getName();
        this.firstLastName = schoolControlAdmin.getUser().getFirstLastName();
        this.secondLastName = schoolControlAdmin.getUser().getSecondLastName();

        if (schoolControlAdmin.getState() != null) {
            this.state = schoolControlAdmin.getState().getName();
        }
        if (schoolControlAdmin.getSchool() != null) {
            this.state = schoolControlAdmin.getSchool().getCity().getState().getName();
            this.schoolName = schoolControlAdmin.getSchool().getName();
        }

    }*/

    /*public UserSearchResult( GraduateTracingAdmin graduateTracingAdmin) {
        this.username = graduateTracingAdmin.getUser().getUsername();
        this.name = graduateTracingAdmin.getUser().getName();
        this.firstLastName = graduateTracingAdmin.getUser().getFirstLastName();
        this.secondLastName = graduateTracingAdmin.getUser().getSecondLastName();

        if (graduateTracingAdmin.getState() != null) {
            this.state = graduateTracingAdmin.getState().getName();
        }
        if (graduateTracingAdmin.getSchool() != null) {
            this.state = graduateTracingAdmin.getSchool().getCity().getState().getName();
            this.schoolName = graduateTracingAdmin.getSchool().getName();
        }
    }*/
}
