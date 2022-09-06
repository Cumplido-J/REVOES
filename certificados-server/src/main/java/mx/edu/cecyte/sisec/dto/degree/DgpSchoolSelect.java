package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DgpSchoolSelect {
    private Integer id;
    private String clave;
    private String name;
    private boolean hasACareer;
    private Integer totalCareer;

    public DgpSchoolSelect() {

    }
}
