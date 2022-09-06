package mx.edu.cecyte.sisec.dto.certified;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertifiedReportStateSchool {
    private String generation;
    private Integer schoolId;
    private String cct;
    private String schoolName;
    private Integer totalFinised;
    private Integer totalPartial;
    private Integer totalAbrogado;
}
