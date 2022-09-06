package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.users.AdminUserScope;
import mx.edu.cecyte.sisec.model.users.CertificationAdmin;
import mx.edu.cecyte.sisec.model.users.DegreeAdmim;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_cargo")
public class CatPosition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;

    //@OneToMany(mappedBy = "position") Set<CertificationAdmin> certificationAdmins;
    //@OneToMany(mappedBy = "position") Set<DegreeAdmim> degreeAdmims;

    @OneToMany(mappedBy = "position") Set< AdminUserScope > adminUserScopes;
}
