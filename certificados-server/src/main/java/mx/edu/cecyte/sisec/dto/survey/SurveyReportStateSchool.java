package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportStateSchool {
    private Integer schoolId;
    private String cct;
    private String schoolName;
    private Integer totalSurveys;
    private Integer totalStudents;
    private Double percentage;
}
