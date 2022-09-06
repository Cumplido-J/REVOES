package mx.edu.cecyte.sisec.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateFiel {
    private String cer;
    private String key;
    private String password;
    private byte [] secretKey = null;
}
