package mx.edu.cecyte.sisec.dto.certified;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportStudent;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertifiedReportSchool {
    private Integer schoolId;
    private String cct;
    private String schoolName;
    private List<CertifiedReportStudent> students;
}
