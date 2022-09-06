package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportStudent {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private Boolean answered;
}
