package mx.edu.cecyte.sisec.model.survey2020;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "encuesta_intenciones_2020")
public class SurveyIntentions2020 {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "alumno_id") private Student student;

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
    @Column(name = "p17") private String q17;
    @Column(name = "p18") private String q18;
    @Column(name = "p19") private String q19;
    @Column(name = "p20") private String q20;
    @Column(name = "p21") private String q21;
    @Column(name = "p22") private String q22;
}
