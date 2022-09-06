package mx.edu.cecyte.sisec.model.reports;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "reportes_reg_egr_tit")
public class GraduatesReports {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="egr_tit_id") private Integer reportsId;

    @Column(name = "matricula") private String matricula;
    @Column(name = "tit_h") private int tit_h;
    @Column(name = "tit_m") private int tit_m;
    @Column(name = "egr_h") private int egr_h;
    @Column(name = "egr_m") private int egr_m;


    @Column(name = "plantel_id") private int plantelId;
    @Column(name = "ciclo_id") private String cicloId;
    @Column(name = "carrera_id") private int carreraId;
}
