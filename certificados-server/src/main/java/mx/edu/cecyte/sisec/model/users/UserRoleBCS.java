package mx.edu.cecyte.sisec.model.users;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@Table(name = "usuarios_roles")
public class UserRoleBCS{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "model_id") private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "role_id") private RolesBCS rolebcs;
    @Column(name = "model_type") private String modeltype;
    //ManyToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "model_id") private User user;

    public UserRoleBCS(RolesBCS rolebcs, String modeltype, User user){
        this.rolebcs = rolebcs;
        this.modeltype = modeltype;
        this.user = user;
    }
}