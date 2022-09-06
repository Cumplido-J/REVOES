package mx.edu.cecyte.sisec.model.student.studentRecord;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;

import javax.persistence.*;
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "expediente_materias_parcial")
public class StudentRecordCourse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    //@OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "expedienteparcial_id") private StudentRecordPartial studentRecordPartial;

    @Column(name = "cct") private String cct;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "expedienteparcial_id") private StudentRecordPartial studentRecordPartial;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_uac_id") private CatSubjectType subjectType;

    @Column(name = "nombre") private String name;
    @Column(name = "calificacion") private String score;
    @Column(name = "horas") private String hours;
    @Column(name = "creditos") private String credits;
    @Column(name = "periodo_escolar") private String scholarPeriod;
    @Column(name = "numero_periodo") private Integer periodNumber;



    public StudentRecordCourse(StudentRecordPartial partial, StudentSubjectPartial subject) {
        this.studentRecordPartial = partial;
        this.cct = subject.getCct();
        this.subjectType = subject.getSubjectType();
        this.name = subject.getName();
        this.score = subject.getScore();
        this.hours = subject.getHours();
        this.credits = subject.getCredits();
        this.scholarPeriod = subject.getScholarPeriod();
        this.periodNumber = subject.getPeriodNumber();
    }

    public StudentRecordCourse(StudentRecordPartial studentRecordPartial, String cct, CatSubjectType subjectType, String name, String score, String hours, String credits, String scholarPeriod, Integer periodNumber) {
        this.studentRecordPartial = studentRecordPartial;
        this.cct = cct;
        this.subjectType = subjectType;
        this.name = name;
        this.score = score;
        this.hours = hours;
        this.credits = credits;
        this.scholarPeriod = scholarPeriod;
        this.periodNumber = periodNumber;
    }
}
