package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSubjectUpdate {
    private Integer partialId;
    private Integer studentId;
    private String cct;
    private Integer subjectTypeId;
    private String name;
    private String score;
    private String hours;
    private String credits;
    private String period;
}
