package mx.edu.cecyte.sisec.model.reports;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.School;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "reportes_matr_escolar")
public class ScholarEnrollmentReports {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="reportes_id") private Integer reportsId;

    @Column(name = "matricula") private String matricula;
    @Column(name = "semestre") private int semestre;
    @Column(name = "turno") private int turno;
    @Column(name = "num_grupos") private int num_grupos;
    @Column(name = "num_h") private int num_h;
    @Column(name = "num_m") private int num_m;


    @Column(name = "plantel_id") private int plantelId;
    @Column(name = "ciclo_id") private String cicloId;
    @Column(name = "carrera_id") private int carreraId;
}
