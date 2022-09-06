package mx.edu.cecyte.sisec.dto.survey;

import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.survey2021.SurveyGraduated2021;

@Data
@NoArgsConstructor
public class SurveyGraduated2021Request {
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
    public SurveyGraduated2021Request(SurveyGraduated2021 graduated2021){
        this.q1=graduated2021.getQ1();
        this.q2=graduated2021.getQ2();
        this.q3=graduated2021.getQ3();
        this.q4=graduated2021.getQ4();
        this.q5=graduated2021.getQ5()!=null ? graduated2021.getQ5():"No Aplica";
        this.q6=graduated2021.getQ6()!=null ? graduated2021.getQ6():"No Aplica";
        this.q7=graduated2021.getQ7()!=null ? graduated2021.getQ7():"No Aplica";
        this.q8=graduated2021.getQ8()!=null ? graduated2021.getQ8():"No Aplica";
        this.q9=graduated2021.getQ9()!=null ? graduated2021.getQ9():"No Aplica";
        this.q10=graduated2021.getQ10()!=null ? graduated2021.getQ10():"No Aplica";
        this.q11=graduated2021.getQ11()!=null ? graduated2021.getQ11():"No Aplica";
        this.q12=graduated2021.getQ12()!=null ? graduated2021.getQ12():"No Aplica";
        this.q13=graduated2021.getQ13()!=null ? graduated2021.getQ13():"No Aplica";
        this.q14=graduated2021.getQ14()!=null ? graduated2021.getQ14():"No Aplica";
        this.q15=graduated2021.getQ15()!=null ? graduated2021.getQ15():"No Aplica";
        this.q16=graduated2021.getQ16()!=null ? graduated2021.getQ16():"No Aplica";
    }
}
