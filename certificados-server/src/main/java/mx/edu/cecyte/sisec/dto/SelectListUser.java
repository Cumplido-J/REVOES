package mx.edu.cecyte.sisec.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;

import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SelectListUser {
    private String username;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String state;
    private String schoolName;
    private String status;

    public SelectListUser(User user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.firstLastName = user.getFirstLastName();
        this.secondLastName = user.getSecondLastName();
        this.status = user.getStatus() ==1 ? "Activo": "Inactivo";
    }

    public SelectListUser(User user,String state, String schoolName) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.firstLastName = user.getFirstLastName();
        this.secondLastName = user.getSecondLastName();
        this.state = state;
        this.schoolName = schoolName;
        this.status = user.getStatus() ==1 ? "Activo": "Inactivo";
    }
}


