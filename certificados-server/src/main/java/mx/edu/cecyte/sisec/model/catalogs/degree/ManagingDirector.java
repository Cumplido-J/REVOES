package mx.edu.cecyte.sisec.model.catalogs.degree;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatState;

import javax.persistence.*;
@Getter
@Setter
@Entity
@Table(name = "administrador_titulacion")
public class ManagingDirector {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "curp") private String curp;
    @Column(name = "rfc") private String rfc;
    @Column(name = "nombre") private String name;
    @Column(name = "apellido_p") private String firstLastName;
    @Column(name = "apellido_m") private String secondLastName;
    @Column(name = "status_id") private Integer statusId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cargo_id") private CatDegreeSigner signer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;
    @Column(name = "genero") private String gender;
}
