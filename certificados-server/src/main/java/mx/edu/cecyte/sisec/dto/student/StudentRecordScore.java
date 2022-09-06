package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class StudentRecordScore {
    private Integer id;
    private String cct;
    private Integer subjectTypeId;
    private String subjectTypeName;
    private String name;
    private String score;
    private String hours;
    private String credits;
    private String scholarPeriod;
    private Integer periodNumber;

    public StudentRecordScore(){

    }
}
