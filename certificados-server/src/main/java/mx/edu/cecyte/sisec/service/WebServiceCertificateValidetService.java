package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.webServiceCertificate.*;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.queries.WebServiceCertificateQueries;
import mx.edu.cecyte.sisec.repo.education.SchoolCareerRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WebServiceCertificateValidetService {

    @Autowired
    private SchoolCareerRepository schoolCareerRepository;

    @Autowired private UserQueries userQueries;

    @Autowired
    private WebServiceCertificateQueries webServiceCertificateQueries;

    public void validStudentDataCertificateTermino( EndPointPrimary endPointPrimary ) {
        if (endPointPrimary.getEndPointStudents().size() >= 30) throw new AppException(" Excede la cantidad de alumnos para la carga de datos maximo 30");
        endPointPrimary.getEndPointStudents().stream().map(endPointStudents -> validDataStudent(endPointStudents, true, false, false, false, false)).collect(Collectors.toList());
    }

    public void validStudentDataCertificatePartial( EndPointPrimary endPointPrimary ){

        if (endPointPrimary.getEndPointStudents().size()>=15) throw new AppException(" Excede la cantidad de alumnos para la carga de datos maximo 15");
        endPointPrimary.getEndPointStudents().stream().map(endPointStudents -> validDataStudent(endPointStudents, false, false, true, false, false)).collect(Collectors.toList());
    }
    /*public void validStudentData( EndPointPrimary endPointPrimary ){
        if (endPointPrimary.getEndPointStudents().size()>=30) throw new AppException(" Excede la cantidad de alumnos para la carga de datos maximo 30");
        endPointPrimary.getEndPointStudents().forEach(
                (endPointStudents )-> {

                    if (endPointStudents.getEndPointStudentData().getCurp()==null || Objects.equals(endPointStudents.getEndPointStudentData().getCurp(), "")) throw new AppException("La curp es inválida ");

                    boolean usernameExists = userQueries.usernameExists(endPointStudents.getEndPointStudentData().getCurp());
                    if (usernameExists) throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" :"+ Messages.user_usernameIsInUse);

                    boolean careerExists = webServiceCertificateQueries.existeSchoolAndCareerInState(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave(), endPointStudents.getEndPointStudentData().getEstadoId() );

                    if (!careerExists){ throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" : Asociación incorrecta de carrera por estado, plantel y carrera");}

                    SchoolCareer schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerIdByCCTAndClave(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
                    Set< CareerModule > careerModulesV = schoolCareer.getCareer().getCareerModules();
                    List<Integer> idCarrerModuleV=careerModulesV.stream().map(CareerModule::getId).collect(Collectors.toList());

                    if( endPointStudents.getEndPointStudentData().getNombre().isEmpty() || endPointStudents.getEndPointStudentData().getApellidoPaterno().isEmpty() || endPointStudents.getEndPointStudentData().getMatricula().isEmpty() || endPointStudents.getEndPointStudentData().getGeneracion().isEmpty() || endPointStudents.getEndPointStudentData().getPromedio()<6){throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": No debe existir campos nulos, vacíos o promedio reprobatorio");}

                    boolean disciplinaryExists = webServiceCertificateQueries.countByIdAndStudyAreaIsNotNull(endPointStudents.getEndPointStudentData().getCampoDisciplinar());
                    if (!disciplinaryExists) throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" : Asociación incorrecta de campo disciplinar");


                    endPointStudents.getScoreModules().forEach(scoreModule -> {
                        if (scoreModule.getIdCarreraCompetencia() == null )throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": El id de la carrera no debe ser nulo");
                        if (scoreModule.getCalificacion() <6 )throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": La calificación del modulo no debe ser reprobatorio");
                        if (!idCarrerModuleV.contains(scoreModule.getIdCarreraCompetencia()))throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": El modulo no pertenece a la asociación de carrera y plantel IdCarreraCompetencia :"+scoreModule.getIdCarreraCompetencia());
                    });

                }
        );

    }*/


    public List< AnswerEndPointPrimary > validStudentData_ENDING_Test( EndPointPrimary endPointPrimary ){
        if (endPointPrimary.getEndPointStudents().size()>=30) throw new AppException(" Excede la cantidad de alumnos para la carga de datos maximo 30");
        List< AnswerEndPointPrimary > answerEndPoint= new ArrayList<>();
        endPointPrimary.getEndPointStudents().forEach(
                (endPointStudents )-> {

                    if (endPointStudents.getEndPointStudentData().getCurp()==null || Objects.equals(endPointStudents.getEndPointStudentData().getCurp(), "")) throw new AppException("La curp es inválida ");

                    boolean usernameExists = userQueries.usernameExists(endPointStudents.getEndPointStudentData().getCurp());
                    if (usernameExists) throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" :"+ Messages.user_usernameIsInUse);

                    boolean careerExists = webServiceCertificateQueries.existeSchoolAndCareerInState(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave(), endPointStudents.getEndPointStudentData().getEstadoId() );

                    if (!careerExists){ throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" : Asociación incorrecta de carrera por estado, plantel y carrera");}

                    SchoolCareer schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerIdByCCTAndClave(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave()).orElseThrow(() -> new AppException("Asociación de carrera incorrecta"));
                    Set< CareerModule > careerModulesV = schoolCareer.getCareer().getCareerModules();
                    List<Integer> idCarrerModuleV=careerModulesV.stream().map(CareerModule::getId).collect(Collectors.toList());

                    if( endPointStudents.getEndPointStudentData().getNombre().isEmpty() || endPointStudents.getEndPointStudentData().getApellidoPaterno().isEmpty() || endPointStudents.getEndPointStudentData().getMatricula().isEmpty() || endPointStudents.getEndPointStudentData().getGeneracion().isEmpty() || endPointStudents.getEndPointStudentData().getPromedio()<6){throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": No debe existir campos nulos, vacíos o promedio reprobatorio");}

                    boolean disciplinaryExists = webServiceCertificateQueries.countByIdAndStudyAreaIsNotNull(endPointStudents.getEndPointStudentData().getCampoDisciplinar());
                    if (!disciplinaryExists) throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" : Asociación incorrecta de campo disciplinar");


                    endPointStudents.getScoreModules().forEach(scoreModule -> {
                        if (scoreModule.getIdCarreraCompetencia() == null )throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": El id de la carrera no debe ser nulo");
                        if (scoreModule.getCalificacion() <6 )throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": La calificación del modulo no debe ser reprobatorio");
                        if (!idCarrerModuleV.contains(scoreModule.getIdCarreraCompetencia()))throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+": El modulo no pertenece a la asociación de carrera y plantel IdCarreraCompetencia :"+scoreModule.getIdCarreraCompetencia());
                    });
                    answerEndPoint.add(new AnswerEndPointPrimary( endPointStudents.getEndPointStudentData(), careerModulesV) );
                }
        );

        return answerEndPoint;
    }

    public List< AnswerEndPointPrimary > validStudentData_PARTIAL_Test( EndPointPrimary endPointPrimary ){
        if (endPointPrimary.getEndPointStudents().size()>=15) throw new AppException(" Excede la cantidad de alumnos para la carga de datos maximo 15");
        List< AnswerEndPointPrimary > answerEndPoint= new ArrayList<>();
        endPointPrimary.getEndPointStudents().forEach(
                (endPointStudents )-> {

                    validDataStudent(endPointStudents,false,false,true,false,true);
                    List<Integer>  semester =validDataStudentScoreModulePARTIAL(endPointStudents.getScoreModulePartials(),endPointStudents.getEndPointStudentData().getCurp());
                    SchoolCareer schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerIdByCCTAndClave(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave()).orElseThrow(() -> new AppException("Asociación de carrera incorrecta"));
                    List<ScoreModulePartial> scoreModulePartial= webServiceCertificateQueries.getAvailableStudentSubjectsTEST( schoolCareer, semester );

                    answerEndPoint.add(new AnswerEndPointPrimary( endPointStudents.getEndPointStudentData(), scoreModulePartial,"certificado parcial") );
                }
        );

        return answerEndPoint;
    }

    //---------------------------------------certificate partial----------------------------------------


    public EndPointStudents validDataStudent( EndPointStudents endPointStudents,
                                              boolean isFinal,boolean es_bach_tec, boolean certificado_parcial,boolean isAbrogado,boolean isTEST ){

        if (endPointStudents.getEndPointStudentData().getCurp()==null || Objects.equals(endPointStudents.getEndPointStudentData().getCurp(), "")) throw new AppException("La curp es requerido ");

        boolean usernameExists = userQueries.usernameExists(endPointStudents.getEndPointStudentData().getCurp());
        //if (usernameExists) throw new AppException(endPointStudents.getEndPointStudentData().getCurp()+" :"+ Messages.user_usernameIsInUse);
        SchoolCareer schoolCareer = new SchoolCareer();
        if (!usernameExists) {
            boolean careerExists = webServiceCertificateQueries.existeSchoolAndCareerInState(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave(), endPointStudents.getEndPointStudentData().getEstadoId());

            if (!careerExists) {
                throw new AppException(endPointStudents.getEndPointStudentData().getCurp() + " : Asociación incorrecta de carrera por estado, plantel y carrera");
            }

            schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerIdByCCTAndClave(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave()).orElseThrow(() -> new AppException("Asociación de carrera incorrecta"));

            if (endPointStudents.getEndPointStudentData().getNombre().isEmpty() || endPointStudents.getEndPointStudentData().getApellidoPaterno().isEmpty() || endPointStudents.getEndPointStudentData().getMatricula().isEmpty() || endPointStudents.getEndPointStudentData().getGeneracion().isEmpty() || endPointStudents.getEndPointStudentData().getPromedio() < 6) {
                throw new AppException("CURP :" + endPointStudents.getEndPointStudentData().getCurp() + " -- No debe existir campos nulos, vacíos o promedio reprobatorio");
            }


        }else {
            User userSchool= userQueries.getUserByUsername(endPointStudents.getEndPointStudentData().getCurp());
            boolean careerExists = webServiceCertificateQueries.existeSchoolAndCareerInState(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave(), userSchool.getStudent().getSchoolCareer().getSchool().getCity().getState().getId());

            if (!careerExists) {
                throw new AppException(endPointStudents.getEndPointStudentData().getCurp() + " : Asociación incorrecta de carrera por estado, plantel y carrera");
            }
            schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerIdByCCTAndClave(endPointStudents.getEndPointStudentData().getCctPlantel(), endPointStudents.getEndPointStudentData().getCarreraClave()).orElseThrow(() -> new AppException("Asociación de carrera incorrecta"));
        }

        boolean disciplinaryExists = webServiceCertificateQueries.countByIdAndStudyAreaIsNotNull(endPointStudents.getEndPointStudentData().getCampoDisciplinar());
        if (!disciplinaryExists)
            throw new AppException(endPointStudents.getEndPointStudentData().getCurp() + " : Asociación incorrecta de campo disciplinar");
        if (!isTEST) {
            if (isFinal) {
                if (endPointStudents.getScoreModules() == null) {
                    throw new AppException(endPointStudents.getEndPointStudentData().getCurp() + " : scoreModules requerido");
                } else {
                    validDataStudentScoreModuleTERMINO(endPointStudents.getScoreModules(), schoolCareer, endPointStudents.getEndPointStudentData().getCurp());
                }
            }

            if (certificado_parcial) {
                if (endPointStudents.getEndPointStudentData().getCreditosObtenidos() == null) {
                    throw new AppException(endPointStudents.getEndPointStudentData().getCurp() + " : Creditos obtenidos requerido");
                }
                if (endPointStudents.getScoreModulePartials() == null) {
                    throw new AppException(endPointStudents.getEndPointStudentData().getCurp() + " : scoreModulePartials requerido");
                } else {
                    validDataStudentScoreModulePARTIAL(endPointStudents.getScoreModulePartials(), endPointStudents.getEndPointStudentData().getCurp());
                }
            }
        }

        return endPointStudents;
    }

    public void validDataStudentScoreModuleTERMINO( List< ScoreModule > scoreModules,SchoolCareer schoolCareer, String curp ){
        Set< CareerModule > careerModulesV = schoolCareer.getCareer().getCareerModules();
        List<Integer> idCarrerModuleV=careerModulesV.stream().map(CareerModule::getId).collect(Collectors.toList());

        scoreModules.forEach(scoreModule -> {
            if (scoreModule.getIdCarreraCompetencia() == null )throw new AppException("Curp :"+curp+": El id de la carrera no debe ser nulo");
            if (scoreModule.getCalificacion() <6 )throw new AppException("Curp :"+curp+": La calificación del modulo no debe ser reprobatorio");
            if (!idCarrerModuleV.contains(scoreModule.getIdCarreraCompetencia()))throw new AppException("Curp :"+curp+": El modulo no pertenece a la asociación de carrera y plantel IdCarreraCompetencia :"+scoreModule.getIdCarreraCompetencia());
        });
    }

    public List<Integer>  validDataStudentScoreModulePARTIAL( List<ScoreModulePartial> scoreModulePartials, String curp ){
        List<Integer>  semester = new ArrayList<>();
        scoreModulePartials.forEach(scoreModulePartial -> {
            if (scoreModulePartial.getAsignatura().isEmpty()) throw new AppException("Curp :"+curp+" -- Campo asignatura requerido");

            if (scoreModulePartial.getTipoAsignatura()==null){throw new AppException("Curp :"+curp+" -- Asignatura : "+scoreModulePartial.getAsignatura() +" -- Campo tipoAsignatura invalido");}
            else {
                boolean disciplinaryExists = webServiceCertificateQueries.countByIdSubjectType(scoreModulePartial.getTipoAsignatura());
                if (!disciplinaryExists)
                    throw new AppException("Curp :" + curp + " -- Asignatura : " + scoreModulePartial.getAsignatura() + " -- Campo tipoAsignatura incorrecto");
            }
            if (scoreModulePartial.getCalificacion().isEmpty()) throw new AppException("Curp :"+curp+" -- Asignatura :"+scoreModulePartial.getAsignatura() +" -- Campo calificación requerido");
            if (scoreModulePartial.getCreditos().isEmpty()) throw new AppException("Curp :"+curp+" -- Asignatura :"+scoreModulePartial.getAsignatura() +" -- Campo creditos requerido");
            if (scoreModulePartial.getHoras().isEmpty()) throw new AppException("Curp :"+curp+" -- Asignatura :"+scoreModulePartial.getAsignatura() +" -- Campo horas requerido");
            if (scoreModulePartial.getPeriodoEscolar().isEmpty()) throw new AppException("Curp :"+curp+" -- Asignatura :"+scoreModulePartial.getAsignatura() +" -- Campo periodoEscolar requerido");
            if (scoreModulePartial.getSemestre() == null){ throw new AppException("Curp :"+curp+" -- Asignatura :"+scoreModulePartial.getAsignatura() +" -- Campo semestre requerido");}
            else { if (scoreModulePartial.getSemestre() > 6){ throw new AppException("Curp :"+curp+" -- Asignatura :"+scoreModulePartial.getAsignatura() +" -- Campo semestre invalido ( 1 - 6 )");} }
            semester.add( scoreModulePartial.getSemestre() );
        });
        return semester;
    }

}
