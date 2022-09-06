package mx.edu.cecyte.sisec.classes.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CertificateSearchFilter {
    private Integer stateId;
    private Integer schoolId;
    private Integer careerId;
    private String generation;
    private String searchText;
    private Integer certificateTypeId;
}
