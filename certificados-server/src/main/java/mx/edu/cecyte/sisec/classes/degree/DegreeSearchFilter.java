package mx.edu.cecyte.sisec.classes.degree;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DegreeSearchFilter {
    private Integer stateId;
    private Integer schoolId;
    private Integer careerId;
    private String generation;
    private String searchText;
}
