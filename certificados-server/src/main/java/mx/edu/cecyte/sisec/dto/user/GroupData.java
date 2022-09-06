package mx.edu.cecyte.sisec.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.Permissions;
import mx.edu.cecyte.sisec.model.users.RolesBCS;

import java.util.Date;

@Data
@NoArgsConstructor @AllArgsConstructor
public class GroupData {
    private Integer id;
    private String name;
    private Date created;
    private  String description;


    public GroupData( RolesBCS rolesBCS ){
        this.id= rolesBCS.getId();
        this.name=rolesBCS.getName();
        this.created=rolesBCS.getCreated();

    }

    public GroupData( Permissions permissions ){
        this.id= permissions.getId();
        this.name=permissions.getName();
        this.created=permissions.getCreated();
        this.description =permissions.getDetail();

    }
}
