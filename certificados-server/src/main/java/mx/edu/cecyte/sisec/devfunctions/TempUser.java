package mx.edu.cecyte.sisec.devfunctions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TempUser {
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String username;
    private Integer stateId;
    private String password;
    private Integer positionId;
}
