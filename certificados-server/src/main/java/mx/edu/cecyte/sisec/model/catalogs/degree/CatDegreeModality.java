package mx.edu.cecyte.sisec.model.catalogs.degree;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "cat_titulo_modalidad")
public class CatDegreeModality {
    @Id
    @Column(name = "id_modalidad") private Integer id;
    @Column(name = "modalidad_titulacion") private String name;
    @Column(name = "tipo_de_modalidad") private String type;

}
