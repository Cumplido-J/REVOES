package mx.edu.cecyte.sisec.classes.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.shared.AppFunctions;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentPartialDecDataUac {
    private String cct;
    private Integer idTipoUAC;
    private String nombreUAC;
    private String calificacionUAC;
    private String totalHorasUAC;
    private String creditosUAC;
    private String periodoEscolarUAC;
    private Integer numeroPeriodoUAC;

    public StudentPartialDecDataUac(StudentSubjectPartial subject) {
        try {
            this.calificacionUAC = AppFunctions.scoreTo1Decimal(Double.parseDouble(subject.getScore()));
        } catch (NumberFormatException e) {
            this.calificacionUAC = "***";
        }
        this.cct = subject.getCct();
        this.idTipoUAC = subject.getSubjectType().getId();
        this.nombreUAC = subject.getName();
        this.creditosUAC = subject.getCredits();
        this.periodoEscolarUAC = subject.getScholarPeriod();
        this.numeroPeriodoUAC = subject.getPeriodNumber();
    }
}
