package mx.edu.cecyte.sisec.model.met;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatState;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "credenciales_met")
public class MetCredentials {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "estado_id") private CatState state;

    @Column(name = "usuario_prod") private String username;
    @Column(name = "contrasena_prod") private String password;

    @Column(name = "usuario_qa") private String usernameQa;
    @Column(name = "contrasena_qa") private String passwordQa;

    @Column(name = "validado") private String validated;
}
