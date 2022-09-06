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
@Table(name = "cat_titulo_motivo")
public class CatDegreeReason {
    @Id @Column(name = "can_id") private Integer id;
    @Column(name = "motivo_cancelacion") private String name;
    @Column(name = "descripcion_cancelacion") private String description;
}
