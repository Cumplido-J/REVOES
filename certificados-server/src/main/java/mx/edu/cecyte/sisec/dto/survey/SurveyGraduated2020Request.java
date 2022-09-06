package mx.edu.cecyte.sisec.dto.survey;

import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.survey2020.SurveyGraduated2020;

@Data
@NoArgsConstructor
public class SurveyGraduated2020Request {
    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;
    private String q6;
    private String q7;
    private String q8;
    private String q9;
    private String q10;
    private String q11;
    private String q12;
    private String q13;
    private String q14;
    private String q15;
    private String q16;
    public SurveyGraduated2020Request(SurveyGraduated2020 graduated2020){
        this.q1=graduated2020.getQ1();
        this.q2=graduated2020.getQ2();
        this.q3=graduated2020.getQ3();
        this.q4=graduated2020.getQ4();
        this.q5=graduated2020.getQ5()!=null ? graduated2020.getQ5():"No Aplica";
        this.q6=graduated2020.getQ6()!=null ? graduated2020.getQ6():"No Aplica";
        this.q7=graduated2020.getQ7()!=null ? graduated2020.getQ7():"No Aplica";
        this.q8=graduated2020.getQ8()!=null ? graduated2020.getQ8():"No Aplica";
        this.q9=graduated2020.getQ9()!=null ? graduated2020.getQ9():"No Aplica";
        this.q10=graduated2020.getQ10()!=null ? graduated2020.getQ10():"No Aplica";
        this.q11=graduated2020.getQ11()!=null ? graduated2020.getQ11():"No Aplica";
        this.q12=graduated2020.getQ12()!=null ? graduated2020.getQ12():"No Aplica";
        this.q13=graduated2020.getQ13()!=null ? graduated2020.getQ13():"No Aplica";
        this.q14=graduated2020.getQ14()!=null ? graduated2020.getQ14():"No Aplica";
        this.q15=graduated2020.getQ15()!=null ? graduated2020.getQ15():"No Aplica";
        this.q16=graduated2020.getQ16()!=null ? graduated2020.getQ16():"No Aplica";

    }
}
