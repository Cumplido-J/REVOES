package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptographyLogin {
    private String username;
    private String password;

    private byte [] key;

    public  CryptographyLogin(String username, String password){
        this.username = username;
        this.password = password;
    }
}
