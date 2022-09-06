package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "usuario_rol")
public class UserRole {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "usuario_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "rol_id") private Role role;

    public UserRole(User user, Role role) {
        this.role = role;
        this.user = user;
    }
}
