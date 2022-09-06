package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "cat_titulo_firmantes")
public class CatCargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cargo_id")
    private Integer id;
    @Column(name = "cargo_firmante") private String cargo;
}
