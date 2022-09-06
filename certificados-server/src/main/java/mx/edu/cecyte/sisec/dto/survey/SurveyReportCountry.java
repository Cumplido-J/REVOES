package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportCountry {
    private Integer stateId;
    private String stateName;
    private Integer totalSurveys;
    private Integer totalStudents;
    private Double percentage;
}
