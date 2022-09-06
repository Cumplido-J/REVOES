package mx.edu.cecyte.sisec.model.education;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "plantel_carrera")
public class SchoolCareer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @OneToMany(mappedBy = "schoolCareer") Set<Student> students;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrera_id") private Career career;

    public SchoolCareer(School school, Career career){
        this.school=school;
        this.career=career;
    }
}
