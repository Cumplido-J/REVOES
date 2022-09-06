package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.Subject;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_campo_disciplinar")
public class CatDisciplinaryField {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "trayecto") private String studyArea;

    @OneToMany(mappedBy = "disciplinaryField") Set<Career> careers;
    @OneToMany(mappedBy = "disciplinaryField") Set<Subject> subjects;
    @OneToMany(mappedBy = "disciplinaryField") Set< Student > students;
}
