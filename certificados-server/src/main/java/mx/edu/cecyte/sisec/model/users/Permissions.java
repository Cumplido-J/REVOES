package mx.edu.cecyte.sisec.model.users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.user.GroupData;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@Table(name = "permisos")
public class Permissions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "name") private String name;

    @Column(name = "guard_name") private String guardname;

    @Column(name = "created_at") private Date created;

    @Column(name = "updated_at") private Date updated;

    @Column(name = "detail") private String detail;

    @ManyToMany(
            fetch = FetchType.LAZY

    )
    @JoinTable(name = "roles_permisos",
            joinColumns = @JoinColumn(name = "permission_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    Set< RolesBCS > rolesBCS ;

    @PrePersist
    public void prePersist(){
        updated = new Date();
    }

    public Permissions(GroupData groupData){
        this.name= groupData.getName();
        this.guardname="api";
        this.created= new Date();
        this.detail = groupData.getDescription();
    }

    public void PermissionUpdate( GroupData groupData ){
        //this.id=groupData.getId();
        this.name= groupData.getName();
        //this.guardname="api";
        //this.created= groupData.getCreated();
        this.updated = new Date();
        this.detail = groupData.getDescription();
    }

    public void addGroups(RolesBCS rolesBCS){
        this.rolesBCS.add(rolesBCS);

    }


    public void removeGroups(RolesBCS rolesBCS) {
        this.rolesBCS.remove(rolesBCS);
        rolesBCS.getPermissions().remove(this);
    }
}
