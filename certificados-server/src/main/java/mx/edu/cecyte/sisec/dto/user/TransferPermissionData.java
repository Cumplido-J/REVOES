package mx.edu.cecyte.sisec.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.Permissions;

@Data @NoArgsConstructor @AllArgsConstructor
public class TransferPermissionData {

    Integer key;

    String title;

    Integer position;

    public TransferPermissionData( Integer key, String title){
        this.key=key;
        this.title=title;
    }

}
