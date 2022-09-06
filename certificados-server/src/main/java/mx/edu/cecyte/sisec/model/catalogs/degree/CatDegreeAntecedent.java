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
@Table(name = "cat_titulo_antecedente")
public class CatDegreeAntecedent {
    @Id
    @Column(name = "estudio_ant_id") private Integer id;
    @Column(name = "tipo_estudio_antecedente") private String name;
    @Column(name = "tipo_educativo_del_antecedente") private String type;
}
