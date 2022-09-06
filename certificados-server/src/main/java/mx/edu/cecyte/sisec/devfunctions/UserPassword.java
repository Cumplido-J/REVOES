package mx.edu.cecyte.sisec.devfunctions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPassword {
    private String username;
    private String password;
    private String estado;
    private String plantel;
    private String tipo;
}
