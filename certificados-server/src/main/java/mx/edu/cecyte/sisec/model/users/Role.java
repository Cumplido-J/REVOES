package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "rol")
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "descripcion") private String description;

    @OneToMany(mappedBy = "role") Set<UserRole> userRoles;
}
