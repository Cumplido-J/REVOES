package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "permiso_particular")
public class ParticularPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idpermisoparticular")
    private int id;

    @Column(name = "estatus")
    private boolean status;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "idusuario") private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "idpermisocomponente") private ComponentPermission componentPermission;
}
