package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "permiso_componente")
public class ComponentPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idpermisocomponente")
    private int id;

    @Column(name = "nombre")
    private String name;

    @Column(name = "seccion")
    private String seccion;

    @OneToMany(mappedBy = "componentPermission")
    Set<ParticularPermission> particularPermissions;

}
