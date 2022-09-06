package mx.edu.cecyte.sisec.model.catalogs.degree;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "cat_titulo_autorizacion")
public class CatDegreeAuth {
    @Id
    @Column(name = "id_autorizacion") private Integer id;
    @Column(name = "autorizacion_reconocimiento") private String name;
}
