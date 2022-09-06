package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.certificate.CertificateFiel;
import org.apache.commons.ssl.Base64;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Fiel {
    private byte[] cer;
    private byte[] key;
    private String cer64;
    private String password;

    public Fiel(CertificateFiel fiel) {
        this.cer = Base64.decodeBase64(fiel.getCer());
        this.key = Base64.decodeBase64(fiel.getKey());
        this.cer64 = fiel.getCer();
        this.password = fiel.getPassword();
    }
}
