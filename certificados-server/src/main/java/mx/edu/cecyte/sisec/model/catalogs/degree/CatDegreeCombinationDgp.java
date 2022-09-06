package mx.edu.cecyte.sisec.model.catalogs.degree;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;


@Getter
@Setter
@Entity
@Table(name = "cat_titulo_dgp")
public class CatDegreeCombinationDgp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "institucion_id") private CatDegreeInstitute institute;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrera_id") private CatDegreeCareerDgp career;
}
