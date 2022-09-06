package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.catalogs.CatalogOrder;
import mx.edu.cecyte.sisec.dto.masiveload.*;
import mx.edu.cecyte.sisec.dto.masiveload.graduates.GraduadosCarga;
import mx.edu.cecyte.sisec.dto.masiveload.graduates.MasiveLoadGraduates;
import mx.edu.cecyte.sisec.dto.student.*;
import mx.edu.cecyte.sisec.log.MasiveGraduateLogger;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.service.*;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.*;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/masiveLoad")
@Log4j
public class MasiveLoadController{
    @Autowired private StudentService studentService;
    @Autowired private UserService userservice;
    @Autowired private CatalogService catalogservice;
    @Autowired private MasiveLoadGraduatesService masiveloadgraduatesservice;
    @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;
   // @Autowired private Date date;

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> insertMasiveLoad(@LoggedUser UserSession userSession, @Valid @RequestBody MasiveLoad masiveLoad)
    {

        try {
            //System.out.println("autoridades de usaurio logeado"+userSession.getAuthorities().toString());
            //validamos vengan datos en el excel y que las competencias coincidan
            ArrayList<String> alumnosInexistentes=validateStudentExist(masiveLoad.getCargaAlumnos(),userSession.getId());
            masiveLoad.getCargaAlumnos().forEach(r->{
                System.out.println(r.getCurp()+"  "+r.getClave_carrera());
            });
            if(alumnosInexistentes.size()>0)
            {
                String listaCURPS="";
                for(String a: alumnosInexistentes){
                    listaCURPS=listaCURPS+" "+a;
                    System.out.println("--------> "+a);
                }
                return CustomResponseEntity.BAD_REQUEST("Los siguientes alumnos estan incorrectos: "+listaCURPS);
            }


            //grabamos a base los datos pasados
            updateStudentUserData(masiveLoad.getCargaAlumnos(),userSession.getId());
            System.out.println("despues de updateStudentUserData");
            return CustomResponseEntity.OK("{Todos los alumnos han sido insertados}");
        } catch (AppException exception) {
            //CertificateLogger.validateStudents(log, exception.getMessage(), userSession, certificateCurps);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            //CertificateLogger.validateStudents(log, exception.toString(), userSession, certificateCurps);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    private ArrayList<String> validateStudentExist(ArrayList<AlumnoCarga> alumnos, int idUsuario)
    {
        ArrayList<String> datosIncorrectos=new ArrayList<String>();
        StudentData studentdata=null;
        String CURP="";
        //validamos que existan renglones
        if(alumnos.size()>0){
            for (AlumnoCarga alumno : alumnos)
            {
                //validamos que el CURP exista como estudiante
                studentdata =studentService.getStudentDataML(alumno.getCurp());
                if(studentdata!=null){
                    CURP=""+studentdata.getCurp();
                }
                //System.out.println("student.CURP:"+CURP+"  == alumno.CURP:"+alumno.getCurp());
                if(!CURP.equals(alumno.getCurp())){
                    datosIncorrectos.add(alumno.getCurp());
                }
            }
            return  datosIncorrectos;
        }else
        {
            throw new AppException("No existen alumnos");
        }
    }


    //Actualizamos campo updateIsPortability en alumno, y en user setName setFirstLastName setSecondLastName
    private void updateStudentUserData(ArrayList<AlumnoCarga> alumnos, int idUsuario)
    {
        try{
            Student student;
            User userdata;
            //varibles para insertar las calificaciones en las competencias
            List<StudentPortabilityModules> studentmodules=new ArrayList<StudentPortabilityModules>();

            System.out.println("en update user");
            //validamos que existan renglones
            if(alumnos.size()>0){
                for (AlumnoCarga alumno : alumnos)
                {
                    int competenciasInsertadas=0;
                    /////////////Obtenemos los modulos del alumno

                    //obtenemos los datos del alumno
                    StudentData studentdata=studentService.getStudentData(alumno.getCurp(), idUsuario);
                    //obtebenos los modulos de su caarrera
                    List<CatalogOrder> modulos=new ArrayList<CatalogOrder>();
                    modulos=catalogservice.getModulesByCareerOrdered(studentdata.getCareerId());
                    Collections.sort(modulos);
                    for(CatalogOrder y : modulos){
                        System.out.println("modulos ordenados"+y.getId());
                    }
                    //Los ordenamos por id_carrera_competencia


                    //creamos lo necesario para insertar portability
                    StudentPortability studentportability=new StudentPortability();
                    studentportability.setCurp(alumno.getCurp());
                    //creamos un objeto para meter los modulos
                    List<StudentPortabilityModules> mod=new ArrayList<StudentPortabilityModules>();
                    //validamos que haya el mismo numero de competencias que las que capturaron por alumno
                    //System.out.println("-------------------->Alumno"+alumno.getNombre());
                    //System.out.println("-------------------->modulos por carrera:"+modulos.size()+", competencias alumno:"+alumno.getCompetencias().size());
                    if(modulos.size()!=alumno.getCompetencias().size()){
                        for(Competencia x: alumno.getCompetencias()){System.out.println("competencia----->"+x.toString());}
                        throw new AppException("No se tiene el mismo numero de modulos que calificaciones capturadas "+modulos.size()+"!="+alumno.getCompetencias().size());
                    }
                    for(Competencia x: alumno.getCompetencias()){System.out.println("competencia----->"+x.toString());}
                    int i=0;
                    //iteramos sobre el arreglo competencias que enviaron en el post
                    for (Competencia competencia : alumno.getCompetencias())
                    {
                        StudentPortabilityModules stu=new StudentPortabilityModules();
                        stu.setScore(competencia.getCalificacion());
                        stu.setModuleName(modulos.get(i).getDescription1());
                        stu.setCareerName(alumno.getNombre_carrera());
                        stu.setId(modulos.get(i).getId());
                        mod.add(competenciasInsertadas,stu);
                        System.out.println(competenciasInsertadas+" "+stu.toString());
                        competenciasInsertadas++;
                        i++;
                    }
                    studentportability.setModules(mod);
                    //invocamo el servicion para insertar los modulos y calificaciones
                    studentService.addPortabilityModules(studentportability);
                    System.out.println("despues de studentService.addPortabilityModules");

                    ///////////////////////actualizamos los demas datos/////////////////////////
                    ///////////////actualizamos isPortability
                    ////////////Actualizamos Final score(Double finalScore, Boolean reprobate, String CURP, String enrollmentKey)

                    //consultamos enrollmentStartDate y enrollmentEndDate
                    Periods periodos=studentService.getPeriodosByStateGeneration(alumno.getEntidad(), alumno.getGeneracion());
                    String enrollmentStartDate=""+periodos.getPeriodo_inicio();
                    String enrollmentEndDate=""+periodos.getPeriodo_termino();

                    studentService.updateStudenForMasiveLoad(alumno.getPromedio(), reprobado(alumno), alumno.getCurp(), enrollmentStartDate,
                            enrollmentEndDate, alumno.getGeneracion());
                    System.out.println("despues de updateIsPortabilityAndFinalScore");


                    /////////////Actualizamos full name
                    studentService.updateFullName(alumno);
                    System.out.println("---------despues for update full name------>"+alumno.getNombre());
                }
            }else
            {
                throw new AppException("No se insertaron calificaciones de modulo de los alumnos");
            }
        }catch(AppException exception)
        {
            throw new AppException("No se insertaron calificaciones de modulo de los alumnos");
        }
    }

    private Boolean reprobado(AlumnoCarga a){
        Boolean reprobado=false;
        if(a.getPromedio()<6.0){
            reprobado=true;
        }else {
            for(Competencia c : a.getCompetencias()){
                if(c.getCalificacion()<6.0){
                    reprobado=true;
                }
            }
        }
        return reprobado;
    }

    /////////////////////////////CARGA MASIVA EGRESADOS///////////////////
    @PostMapping("/addGraduates")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> insertMasiveLoadGraduates(@LoggedUser UserSession userSession, @Valid @RequestBody MasiveLoadGraduates masiveLoadgraduates)
    {
        System.out.println("peticion:"+masiveLoadgraduates.getGraduadosAlumnos().get(0).toString());

        masiveloadgraduatesservice.insertMasiveGraduate(masiveLoadgraduates.getGraduadosAlumnos());

        try {
            //obtenemos id de tabla rol
            int rol_id = masiveloadgraduatesservice.getRolId();
            String alumnos_con_error = "";
            int total_alumnos=0;
            int total_procesados=0;
            int total_con_error=0;

            total_alumnos=masiveLoadgraduates.getGraduadosAlumnos().size();

            //iteramos el json array de registros
            for (GraduadosCarga graduados : masiveLoadgraduates.getGraduadosAlumnos()) {

                Integer carrera_id = 0;
                Integer plantel_id = 0;
                Integer plantel_carrera_id = 0;
                Integer usuario_id = 0;

                int procesados=0;

                //validamos CURP
                String curp=""+graduados.getCurp().trim().toUpperCase();
                if(curp.length()==10 || curp.length()==18){}
                else
                {
                    alumnos_con_error += " |" + graduados.getCurp() + ":El CURP no es valido| ";
                    total_con_error+=1;
                    continue;
                }

                ////////////////verificamos que esten llenos todos los campos
                if (graduados.getTurno().trim().length() > 0 && graduados.getAp_paterno().trim().length() > 0 && graduados.getGrupo().trim().length() > 0
                        && graduados.getGenero().trim().length() > 0 && graduados.getCorreo().trim().length() > 0 && graduados.getAp_materno().trim().length() > 0
                        && graduados.getNombre().trim().length() > 0 && graduados.getMatricula().trim().length() > 1 && graduados.getCurp().trim().length() > 0 &&
                        graduados.getCct().trim().length() > 0 && graduados.getCve_carrera().trim().length() > 0) {

                    ///////////////vamos por el plantel_carrera_id a la BD
                    plantel_carrera_id = 0 + masiveloadgraduatesservice.getPlantelCarreraId(graduados.getCct(), graduados.getCve_carrera());
                    //obtenemos el id carrera y plantel
                    carrera_id = 0 + masiveloadgraduatesservice.getCarreraId(graduados.getCve_carrera());
                    plantel_id = 0 + masiveloadgraduatesservice.getPlantelId(graduados.getCct());



                    //////////////si no existe lo vamos a insertar
                    if (plantel_carrera_id < 1) {
                        //si tienen coincidencia carrera y plantel damos de alta en tabla plantel carrera id
                        if (carrera_id > 0 && plantel_id > 0) {
                            //insertamos el nuevo registro en la tabla plantel_carrera
                            masiveloadgraduatesservice.putPlantelCarrera(carrera_id, plantel_id);
                            //consultamos el registro creado y lo guardamos en variable
                            plantel_carrera_id = 0 + masiveloadgraduatesservice.getPlantelCarreraId(graduados.getCct(), graduados.getCve_carrera());
                        } else {
                            alumnos_con_error+=" |"+curp + ":Plantel ó carrera no existe| ";
                            total_con_error+=1;
                            continue;
                        }
                    }

                    //obtenemos usuario_id
                    usuario_id = 0 + masiveloadgraduatesservice.getUsuarioId(curp);
                    ///////////sino exite lo creamos
                    if (usuario_id < 1) {
                        //encriptamos
                        String pssEnc = bCryptPasswordEncoder.encode(("" + graduados.getMatricula()));
                        //definimos fecha
                        String pattern = "yyyy-M-dd hh:mm:ss";
                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern, new Locale("es", "MX"));
                        String fecha = simpleDateFormat.format(new Date());

                        //creamos el usuario
                        masiveloadgraduatesservice.putUsuario(curp, fecha, pssEnc, graduados.getNombre(),
                                graduados.getAp_paterno(), graduados.getAp_materno(), graduados.getCorreo());
                        //obtenemos el usuario_id creado
                        usuario_id = 0 + masiveloadgraduatesservice.getUsuarioId(curp);

                        if (usuario_id > 0) {
                            procesados+=1;
                        }
                    }

                    if(usuario_id != null){
                        String pssEnc = bCryptPasswordEncoder.encode(("" + graduados.getMatricula()));
                        masiveloadgraduatesservice.setUpdateUser(usuario_id, curp, pssEnc, graduados.getNombre(),
                                graduados.getAp_paterno(), graduados.getAp_materno(), graduados.getCorreo());

                        String genero=graduados.getGenero().trim().toUpperCase();
                        genero=genero.equals("MASCULINO")||genero.equals("HOMBRE")||genero.equals("H")?"H":"M";
                        String turno=graduados.getTurno().trim().toUpperCase();
                        turno=turno.equals("VESPERTINO")||turno.equals("V")?"TV":"TM";
                        masiveloadgraduatesservice.setUpdateStudent(usuario_id, graduados.getMatricula(), plantel_carrera_id, plantel_id,
                                carrera_id, genero, graduados.getGrupo(), turno, graduados.getGeneracion());
                    }

                    //////////si existe vemos si hay un alumno asociado y esta bien el plantel carrera

                    int plantel_carrera_id_t_alumno = 0;
                    plantel_carrera_id_t_alumno = masiveloadgraduatesservice.getPlantelCarreraIdDeAlumno(usuario_id);

                    //si encontro datos es que existe el alumno
                    if (plantel_carrera_id_t_alumno > 0) {
                        //si plantel_carrera_id es distinta a la lo que tiene el alumno entonces actualizamos
                        if (plantel_carrera_id != plantel_carrera_id_t_alumno) {
                            masiveloadgraduatesservice.updateAlumno(plantel_carrera_id, carrera_id, usuario_id);
                            procesados=procesados==0?1:1;
                        }
                    }//si no existe el alumno vamos por el alta
                    else {
                        //damos el alta de alumno
                        //validamos entreadas de genero y turno
                        String genero=graduados.getGenero().trim().toUpperCase();
                        genero=genero.equals("MASCULINO")||genero.equals("HOMBRE")||genero.equals("H")?"H":"M";
                        String turno=graduados.getTurno().trim().toUpperCase();
                        turno=turno.equals("VESPERTINO")||turno.equals("V")?"TV":"TM";

                        masiveloadgraduatesservice.putAlumno(usuario_id, graduados.getMatricula(), plantel_carrera_id, plantel_id,
                                carrera_id, genero, graduados.getGrupo(), turno, graduados.getGeneracion());

                        //insertamos en usuarios_roles
                        masiveloadgraduatesservice.putUsuariosRoles(usuario_id, rol_id);

                        //damos de alta en usuario_rol
                        masiveloadgraduatesservice.putUsuarioRol(usuario_id);
                        procesados=procesados==0?1:1;
                    }

                } else {
                    alumnos_con_error+=" |"+curp + ":Existen campos sin llenar| ";
                    total_con_error+=1;
                }
                total_procesados+=procesados;
            }

            return CustomResponseEntity.OK(
                    "{\"total_alumnos\":\""+total_alumnos+"\",\"total_procesados\":\""+total_procesados+"\",\"total_con_error\":\""+total_con_error+"\","+
                            "\"alumnos_con_error\":\""+alumnos_con_error+"\"}");
        } catch(Exception exception){
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }

    }

    @PostMapping("/insertGraduates")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> insertMasiveGraduate(@LoggedUser UserSession userSession,
                                                  @Valid @RequestBody MasiveLoadGraduates masiveLoadgraduates) {
        try {
            String masive = masiveloadgraduatesservice.insertMasiveGraduate(masiveLoadgraduates.getGraduadosAlumnos());
            return CustomResponseEntity.OK(masive);
        } catch (AppException exception) {
            MasiveGraduateLogger.insertMasiveGraduate(log, exception.getMessage(), userSession, masiveLoadgraduates.getGraduadosAlumnos());
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            MasiveGraduateLogger.insertMasiveGraduate(log, exception.toString(), userSession, masiveLoadgraduates.getGraduadosAlumnos());
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/scoreAddMasive")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> scoreAddMasive(@LoggedUser UserSession userSession, @Valid @RequestBody MasiveLoad masiveLoad) {
        try {
            String scoreMasive = masiveloadgraduatesservice.scoreAddMasive(masiveLoad.getCargaAlumnos());
            return CustomResponseEntity.OK(scoreMasive);
        } catch (AppException exception) {
            MasiveGraduateLogger.scoreAddMasive(log, exception.getMessage(), userSession, masiveLoad.getCargaAlumnos());
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            MasiveGraduateLogger.scoreAddMasive(log, exception.toString(), userSession, masiveLoad.getCargaAlumnos());
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/loadingDiciplinary")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> loadingMasiveDiciplinary(@LoggedUser UserSession userSession, @RequestBody List<MasiveDiciplinary> masiveDiciplinary) {
        try {
            List<MasiveDiciplinary> diciplinary = masiveloadgraduatesservice.loadingMasiveDiciplinary(masiveDiciplinary);
            return CustomResponseEntity.OK(diciplinary);
        } catch (AppException exception) {
            MasiveGraduateLogger.loadingMasiveDiciplinary(log, exception.getMessage(), userSession, masiveDiciplinary);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            MasiveGraduateLogger.loadingMasiveDiciplinary(log, exception.toString(), userSession, masiveDiciplinary);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/scoreAddMasiveNew")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> scoreAddMasiveNew(@LoggedUser UserSession userSession, @RequestBody List<MasiveContentScore> contentScore) {
        try {
            String scoreMasive = masiveloadgraduatesservice.scoreAddMasiveNew(contentScore);
            return CustomResponseEntity.OK(scoreMasive);
        } catch (AppException exception) {
            MasiveGraduateLogger.scoreAddMasiveNew(log, exception.getMessage(), userSession, contentScore);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            MasiveGraduateLogger.scoreAddMasiveNew(log, exception.toString(), userSession, contentScore);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
