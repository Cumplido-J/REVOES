package mx.edu.cecyte.sisec.model.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cat_alcance_usuario")
public class CatUserScope {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "nombre") private String name;

    @Column(name = "descripcion") private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "catUserScope") Set<AdminUserScope> adminUserScopes;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "catUserScope") Set< ScopeDetail > scopeDetails;

    public CatUserScope(String name ,String description){
        this.name = name;
        this.description = description;
    }
}
