package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class StudentDataFormat {
    private Integer stateId;
    private Integer schoolId;
    private String generation;
}
