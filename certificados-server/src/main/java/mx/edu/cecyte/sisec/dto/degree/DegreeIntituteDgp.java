package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DegreeIntituteDgp {
    private Integer id;
    private String clave;
    private String name;
    private String complete;
    private Integer state;
    private Integer school;
}
