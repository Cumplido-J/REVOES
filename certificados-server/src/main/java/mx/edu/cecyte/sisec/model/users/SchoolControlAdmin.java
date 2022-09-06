package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;

//@NoArgsConstructor
//@Getter
//@Setter
//@Entity
//@Table(name = "administrador_controlescolar")
public class SchoolControlAdmin {
    /*@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "usuario_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;

    public SchoolControlAdmin(User user){
        this.user = user;
    }

    public void UpdateUserSchoolControlAdmin(School school, CatState state){
        this.school = school;
        this.state = state;
    }*/
}
