package mx.edu.cecyte.sisec.dto.survey;

import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.survey2020.SurveyIntentions2020;
@Data
@NoArgsConstructor
public class SurveyIntentions2020Request {
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
    private String q17;
    private String q18;
    private String q19;
    private String q20;
    private String q21;
    private String q22;
    public SurveyIntentions2020Request(SurveyIntentions2020 intentions2020){
        this.q1=intentions2020.getQ1();
        this.q2=intentions2020.getQ2();
        this.q3=intentions2020.getQ3();
        this.q4=intentions2020.getQ4();
        this.q5=intentions2020.getQ5()!=null ? intentions2020.getQ5():"No Aplica";
        this.q6=intentions2020.getQ6()!=null ? intentions2020.getQ6():"No Aplica";
        this.q7=intentions2020.getQ7()!=null ? intentions2020.getQ7():"No Aplica";
        this.q8=intentions2020.getQ8()!=null ? intentions2020.getQ8():"No Aplica";
        this.q9=intentions2020.getQ9()!=null ? intentions2020.getQ9():"No Aplica";
        this.q10=intentions2020.getQ10()!=null ? intentions2020.getQ10():"No Aplica";
        this.q11=intentions2020.getQ11()!=null ? intentions2020.getQ11():"No Aplica";
        this.q12=intentions2020.getQ12();
        this.q13=intentions2020.getQ13();
        this.q14=intentions2020.getQ14();
        this.q15=intentions2020.getQ15();
        this.q16=intentions2020.getQ16();
        this.q17=intentions2020.getQ17();
        this.q18=intentions2020.getQ18();
        this.q19=intentions2020.getQ19();
        this.q20=intentions2020.getQ20();
        this.q21=intentions2020.getQ21();
        this.q22=intentions2020.getQ22();
    }
}
