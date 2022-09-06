package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_opcion_educativa")
public class CatEducationalOption {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "modalidad_educativa") private String educationalModality;
    @Column(name = "observacion") private String observation;

    @OneToMany(mappedBy = "educationalOption") Set<School> schools;
}
