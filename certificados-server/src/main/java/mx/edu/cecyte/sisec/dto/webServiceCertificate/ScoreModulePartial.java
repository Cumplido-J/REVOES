package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.Subject;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScoreModulePartial {

    //private String cct;
    private Integer tipoAsignatura;
    //private String tipoAsignaturaNombre;
    private String asignatura;
    private String calificacion;
    private String creditos;
    private String horas;
    private String periodoEscolar;
    private Integer semestre;


    public ScoreModulePartial( Subject subject ){

        this.tipoAsignatura = subject.getSubjectType().getId();
        this.asignatura =subject.getSubjectType().getName() +"--" +subject.getName();
        this.calificacion = "NI";
        this.horas = subject.getHours().toString();
        this.creditos = "***";
        this.periodoEscolar = "**";
        this.semestre = subject.getSemester();

    }

    public ScoreModulePartial( CareerModule careerModule, boolean cecyte){
        if (cecyte){
            this.tipoAsignatura = 4;
            this.asignatura = "Profesional extendida -- "+careerModule.getModule().getModule();
            this.semestre = careerModule.getOrder() + 1;
        }else {
            this.tipoAsignatura = 4;
            this.asignatura = "Profesional básica -- "+careerModule.getModule().getModule();
            if (careerModule.getOrder() == 1 || careerModule.getOrder() == 2) this.semestre = 3;
            if (careerModule.getOrder() == 3 || careerModule.getOrder() == 4) this.semestre = 4;
            if (careerModule.getOrder() == 5 || careerModule.getOrder() == 6) this.semestre = 5;
            if (careerModule.getOrder() == 7 || careerModule.getOrder() == 8) this.semestre = 6;
        }

        //this.asignatura = careerModule.getModule().getModule();
        this.calificacion = "NI";
        this.horas = careerModule.getHours().toString();
        this.creditos = "***";
        this.periodoEscolar = "**";
    }

}
