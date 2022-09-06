package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.Career;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_tipo_estudio")
public class CatStudyType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "observacion") private String observation;
    @Column(name = "observacion_adicional") private String adittionalObservation;

    @OneToMany(mappedBy = "studyType") Set<Career> careers;
}
