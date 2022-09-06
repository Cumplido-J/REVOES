package mx.edu.cecyte.sisec.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.user.GroupData;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "roles")
@NoArgsConstructor @AllArgsConstructor
public class RolesBCS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "name") private String name;

    @Column(name = "guard_name") private String guardname;

    @Column(name = "created_at") private Date created;

    @Column(name = "updated_at") private Date updated;

    @OneToMany(mappedBy = "rolebcs",fetch = FetchType.LAZY)
    Set<UserRoleBCS> userRolesBCS;

    //@ManyToMany(fetch = FetchType.LAZY)
    /*@JoinTable(name = "roles_permisos",
            joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id", referencedColumnName = "id")
    )*/
    @ManyToMany(mappedBy = "rolesBCS")
    private Set<Permissions> permissions ;

    @PrePersist
    public void prePersist(){
        updated = new Date();
    }

    public RolesBCS( GroupData groupData ){
        this.name= groupData.getName();
        this.guardname="api";
        this.created= new Date();
    }

    public void RolesBCSUpdate( GroupData groupData ){
        //this.id=groupData.getId();
        this.name= groupData.getName();
        //this.guardname="api";
        //this.created= groupData.getCreated();
        this.updated = new Date();
    }

    public void removePermission(Permissions permissions){
        this.getPermissions().remove(permissions);
        permissions.getRolesBCS().remove(this);
    }
}