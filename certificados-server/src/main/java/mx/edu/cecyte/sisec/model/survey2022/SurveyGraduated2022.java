package mx.edu.cecyte.sisec.model.survey2022;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2021Request;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2022Request;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "encuesta_egresados_2022")
public class SurveyGraduated2022 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "alumno_id") private Student student;
    @Column(name = "folio") private String confirmationFolio;
    @Column(name = "fecha") private Date date;
    @Column(name = "p1") private String q1;
    @Column(name = "p2") private String q2;
    @Column(name = "p3") private String q3;
    @Column(name = "p4") private String q4;
    @Column(name = "p5") private String q5;
    @Column(name = "p6") private String q6;
    @Column(name = "p7") private String q7;
    @Column(name = "p8") private String q8;
    @Column(name = "p9") private String q9;
    @Column(name = "p10") private String q10;
    @Column(name = "p11") private String q11;
    @Column(name = "p12") private String q12;
    @Column(name = "p13") private String q13;
    @Column(name = "p14") private String q14;
    @Column(name = "p15") private String q15;
    @Column(name = "p16") private String q16;

    public SurveyGraduated2022(SurveyGraduated2022Request surveyRequest, Student student) {
        this.confirmationFolio = UUID.randomUUID().toString();
        this.date=new Date();
        this.q1 = surveyRequest.getQ1();
        this.q2 = surveyRequest.getQ2();
        this.q3 = surveyRequest.getQ3();
        this.q4 = surveyRequest.getQ4();
        this.q5 = surveyRequest.getQ5();
        this.q6 = surveyRequest.getQ6();
        this.q7 = surveyRequest.getQ7();
        this.q8 = surveyRequest.getQ8();
        this.q9 = surveyRequest.getQ9();
        this.q10 = surveyRequest.getQ10();
        this.q11 = surveyRequest.getQ11();
        this.q12 = surveyRequest.getQ12();
        this.q13 = surveyRequest.getQ13();
        this.q14 = surveyRequest.getQ14();
        this.q15 = surveyRequest.getQ15();
        this.q16 = surveyRequest.getQ16();
        this.student = student;
    }
}
