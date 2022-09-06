package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminFilter {
    private Integer adminTypeId;
    private Integer stateId;
    private Integer schoolId;
    private Integer checkAdminNivel;
    private Integer adminSchoolId;
    private Integer superUserId;
}
