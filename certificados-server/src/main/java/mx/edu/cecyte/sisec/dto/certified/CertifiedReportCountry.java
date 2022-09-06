package mx.edu.cecyte.sisec.dto.certified;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertifiedReportCountry {
    private String generation;
    private Integer stateId;
    private String stateName;
    private Integer totalFinised;
    private Integer totalPartial;
    private Integer totalAbrogado;
}
