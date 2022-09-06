package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.catalogs.CatalogScope;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "detalle_alcance")
public class ScopeDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "catalcanceusuario_id") private CatUserScope catUserScope;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;

    @Column(name = "estatus") private Boolean status;


    public ScopeDetail( CatUserScope catUserScope ){
        this.catUserScope = catUserScope;
    }

    public ScopeDetail( CatState state, School school, Boolean status ){
        this.state = state;
        this.school = school;
        this.status = status;
    }

    public void updateScopeDetail(CatState state, School school, Boolean status){
        this.state = state;
        if (school!=null){
        this.school = school;
        }
        this.status = status;
    }


}
