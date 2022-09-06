package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancelStampExternal {
    private Integer stateId;
    private String curp;
    private String folio;
    private String motivo;
    private Integer stampedType;
    private boolean stateServer;
    private String stateName;
}
