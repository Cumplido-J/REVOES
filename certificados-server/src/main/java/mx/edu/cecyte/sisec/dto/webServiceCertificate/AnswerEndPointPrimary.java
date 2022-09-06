package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;


import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerEndPointPrimary {
    private String alumno;

    private List<String> carreraModulo;

    private String estatus;



    public AnswerEndPointPrimary( Student student, List< StudentCareerModule > studentCareerModules, Certificate certificate ){
        this.alumno= student != null ? (student.getEnrollmentKey()+ " :"+"Creado correctamente" ):"";
        this.carreraModulo = studentCareerModules.stream().map(studentCareerModule -> {
            if (studentCareerModule.getCareerModule() != null) {
                return "Id: " + studentCareerModule.getCareerModule().getId() + " Calificacion :" + studentCareerModule.getScore();
            }
                return "Id: " + "N/A"+ " Calificacion:" + studentCareerModule.getScore();
        }
        ).collect(Collectors.toList());
        this.estatus = certificate.getStatus();
    }

    public AnswerEndPointPrimary( EndPointStudentData endPointStudentData, Set< CareerModule > careerModules ){
       this.alumno = "Curp :"+endPointStudentData.getCurp()+ " -- Nombre :"+endPointStudentData.getNombre()+ " "+endPointStudentData.getApellidoPaterno()+ " "+endPointStudentData.getApellidoMaterno();
       this.carreraModulo= careerModules.stream().map(
               careerModule -> "ID :"+careerModule.getId()+" -- Carrera :"+careerModule.getCareer().getName()+" -- Modulo :"+careerModule.getModule().getModule()
       ).collect(Collectors.toList());
       this.estatus="Aprobado";
    }

    //-------- vertificate partial

    public AnswerEndPointPrimary( Student student, List< StudentSubjectPartial > studentSubjectPartials, Certificate certificate, boolean isPartial ){
      if (isPartial) {
          this.alumno = student != null ? (student.getEnrollmentKey() + " :" + "Creado correctamente") : "";
          this.carreraModulo = studentSubjectPartials.stream().map(studentSubjectPartial -> {
                      return "Semestre " + studentSubjectPartial.getPeriodNumber() + " -- Materia registrada :" + studentSubjectPartial.getName();
                  }
          ).collect(Collectors.toList());
          this.estatus = certificate.getStatus();
      }
    }

    public AnswerEndPointPrimary( EndPointStudentData endPointStudentData, List<ScoreModulePartial> scoreModulePartial, String c ){
        this.alumno = "Curp :"+endPointStudentData.getCurp()+ " -- Nombre :"+endPointStudentData.getNombre()+ " "+endPointStudentData.getApellidoPaterno()+ " "+endPointStudentData.getApellidoMaterno();

        this.carreraModulo= scoreModulePartial.stream().map( scoreModulePartial1 ->
                "SEMESTRE :"+scoreModulePartial1.getSemestre()+" iDTA :"+scoreModulePartial1.getTipoAsignatura()+" Asignatura :"+scoreModulePartial1.getAsignatura()+ " -- calificacion :"+scoreModulePartial1.getCalificacion()+" -- horas :"+scoreModulePartial1.getHoras() +" -- cerditos :"+scoreModulePartial1.getCreditos()+" -- periodo :"+scoreModulePartial1.getPeriodoEscolar()
        ).collect(Collectors.toList());

        this.estatus="Aprobado";
    }


}
