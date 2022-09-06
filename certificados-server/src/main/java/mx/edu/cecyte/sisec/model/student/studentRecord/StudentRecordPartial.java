package mx.edu.cecyte.sisec.model.student.studentRecord;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "expediente_parcial")
public class StudentRecordPartial {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrera_id") private Career career;

    @Column(name = "calificacion") private Double finalScore;
    @Column(name = "creditos_obtenidos") private Integer obtainedCredits;
    @Column(name = "matricula") private String enrollmentKey;
    @Column(name = "generacion") private String generation;
    @Column(name = "periodo_inicio") private Date enrollmentStartDate;
    @Column(name = "periodo_termino") private Date enrollmentEndDate;
    @Column(name = "tipo_certificado") private Integer typeCertificate;

    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Column(name = "create_at") private String created;

    @Column(name = "cambio") private Boolean change;

    //@OneToOne(fetch = FetchType.LAZY, mappedBy = "studentRecordPartial") private StudentRecordCourse studentRecordCourse;
    @OneToMany(mappedBy = "studentRecordPartial") Set<StudentRecordCourse> studentRecordCourses;

    public StudentRecordPartial(Student student, Integer type) {
        this.user = student.getUser();
        this.school = student.getSchool();
        this.career = student.getSchoolCareer().getCareer();
        this.finalScore = student.getFinalScore();
        this.obtainedCredits = student.getObtainedCredits();
        this.enrollmentKey = student.getEnrollmentKey();
        this.generation = student.getGeneration();
        this.enrollmentStartDate = student.getEnrollmentStartDate();
        this.enrollmentEndDate = student.getEnrollmentEndDate();
        this.typeCertificate = type;
        this.created = AppFunctions.getDate();
        this.change = true;
    }
}
