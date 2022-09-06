package mx.edu.cecyte.sisec.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.ScopeDetail;

@Data @NoArgsConstructor @AllArgsConstructor
public class scopeData {

    private Integer id;

    private Integer stateId;

    private Integer schoolId;

    private Integer statusId;

    public scopeData( ScopeDetail scopeDetail ){
        this.id =scopeDetail.getId();
        this.stateId = scopeDetail.getState().getId();
        if (scopeDetail.getSchool() != null ) {
            this.schoolId = scopeDetail.getSchool().getId();
        }
        this.statusId = scopeDetail.getStatus() ? 1 : 2;
    }
}
