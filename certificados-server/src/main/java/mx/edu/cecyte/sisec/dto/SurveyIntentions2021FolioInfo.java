package mx.edu.cecyte.sisec.dto;

import lombok.Data;
import mx.edu.cecyte.sisec.model.SurveyIntentions2021;

import java.util.Date;

@Data
public class SurveyIntentions2021FolioInfo {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private Date date;

    public SurveyIntentions2021FolioInfo(SurveyIntentions2021 survey) {
        this.curp = survey.getStudent().getUser().getUsername();
        this.name = survey.getStudent().getUser().getName();
        this.firstLastName = survey.getStudent().getUser().getFirstLastName();
        this.secondLastName = survey.getStudent().getUser().getSecondLastName();
        this.date = survey.getDate();
    }
}
