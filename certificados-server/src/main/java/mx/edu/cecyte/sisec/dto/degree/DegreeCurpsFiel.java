package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.dto.certificate.CertificateFiel;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DegreeCurpsFiel {
    private List<String> curps;
    private CertificateFiel fiel;

    public Fiel getFielBytes() {
        return new Fiel(fiel);
    }
}
