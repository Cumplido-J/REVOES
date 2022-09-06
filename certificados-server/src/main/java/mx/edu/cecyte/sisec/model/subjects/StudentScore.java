package mx.edu.cecyte.sisec.model.subjects;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "alumno_uac")
public class StudentScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "estatus") private String status;
    @Column(name = "calificacion") private Double score;
    @Column(name = "periodo") private String period;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "uac_id") private Subject subject;

}
