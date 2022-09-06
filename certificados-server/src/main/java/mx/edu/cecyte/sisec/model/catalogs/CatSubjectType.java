package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordCourse;
import mx.edu.cecyte.sisec.model.subjects.Subject;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_tipo_uac")
public class CatSubjectType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "competencias_uac") private String asignatureCompetencies;

    @OneToMany(mappedBy = "subjectType") Set<Career> careers;
    @OneToMany(mappedBy = "subjectType") Set<Subject> subjects;
    @OneToMany(mappedBy = "subjectType") Set<StudentRecordCourse> studentRecordCourses;
}
