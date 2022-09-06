package mx.edu.cecyte.sisec.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScholarEnrollmentReports {
    private int reportsId;
    private String matricula;
    private int semestre;
    private int turno;
    private int num_grupos;
    private int num_h;
    private int num_m;


    private int plantelId;
    private String cicloId;
    private int carreraId;
}
