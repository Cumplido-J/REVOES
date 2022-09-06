package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.model.met.CanceledStamps;
import mx.edu.cecyte.sisec.model.met.MetCredentials;
import mx.edu.cecyte.sisec.model.users.*;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "cat_estado")
public class CatState {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "abreviatura") private String abbreviation;

    @OneToMany(mappedBy = "state") Set<CatCity> cities;
    @Column(name = "id_geojson") private String geoMap;
    //@OneToMany(mappedBy = "state") Set<GraduateTracingAdmin> graduateTracingAdmins;
    //@OneToMany(mappedBy = "state") Set<CertificationAdmin> certificationAdmins;
    //@OneToMany(mappedBy = "state") Set<SchoolControlAdmin> schoolControlAdmins;
    //@OneToMany(mappedBy = "state") Set<DegreeAdmim> degreeAdmims;
    //@OneToMany(mappedBy = "state") Set< PlaneacionAdmin > planeacionAdmins;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "state") private MecCredentials mecCredentials;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "state") private MetCredentials metCredentials;

    @OneToMany(mappedBy = "state") Set< ScopeDetail > scopeDetails;

    @OneToMany(mappedBy = "state") Set<ConfigPeriodCertificate> configPeriodCertificates;

    @OneToMany(mappedBy = "state") Set<CanceledStamps> canceledStamps;
}
