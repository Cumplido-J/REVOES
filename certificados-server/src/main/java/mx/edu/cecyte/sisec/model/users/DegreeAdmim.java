package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import mx.edu.cecyte.sisec.model.catalogs.CatState;

import javax.persistence.*;
/*@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "admin_titulacion")*/
public class DegreeAdmim {
    /*@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "usuario_id") private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "cargo_id") private CatPosition position;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;

    public DegreeAdmim(User user, CatPosition position, CatState state){
        this.user=user;
        this.position=position;
        this.state=state;
    }

    public void updateUserCatState(CatPosition position ,CatState state){
        this.position = position;
        this.state= state;
    }*/
}
