package mx.edu.cecyte.sisec.model.catalogs.degree;


import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.degree.DegreeIntituteDgp;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "cat_titulo_instituciones")
public class CatDegreeInstitute {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "cve_institucion") private String clave;
    @Column(name = "nombre_institucion") private String name;
    @Column(name = "nombre_completo") private String complete;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "entidad_ref") private CatDegreeState entity;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;

    public CatDegreeInstitute(){}

    public CatDegreeInstitute(DegreeIntituteDgp degreeIntituteDgp, CatDegreeState state, School school) {
        this.id = degreeIntituteDgp.getId();
        this.clave = degreeIntituteDgp.getClave();
        this.name = degreeIntituteDgp.getName();
        this.complete = degreeIntituteDgp.getComplete();
        this.entity = state;
        this.school = school;
    }


    //@OneToMany(fetch = FetchType.LAZY, mappedBy = "institute") private CatDegreeCarrer catDegreeCarrer;
}
