package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DgpSelectCareer {
    private Integer id;
    private String clave;
    private String carrer;
    private String name;
    private String modality;
    private String level;
}
