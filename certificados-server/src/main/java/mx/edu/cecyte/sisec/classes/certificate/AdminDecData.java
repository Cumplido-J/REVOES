package mx.edu.cecyte.sisec.classes.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDecData {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private Integer positionId;

    public AdminDecData(User userAdmin) {
        this.curp = userAdmin.getUsername();
        this.name = userAdmin.getName();
        this.firstLastName = userAdmin.getFirstLastName();
        this.secondLastName = userAdmin.getSecondLastName();
        //this.positionId = userAdmin.getCertificationAdmin().getPosition().getId();
        this.positionId = userAdmin.getAdminUserScope().getPosition().getId();
    }
}
