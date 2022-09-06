package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SchoolFilter {
    private Integer stateId;
    private Integer careerId;
    private Integer schoolTypeId;
    private String cct;
}
