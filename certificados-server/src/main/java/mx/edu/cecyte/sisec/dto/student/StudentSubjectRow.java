package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentSubjectRow {
    private Integer subjectTypeId;
    private String name;
    private String score;
    private String hours;
    private String credits;
    private String period;
    private Integer semester;
}
