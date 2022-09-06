package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;


import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "administrador_alcance_usuario")
public class AdminUserScope {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @OneToOne(fetch = FetchType.LAZY)  @JoinColumn(name = "usuario_id") private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "catcargo_id") private CatPosition position;

    @Column(name = "estatus") private Boolean status;

    @ManyToOne(fetch = FetchType.LAZY)  @JoinColumn(name = "catalcance_id") private CatUserScope catUserScope;

    public AdminUserScope(User user,CatPosition catPosition, Boolean status,CatUserScope catUserScope){
        this.user = user;
        this.position = catPosition;
        this.status = status;
        this.catUserScope = catUserScope;
    }
}
