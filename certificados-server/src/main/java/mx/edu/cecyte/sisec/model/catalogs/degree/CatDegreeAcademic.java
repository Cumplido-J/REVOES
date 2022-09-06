package mx.edu.cecyte.sisec.model.catalogs.degree;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "cat_organigrama")
public class CatDegreeAcademic {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "academico_id") private Integer id;
    @Column(name = "grado_estudio") private String studyGrade;
    @Column(name = "nombre") private String name;
    @Column(name = "primer_apellido") private String firstLastName;
    @Column(name = "segundo_apellido") private String secondLastName;

    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ref_entidad", referencedColumnName = "entidad_id") private CatDegreeState entity;

    @Column(name = "status_vigencia") private Integer validity;
    @Column(name = "curp") private String curp;
    @Column(name = "ref_puesto") private Integer position;
}
