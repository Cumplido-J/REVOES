package mx.edu.cecyte.sisec.model.subjects;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.student.StudentRecordScore;
import mx.edu.cecyte.sisec.dto.student.StudentSubject;
import mx.edu.cecyte.sisec.dto.student.StudentSubjectUpdate;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.ScoreModulePartial;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "alumno_uac_parcial")
public class StudentSubjectPartial {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "cct") private String cct;
    @Column(name = "nombre") private String name;
    @Column(name = "calificacion") private String score;
    @Column(name = "horas") private String hours;
    @Column(name = "creditos") private String credits;
    @Column(name = "periodo_escolar") private String scholarPeriod;
    @Column(name = "numero_periodo") private Integer periodNumber;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_uac_id") private CatSubjectType subjectType;

    public StudentSubjectPartial(Student student, StudentSubject studentSubject, CatSubjectType subjectType) {
        this.student = student;
        this.cct = studentSubject.getCct();
        this.name = studentSubject.getName();
        this.score = studentSubject.getScore();
        this.scholarPeriod = studentSubject.getPeriod();
        this.periodNumber = studentSubject.getSemester();
        this.hours = studentSubject.getHours();
        this.credits = studentSubject.getCredits();
        this.subjectType = subjectType;
    }

    public StudentSubjectPartial(Student student, StudentSubjectUpdate subject, CatSubjectType subjectType, Integer periodNumber) {
        this.id = subject.getPartialId();
        this.student = student;
        this.cct = subject.getCct();
        this.subjectType = subjectType;
        this.name = subject.getName();
        this.score =subject.getScore();
        this.hours = subject.getHours();
        this.credits = subject.getCredits();
        this.scholarPeriod = subject.getPeriod();
        this.periodNumber = periodNumber;
    }

    public StudentSubjectPartial( Student student, ScoreModulePartial scoreModulePartial, CatSubjectType subjectType ) {
        this.student = student;
        this.cct = student.getSchoolCareer()!=null ? student.getSchoolCareer().getSchool().getCct() : null;
        this.name = scoreModulePartial.getAsignatura();
        this.score = scoreModulePartial.getCalificacion();
        this.scholarPeriod = scoreModulePartial.getPeriodoEscolar();
        this.periodNumber = scoreModulePartial.getSemestre();
        this.hours = scoreModulePartial.getHoras();
        this.credits = scoreModulePartial.getCreditos();
        this.subjectType = subjectType;
    }

    public StudentSubjectPartial( Student student, Subject subject ) {
        this.student = student;
        this.cct = student.getSchoolCareer()!=null ? student.getSchoolCareer().getSchool().getCct() : null;
        this.name = subject.getName();
        this.score = "NI";
        this.scholarPeriod = "**";
        this.periodNumber = subject.getSemester();
        this.hours = subject.getHours().toString();
        this.credits = "***";
        this.subjectType = subject.getSubjectType();
    }

    public StudentSubjectPartial( Student student, CareerModule careerModule, boolean cecyte, Subject subject ) {
        this.student = student;
        this.cct = student.getSchoolCareer()!=null ? student.getSchoolCareer().getSchool().getCct() : null;
        this.name = careerModule.getModule().getModule();
        this.score = "NI";
        this.scholarPeriod = "**";
        if (cecyte){
            this.periodNumber = careerModule.getOrder() + 1;
        }
        else {
            if (careerModule.getOrder() == 1 || careerModule.getOrder() == 2) this.periodNumber = 3;
            if (careerModule.getOrder() == 3 || careerModule.getOrder() == 4) this.periodNumber = 4;
            if (careerModule.getOrder() == 5 || careerModule.getOrder() == 6) this.periodNumber = 5;
            if (careerModule.getOrder() == 7 || careerModule.getOrder() == 8) this.periodNumber = 6;
        }
        this.hours = careerModule.getHours().toString();
        this.credits = "***";
        this.subjectType = subject.getSubjectType();
    }

    public StudentSubjectPartial(Student student, StudentRecordScore score, CatSubjectType subjectType) {
        this.student = student;
        this.cct = score.getCct();
        this.subjectType = subjectType;
        this.name = score.getName();
        this.score =score.getScore();
        this.hours = score.getHours();
        this.credits = score.getCredits();
        this.scholarPeriod = score.getScholarPeriod();
        this.periodNumber = score.getPeriodNumber();
    }
}
