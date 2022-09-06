package mx.edu.cecyte.sisec.model.catalogs.degree;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.met.DegreeData;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_titulo_entidades")
public class CatDegreeState {
    @Id @Column(name = "entidad_id") private Integer id;
    @Column(name = "c_nom_ent") private String name;
    @Column(name = "c_entidad_abr") private String abbreviation;
    @Column(name = "municipio") private String cityName;
    @Column(name = "decreto_numero") private String decreeNumber;
    @Column(name = "decreto_fecha") private String decreeDate;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;

}
