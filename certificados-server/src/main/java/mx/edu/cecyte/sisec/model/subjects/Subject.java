package mx.edu.cecyte.sisec.model.subjects;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.education.Career;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "uac")
public class Subject {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "nombre") private String name;
    @Column(name = "clave_uac") private String asignatureKey;
    @Column(name = "md") private Integer md;
    @Column(name = "ei") private Integer ei;
    @Column(name = "horas") private Integer hours;
    @Column(name = "creditos") private Integer credits;
    @Column(name = "semestre") private Integer semester;
    @Column(name = "optativa") private Boolean optional;
    @Column(name = "cecyte") private Boolean cecyte;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "campo_disciplinar_id")
    private CatDisciplinaryField disciplinaryField;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_uac_id") private CatSubjectType subjectType;

    @OneToMany(mappedBy = "subject") Set<StudentScore> studentScores;
}
