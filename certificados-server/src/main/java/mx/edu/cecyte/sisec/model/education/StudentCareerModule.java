package mx.edu.cecyte.sisec.model.education;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "alumno_carrera_competencia")
public class StudentCareerModule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "calificacion") private Double score;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrera_competencia_id") private CareerModule careerModule;

    public StudentCareerModule(Student student, CareerModule careerModule, Double score) {
        this.student = student;
        this.careerModule = careerModule;
        this.score = score;
    }

    public StudentCareerModule(Integer id, Student student, CareerModule careerModule, Double score) {
        this.id = id;
        this.student = student;
        this.careerModule = careerModule;
        this.score = score;
    }

    public StudentCareerModule(Student student, CareerModule careerModule) {
        this.student = student;
        this.careerModule = careerModule;
    }
}
