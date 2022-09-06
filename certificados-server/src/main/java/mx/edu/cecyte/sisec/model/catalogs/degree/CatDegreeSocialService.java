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
@Table(name = "cat_titulo_servicio_social")
public class CatDegreeSocialService {
    @Id @Column(name = "id_servicio_social") private Integer id;
    @Column(name = "fundamento_legal_servicio_social") private String name;
}
