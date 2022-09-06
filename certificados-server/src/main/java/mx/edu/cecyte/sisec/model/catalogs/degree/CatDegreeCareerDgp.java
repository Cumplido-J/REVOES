package mx.edu.cecyte.sisec.model.catalogs.degree;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "cat_titulo_carrera_dgp")
public class CatDegreeCareerDgp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "cve_carrera") private String clave;
    @Column(name = "carrera") private String carrer;
    @Column(name = "carrera_dgp") private String name;
    @Column(name = "modalidad") private String modality;
    @Column(name = "nivel") private String level;
}
