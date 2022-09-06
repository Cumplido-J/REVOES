package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;

/*@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "administrador_seguimiento")*/
public class GraduateTracingAdmin {
   /*@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "usuario_id") private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;

    public GraduateTracingAdmin(User user){
        this.user = user;
    }

    public void UpdateUserGraduateTracingAdmin(School school, CatState state){
        this.school = school;
        this.state = state;
    }*/
}
