package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentFilter {
    private Integer stateId;
    private Integer schoolId;
    private Integer careerId;
    private Integer studentStatus;
    private String searchText;
    private String generation;
}
