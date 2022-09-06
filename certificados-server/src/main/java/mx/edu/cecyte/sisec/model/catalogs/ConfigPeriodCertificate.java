package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "config_cte_periodos")
public class ConfigPeriodCertificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_entidad") private CatState state;

    //@Column(name = "periodo_inicio") private Date dateStart;
    @Column(name = "periodo_inicio") @Temporal(TemporalType.DATE) private Date dateStart;
    //@Column(name = "periodo_uno") private Date endDate1;
    @Column(name = "periodo_uno") @Temporal(TemporalType.DATE) private Date endDate1;
    //@Column(name = "periodo_dos") private Date endDate2;
    @Column(name = "periodo_dos") @Temporal(TemporalType.DATE) private Date endDate2;
    //@Column(name = "periodo_tres") private Date endDate3;
    @Column(name = "periodo_tres")@Temporal(TemporalType.DATE) private Date endDate3;


    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "id_generacion") private CatGeneration generation;
}
