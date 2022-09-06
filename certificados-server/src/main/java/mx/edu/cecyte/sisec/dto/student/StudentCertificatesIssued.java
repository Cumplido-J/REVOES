package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.certificado.CertificateData;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
public class StudentCertificatesIssued {
    private List<CertificateData> endingCertificate;
    private List<CertificateData> partialCertificate;
    private List<CertificateData> abrogateCertificates;

    public StudentCertificatesIssued(List<CertificateData> endingCertificate, List<CertificateData> partialCertificate, List<CertificateData> abrogateCertificates) {
        this.endingCertificate = endingCertificate;
        this.partialCertificate = partialCertificate;
        this.abrogateCertificates = abrogateCertificates;
    }
}
