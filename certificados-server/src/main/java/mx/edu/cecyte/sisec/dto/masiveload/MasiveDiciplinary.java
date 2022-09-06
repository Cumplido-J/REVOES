package mx.edu.cecyte.sisec.dto.masiveload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class MasiveDiciplinary {
    private Integer stateId;
    private Integer schoolId;
    private Integer careerId;
    private String generation;
    private String curp;
    private Integer disciplinaryId;
}
