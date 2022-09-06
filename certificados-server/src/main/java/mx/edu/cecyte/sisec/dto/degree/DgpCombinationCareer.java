package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DgpCombinationCareer {
    private Integer schoolId;
    private Integer careerId;
}
