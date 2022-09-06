package mx.edu.cecyte.sisec.dto.certified;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertifiedReportState {
    private Integer stateId;
    private String stateName;
    private List<CertifiedReportStateSchool> schools;
}
