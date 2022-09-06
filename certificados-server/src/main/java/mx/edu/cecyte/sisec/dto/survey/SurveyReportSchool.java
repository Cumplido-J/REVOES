package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportSchool {
    private Integer schoolId;
    private String cct;
    private String schoolName;
    private List<SurveyReportStudent> students;
}
