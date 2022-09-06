package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_tipo_plantel")
public class CatSchoolType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "siglas") private String acronym;
    @Column(name = "iems") private String iems;
    @Column(name = "siglas_iems") private String acronymIems;

    @OneToMany(mappedBy = "schoolType") Set<School> schools;
}
