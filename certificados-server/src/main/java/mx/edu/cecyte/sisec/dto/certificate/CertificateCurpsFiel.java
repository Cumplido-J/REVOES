package mx.edu.cecyte.sisec.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.classes.Fiel;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateCurpsFiel {
    private Integer certificateTypeId;
    private List<String> curps;
    private CertificateFiel fiel;
    private Boolean isTest = false;
    private Boolean isWebService = false;

    public Fiel getFielBytes() {
        return new Fiel(fiel);
    }
}
