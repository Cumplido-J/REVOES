package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.dto.certificate.CertificateFiel;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EndPointPrimary {

    private EndPointCertificateType endPointCertificateType;

    private List<EndPointStudents> endPointStudents;

}
