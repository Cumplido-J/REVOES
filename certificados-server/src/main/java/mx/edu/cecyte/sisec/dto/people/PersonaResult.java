package mx.edu.cecyte.sisec.dto.people;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PersonaResult {
    private  int idpersona;
    private String ape1;
    private String ape2;
    private int stateId;
}
