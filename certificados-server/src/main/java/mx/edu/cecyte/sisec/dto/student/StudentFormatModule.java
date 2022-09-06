package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentFormatModule {
    private Integer id;
    private String module;
    private Integer careerModuleId;
    private Integer order;
}
