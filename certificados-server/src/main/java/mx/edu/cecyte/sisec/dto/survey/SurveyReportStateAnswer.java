package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportStateAnswer {
    private Integer stateId;
    private String stateName;
    private List<SurveyReportStateSchoolAnswer> schools;
}
