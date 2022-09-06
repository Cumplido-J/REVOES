package mx.edu.cecyte.sisec.dto.profile;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
    private String username;
    private String password;

    private Boolean isLoginSISEC= false;
    private byte [] secretKey = null;
}
