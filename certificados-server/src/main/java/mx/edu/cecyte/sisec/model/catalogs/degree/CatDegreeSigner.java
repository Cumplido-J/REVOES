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
@Table(name = "cat_titulo_firmantes")
public class CatDegreeSigner {
    @Id @Column(name = "cargo_id") private Integer id;
    @Column(name = "cargo_firmante") private String name;
}
