package mx.edu.cecyte.sisec.business.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.classes.Fiel;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DegreeSigner {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private Integer positionId;
    private String position;
    private Fiel fiel;
}
