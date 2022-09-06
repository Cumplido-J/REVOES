package mx.edu.cecyte.sisec.dto.survey;

import lombok.Data;
import mx.edu.cecyte.sisec.model.survey2022.SurveyGraduated2022;

import java.util.Date;
@Data
public class SurveyGraduated2022FolioInfo {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private Date date;
    public SurveyGraduated2022FolioInfo(SurveyGraduated2022 survey){
        this.curp = survey.getStudent().getUser().getUsername();
        this.name = survey.getStudent().getUser().getName();
        this.firstLastName = survey.getStudent().getUser().getFirstLastName();
        this.secondLastName = survey.getStudent().getUser().getSecondLastName();
        this.date = survey.getDate();
    }
}
