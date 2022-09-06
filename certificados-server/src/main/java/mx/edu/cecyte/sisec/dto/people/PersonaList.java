package mx.edu.cecyte.sisec.dto.people;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonaList {
    private Integer idpersona;
    private String rfc;
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    //private Integer state;
    private String state;
    //private Integer statusid;
}
