package mx.edu.cecyte.sisec.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.mec.Certificate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateStatusValidation {

    private Integer certificateTypeId;
    private String status;

    public  CertificateStatusValidation( Certificate certificate){
        this.certificateTypeId = certificate.getCertificateTypeId();
        this.status = certificate.getStatus();
    }

}