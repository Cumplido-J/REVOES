package mx.edu.cecyte.sisec.dto.survey;

import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.survey2022.SurveyIntentions2022;

@Data
@NoArgsConstructor
public class SurveyIntentions2022Request {
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
    private String q23;
    private String q24;
    private String q25;
    private String q26;
    private String q27;
    private String q28;
    public SurveyIntentions2022Request(SurveyIntentions2022 intentions2022){
        this.q1=intentions2022.getQ1();
        this.q2=intentions2022.getQ2();
        this.q3=intentions2022.getQ3();
        this.q4=intentions2022.getQ4();
        this.q5=intentions2022.getQ5()!=null ? intentions2022.getQ5():"No Aplica";
        this.q6=intentions2022.getQ6()!=null ? intentions2022.getQ6():"No Aplica";
        this.q7=intentions2022.getQ7()!=null ? intentions2022.getQ7():"No Aplica";
        this.q8=intentions2022.getQ8()!=null ? intentions2022.getQ8():"No Aplica";
        this.q9=intentions2022.getQ9()!=null ? intentions2022.getQ9():"No Aplica";
        this.q10=intentions2022.getQ10()!=null ? intentions2022.getQ10():"No Aplica";
        this.q11=intentions2022.getQ11()!=null ? intentions2022.getQ11():"No Aplica";
        this.q12=intentions2022.getQ12();
        this.q13=intentions2022.getQ13();
        this.q14=intentions2022.getQ14();
        this.q15=intentions2022.getQ15();
        this.q16=intentions2022.getQ16();
        this.q17=intentions2022.getQ17();
        this.q18=intentions2022.getQ18();
        this.q19=intentions2022.getQ19();
        this.q20=intentions2022.getQ20();
        this.q21=intentions2022.getQ21();
        this.q22=intentions2022.getQ22();
        this.q23=intentions2022.getQ23();
        this.q24=intentions2022.getQ24();
        this.q25=intentions2022.getQ25();
        this.q26=intentions2022.getQ26();
        this.q27=intentions2022.getQ27();
        this.q28=intentions2022.getQ28();
    }
}
