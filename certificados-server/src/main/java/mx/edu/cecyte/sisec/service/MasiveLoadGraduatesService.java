package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudent;
import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudentModule;
import mx.edu.cecyte.sisec.dto.masiveload.AlumnoCarga;
import mx.edu.cecyte.sisec.dto.masiveload.Competencia;
import mx.edu.cecyte.sisec.dto.masiveload.MasiveContentScore;
import mx.edu.cecyte.sisec.dto.masiveload.MasiveDiciplinary;
import mx.edu.cecyte.sisec.dto.masiveload.graduates.GraduadosCarga;
import mx.edu.cecyte.sisec.dto.student.StudentData;
import mx.edu.cecyte.sisec.dto.student.StudentFormatModule;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.catalogs.ConfigPeriodCertificate;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MasiveLoadGraduatesService {
    @Autowired
    private MasiveLoadGraduatesQueries masiveLoadGraduatesQueries;
    @Autowired
    private UserQueries userQueries;
    @Autowired
    private SchoolCareerQueries schoolCareerQueries;
    @Autowired
    private StudentQueries studentQueries;
    @Autowired
    private ModuleQueries moduleQueries;
    @Autowired
    private CatalogService catalogService;

    public Integer getRolId() {
        Integer rolId = 0;
        rolId += masiveLoadGraduatesQueries.getRolId();
        return rolId;
    }

    public Integer getPlantelCarreraId(String cct, String cve_carrera) {
        Integer plantelCarreraId = 0;
        plantelCarreraId += masiveLoadGraduatesQueries.getPlantelCarreraId(cct, cve_carrera);
        return plantelCarreraId;
    }

    @Transactional
    public void putPlantelCarrera(Integer carrera_id, Integer plantel_id) {
        masiveLoadGraduatesQueries.putPlantelCarrera(carrera_id, plantel_id);
    }

    public Integer getUsuarioId(String curp) {
        Integer usuarioId = 0;
        usuarioId += masiveLoadGraduatesQueries.getUsuarioId(curp);
        return usuarioId;
    }

    @Transactional
    public void putUsuario(String curp, String fecha, String pssEnc, String nombre, String ap_paterno, String ap_materno, String correo) {
        masiveLoadGraduatesQueries.putUsuario(curp, fecha, pssEnc, nombre, ap_paterno, ap_materno, correo);
    }

    public Integer getPlantelCarreraIdDeAlumno(Integer usuario_id) {
        Integer plantelCarreraIdDeAlumno = 0;
        plantelCarreraIdDeAlumno += masiveLoadGraduatesQueries.getPlantelCarreraIdDeAlumno(usuario_id);
        return plantelCarreraIdDeAlumno;
    }

    @Transactional
    public void putAlumno(Integer usuario_id, String matricula, Integer plantel_carrera_id, Integer plantel_id, Integer carrera_id, String genero, String grupo, String turno, String generacion) {
        masiveLoadGraduatesQueries.putAlumno(usuario_id, matricula, plantel_carrera_id, plantel_id, carrera_id, genero, grupo, turno, generacion);
    }

    @Transactional
    public void putUsuariosRoles(Integer usuario_id, Integer rol_id) {
        masiveLoadGraduatesQueries.putUsuariosRoles(usuario_id, rol_id);
    }

    @Transactional
    public void putUsuarioRol(Integer usuario_id) {

        masiveLoadGraduatesQueries.putUsuarioRol(usuario_id);
    }

    @Transactional
    public void updateAlumno(Integer plantel_carrera_id, Integer carrera_id, Integer usuario_id) {
        masiveLoadGraduatesQueries.updateAlumno(plantel_carrera_id, carrera_id, usuario_id);
    }

    public Integer getCarreraId(String cve_carrera) {
        Integer carreraId = 0;
        carreraId += masiveLoadGraduatesQueries.getCarreraId(cve_carrera);
        return carreraId;
    }

    public Integer getPlantelId(String cct) {
        Integer plantelId = 0;
        plantelId += masiveLoadGraduatesQueries.getPlantelId(cct);
        return plantelId;
    }


    @Transactional
    public void setUpdateStudent(Integer usuario_id, String matricula, Integer plantel_carrera_id, Integer plantel_id, Integer carrera_id, String genero, String grupo, String turno, String generacion) {
        masiveLoadGraduatesQueries.setUpdateStudent(usuario_id, matricula, plantel_carrera_id, plantel_id, carrera_id, genero, grupo, turno, generacion);
    }

    @Transactional
    public void setUpdateUser(Integer usuario_id, String curp, String pssEnc, String nombre, String ap_paterno, String ap_materno, String correo) {
        masiveLoadGraduatesQueries.setUpdateUser(usuario_id, curp, pssEnc, nombre, ap_paterno, ap_materno, correo);
    }

    @Transactional
    public String insertMasiveGraduate(ArrayList<GraduadosCarga> graduadosAlumnos) {
        String cct = graduadosAlumnos.stream().map(s -> s.getCct()).findFirst().get();
        //System.out.println(cct);
        String alumnos_con_error = "";
        Integer total_alumnos = 0, total_procesados = 0, total_con_error = 0, total_actualizados = 0, total_agregados = 0;
        for (GraduadosCarga graduados : graduadosAlumnos) {
            String genero = graduados.getGenero().trim().toUpperCase();
            genero = genero.equals("MASCULINO") || genero.equals("HOMBRE") || genero.equals("H") ? "H" : "M";
            String turno = graduados.getTurno().trim().toUpperCase();
            turno = turno.equals("VESPERTINO") || turno.equals("V") ? "TV" : "TM";

            User user = new User();
            SchoolCareer school = schoolCareerQueries.findByCctAndClaveCareer(graduados.getCct(), graduados.getCve_carrera());
            if (school != null) {
                Boolean isvalid = userQueries.usernameExists(graduados.getCurp());
                if (isvalid) user = userQueries.getUserByUsername(graduados.getCurp());
                if (isvalid) {
                    //System.out.println("Update alumno");
                    Student student = studentQueries.getStudentById(user.getId());
                    StudentData studentData = new StudentData(graduados.getCurp(), graduados.getNombre(),
                            graduados.getAp_paterno(), graduados.getAp_materno(), graduados.getCorreo(),
                            graduados.getMatricula(), school.getSchool().getCity().getState().getId(),
                            school.getSchool().getId(), school.getCareer().getId(), graduados.getGeneracion(),
                            null, null, student.getStatus(), student.getIsPortability(),
                            student.getPartialCertificate(), student.getAbrogadoCertificate(), school.getSchool().getStatus()
                    );
                    student = studentQueries.editStudent(student, studentData);
                    if (student.getUser().getId() > 0) {
                        masiveLoadGraduatesQueries.editStudentFantante(student.getUser().getId(), school.getSchool().getId(), school.getCareer().getId(), genero, graduados.getGrupo(), turno);
                    }
                    total_procesados++;
                    total_actualizados++;

                } else {
                    //System.out.println("Insert Alumno");
                    Student student = new Student();
                    StudentData studentData = new StudentData(graduados.getCurp(), graduados.getNombre(),
                            graduados.getAp_paterno(), graduados.getAp_materno(), graduados.getCorreo(),
                            graduados.getMatricula(), school.getSchool().getCity().getState().getId(),
                            school.getSchool().getId(), school.getCareer().getId(), graduados.getGeneracion(),
                            null, null, true, false, false,
                            null, school.getSchool().getStatus()
                    );
                    student = studentQueries.addNewStudent(studentData);
                    if (student.getUser().getId() > 0) {
                        masiveLoadGraduatesQueries.editStudentFantante(student.getUser().getId(), school.getSchool().getId(), school.getCareer().getId(), genero, graduados.getGrupo(), turno);
                    }
                    total_procesados++;
                    total_agregados++;
                }
            } else {
                alumnos_con_error = "La cct " + graduados.getCct() + " y la clave de carrera " + graduados.getCve_carrera() + " no tiene relación.";
            }
            total_alumnos++;
        }
        return "{\"total_alumnos\":\"" + total_alumnos +
                "\",\"total_procesados\":\"" + total_procesados +
                "\",\"total_de_agergados\":\"" + total_agregados +
                "\",\"total_de_actualizados\":\"" + total_actualizados +
                "\",\"total_con_error\":\"" + total_con_error +
                "\",\"alumnos_con_error\":\"" + alumnos_con_error + "\"}";
    }

    @Transactional
    public String scoreAddMasive(ArrayList<AlumnoCarga> cargaAlumnos) {
        Integer total_alumnos = cargaAlumnos.size(), total_procesados = 0, total_con_error = 0, total_actualizados = 0, total_agregados = 0;
        for (AlumnoCarga alumnoCarga : cargaAlumnos) {
            User user = new User();
            SchoolCareer school = schoolCareerQueries.findByCctAndClaveCareer(alumnoCarga.getCct(), alumnoCarga.getClave_carrera());
            if (school != null) {
                Boolean isvalid = userQueries.usernameExists(alumnoCarga.getCurp());
                if (isvalid) user = userQueries.getUserByUsername(alumnoCarga.getCurp());
                if (isvalid) {
                    Student student = studentQueries.getStudentById(user.getId());
                    List<StudentFormatModule> modules = studentQueries.getCarrerModule(school.getCareer().getId());

                    CertificateEditStudent datos = new CertificateEditStudent();
                    datos.setCurp(student.getUser().getUsername());
                    datos.setName(user.getName());
                    datos.setFirstLastName(user.getFirstLastName());
                    datos.setSecondLastName(user.getSecondLastName());
                    datos.setSchoolName(school.getSchool().getName());
                    datos.setCareerName(school.getCareer().getName());
                    datos.setEnrollmentStartDate(student.getEnrollmentStartDate());
                    datos.setEnrollmentEndDate(student.getEnrollmentEndDate());
                    datos.setFinalScore(alumnoCarga.getPromedio());
                    datos.setIsPortability(0);
                    datos.setIsPortability(0);
                    datos.setDisciplinaryCompetence(school.getCareer().getDisciplinaryField().getId());
                    List<CertificateEditStudentModule> certificateEditStudentModules = new ArrayList<>();
                    certificateEditStudentModules = cicloModules(alumnoCarga.getCompetencias(), modules);
                    certificateEditStudentModules.forEach(r -> {
                        System.out.println("=+> " + r.getName() + "-->" + r.getScore());
                    });
                    datos.setModules(certificateEditStudentModules);

                    if (modules.size() == alumnoCarga.getCompetencias().size()) {
                        int i = 0;
                        for (StudentFormatModule module : modules) {
                            int j = 0;
                            String calf = "";
                            for (Competencia comp : alumnoCarga.getCompetencias()) {
                                if (j == i) calf = comp.getCalificacion().toString();
                                //System.out.println("=> "+calf);
                                j++;
                            }
                            Integer total = moduleQueries.countStudentCareerModule(student.getUser().getId(), module.getCareerModuleId());
                            if (total == 1 || total != null || total != 0) {
                                System.out.println("Actualizando: ");
                                //setUpdateScore(alumnoCarga.getCompetencias(), modules, student);
                                //student = studentQueries.editStudentModules(student, datos);

                                //setUpdateScore(alumnoCarga.getCompetencias(), modules, student);
                                //actualizarModulos(datos.getModules(), student);
                                /*-------------------------------*/
                               /* int j = 0; String calf = "";
                                for (Competencia comp : alumnoCarga.getCompetencias()) {
                                    if (j==i) calf = comp.getCalificacion().toString();
                                    //System.out.println("=> "+calf);
                                    j++;
                                }*/
                                System.out.println(student.getUser().getId() + "---" + module.getCareerModuleId() + "---" + calf);

                                masiveLoadGraduatesQueries.editStudentCareerCompetencia(student.getUser().getId(), module.getCareerModuleId(), Double.parseDouble(calf));

                                System.out.println(module.getModule() + " => " + calf);
                                System.out.println(module.getCareerModuleId());
                                StudentCareerModule studentCareerModule = new StudentCareerModule();

                                StudentCareerModule scm = new StudentCareerModule();
                                boolean isValid = moduleQueries.countStudentCareerModule(student.getUser().getId(), module.getCareerModuleId()) > 0;
                                if (isValid)
                                    scm = moduleQueries.selectStudentCareerModule(student.getUser().getId(), module.getCareerModuleId());
                                if (isValid) {
                                    //System.out.println("Update Student Career Module ");
                                    studentCareerModule.setId(scm.getId());
                                    studentCareerModule.setStudent(student);
                                    studentCareerModule.setScore(Double.parseDouble(calf));
                                    CareerModule careerModule = new CareerModule();
                                    careerModule.setId(module.getCareerModuleId());
                                    System.out.println("cC" + scm.getCareerModule().getId());
                                    studentCareerModule.setCareerModule(careerModule);
                                    masiveLoadGraduatesQueries.scoreAddMasiveUpdate(studentCareerModule);
                                }

                                /*-------------------------------*/

                            } else {
                                System.out.println("Delete and update");
                                List<StudentCareerModule> lista = moduleQueries.selectStudentCareerModule(student.getUser().getId());
                                moduleQueries.deleteScm(lista);
                                List<StudentFormatModule> modulos = studentQueries.getCarrerModule(school.getCareer().getId());
                                moduleQueries.addStudentCareerModule(modulos, student);
                                total = moduleQueries.countStudentCareerModule(student.getUser().getId(), module.getCareerModuleId());
                                System.out.println("Total: " + total);
                                if (total == 1 || total != null || total != 0) {
                                    setUpdateScore(alumnoCarga.getCompetencias(), modules, student);
                                    //student = studentQueries.editStudentModules(student, datos);
                                    /*int j = 0; String calf = "";
                                    for (Competencia comp : alumnoCarga.getCompetencias()) {
                                        if (j==i) calf = comp.getCalificacion().toString();
                                        //System.out.println("=> "+calf);
                                        j++;
                                    }*/
                                    System.out.println(student.getUser().getId() + "---" + module.getCareerModuleId() + "---" + calf);
                                    masiveLoadGraduatesQueries.editStudentCareerCompetencia(student.getUser().getId(), module.getCareerModuleId(), Double.parseDouble(calf));

                                    System.out.println(module.getModule() + " => " + calf);
                                    StudentCareerModule studentCareerModule = new StudentCareerModule();

                                    StudentCareerModule scm = new StudentCareerModule();
                                    boolean isValid = moduleQueries.countStudentCareerModule(student.getUser().getId(), module.getCareerModuleId()) > 0;
                                    if (isValid)
                                        scm = moduleQueries.selectStudentCareerModule(student.getUser().getId(), module.getCareerModuleId());
                                    if (isValid) {
                                        //System.out.println("Update Student Career Module ");
                                        studentCareerModule.setId(scm.getId());
                                        studentCareerModule.setStudent(student);
                                        studentCareerModule.setScore(Double.parseDouble(calf));
                                        CareerModule careerModule = new CareerModule();
                                        careerModule.setId(module.getCareerModuleId());
                                        studentCareerModule.setCareerModule(careerModule);
                                        masiveLoadGraduatesQueries.scoreAddMasiveUpdate(studentCareerModule);
                                        //masiveLoadGraduatesQueries.editStudentCareerCompetencia(student.getUser().getId(), module.getCareerModuleId(), Double.parseDouble(calf));

                                    }

                                }
                            }
                            i++;
                            masiveLoadGraduatesQueries.editStudentCareerCompetencia(student.getUser().getId(), module.getCareerModuleId(), Double.parseDouble(calf));

                        }

                        student = studentQueries.editStudentModules(student, datos);


                    } else {
                        throw new AppException("Las competencias no coinciden");
                    }

                    ///AtomicReference<Integer> total_modIng = new AtomicReference<>(0);
                    //AtomicReference<Integer> total_modAct = new AtomicReference<>(0);
                    /*modules.forEach(r -> {
                        String name = AppFunctions.emptyCharacterSpecial(r.getModule().trim());
                        Catalog modulo = alumnoCarga.getCompetencias().stream().filter(fil -> name.equals(fil.getCompetencia())).map(m -> new Catalog(null, m.getCompetencia(), m.getCalificacion().toString())).findFirst().get();
                        if (modulo != null) {
                            System.out.println(student.getUser().getId() + "  " + r.getId());
                            StudentCareerModule scm = new StudentCareerModule();
                            boolean isValid = moduleQueries.countStudentCareerModule(student.getUser().getId(), r.getCareerModuleId()) > 0;
                            if (isValid)
                                scm = moduleQueries.selectStudentCareerModule(student.getUser().getId(), r.getCareerModuleId());
                            if (isValid) {
                                System.out.println("Update Student Career Module ");
                                StudentCareerModule studentCareerModule = new StudentCareerModule();
                                studentCareerModule.setId(scm.getId());
                                studentCareerModule.setStudent(student);
                                studentCareerModule.setScore(Double.valueOf(modulo.getDescription2()));
                                CareerModule careerModule = new CareerModule();
                                careerModule.setId(r.getCareerModuleId());
                                studentCareerModule.setCareerModule(careerModule);
                                masiveLoadGraduatesQueries.scoreAddMasiveUpdate(studentCareerModule);
                                total_modAct.getAndSet(total_modAct.get() + 1);
                            } else {
                                System.out.println("Insert Student Career Module ");
                                CareerModule careerModule = new CareerModule();
                                careerModule.setId(r.getCareerModuleId());
                                StudentCareerModule studentCareerModule = new StudentCareerModule(student, careerModule, Double.valueOf(modulo.getDescription2()));
                                masiveLoadGraduatesQueries.scoreAddMasiveInsert(studentCareerModule);
                                total_modIng.getAndSet(total_modIng.get() + 1);
                            }
                        } else {
                            throw new AppException("Los módulos no coinciden.");
                        }
                    });*/
                    boolean isExistPeriod = masiveLoadGraduatesQueries.isExitPerios(Integer.parseInt(alumnoCarga.getEntidad()), alumnoCarga.getGeneracion());
                    if (isExistPeriod) {
                        ConfigPeriodCertificate periodCertificate = masiveLoadGraduatesQueries.selectPeriodCertificate(Integer.parseInt(alumnoCarga.getEntidad()), alumnoCarga.getGeneracion());
                        student.setEnrollmentStartDate(periodCertificate.getDateStart());
                        if (alumnoCarga.getFechaTermino() != null && alumnoCarga.getFechaTermino() != "")
                            student.setEnrollmentEndDate(AppFunctions.parsetStringToDate(alumnoCarga.getFechaTermino()));
                    }
                    student.setGeneration(alumnoCarga.getGeneracion());
                    student.setFinalScore(alumnoCarga.getPromedio());
                    student.setReprobate(reprobado(alumnoCarga));
                    student.setIsPortability(false);
                    student.setPartialCertificate(false);
                    student.setAbrogadoCertificate(false);
                    student.setDisciplinaryField(school.getCareer().getDisciplinaryField());
                    student.editPeriodCertificate(student);

                    masiveLoadGraduatesQueries.saveStudent(student);

                    /*total_actualizados = total_modAct.get() > 0 ? total_actualizados + 1 : 0;
                    total_agregados = total_modIng.get() > 0 ? total_agregados + 1 : 0;*/
                } else {
                    throw new AppException("La CURP: " + alumnoCarga.getCurp() + " es invalido o no existe.");
                }
            } else {
                throw new AppException("El plantel no esta asociada con la carrera");
            }
            total_procesados++;
        }
        System.out.println("Total alumno: " + total_alumnos);
        System.out.println("Total procesado: " + total_procesados);
        System.out.println("Total actualizados: " + total_actualizados);
        System.out.println("Total Ingresados: " + total_agregados);
        return "{\"total_alumnos\":\"" + total_alumnos +
                "\",\"total_procesados\":\"" + total_procesados + "\"}";
    }

    private void actualizarModulos(List<CertificateEditStudentModule> modules, Student student) {
        for (CertificateEditStudentModule module : modules) {
            StudentCareerModule studentCareerModule = new StudentCareerModule();
            studentCareerModule.setId(module.getId());
            studentCareerModule.setStudent(student);
            studentCareerModule.setScore(module.getScore());
            CareerModule careerModule = new CareerModule();
            careerModule.setId(module.getId());
            studentCareerModule.setCareerModule(careerModule);
            masiveLoadGraduatesQueries.scoreAddMasiveUpdate(studentCareerModule);
        }

    }

    private List<CertificateEditStudentModule> cicloModules(ArrayList<Competencia> competencias, List<StudentFormatModule> modules) {
        List<CertificateEditStudentModule> certificate = new ArrayList<>();
        int i = 0;
        for (StudentFormatModule module : modules) {
            int j = 0;
            String calf = "";
            for (Competencia comp : competencias) {
                if (j == i) calf = comp.getCalificacion().toString();
                //System.out.println("=> "+calf);
                j++;
            }
            System.out.println(module.getModule() + " => " + calf);

            i++;
            certificate.add(new CertificateEditStudentModule(module.getId(), module.getModule(), Double.parseDouble(calf), module.getOrder()));
        }
        return certificate;
    }

    private void setUpdateScore(ArrayList<Competencia> competencias, List<StudentFormatModule> modules, Student student) {
       /* modules.forEach(r -> {
            String name = AppFunctions.emptyCharacterSpecial(r.getModule().trim());
            Catalog modulo = competencias.stream().filter(fil -> name.equals(fil.getCompetencia())).map(m -> new Catalog(null, m.getCompetencia(), m.getCalificacion().toString())).findFirst().get();
            if (modulo != null) {
                //System.out.println(student.getUser().getId() + "  " + r.getId());
                StudentCareerModule scm = new StudentCareerModule();
                boolean isValid = moduleQueries.countStudentCareerModule(student.getUser().getId(), r.getCareerModuleId()) > 0;
                if (isValid)
                    scm = moduleQueries.selectStudentCareerModule(student.getUser().getId(), r.getCareerModuleId());
                if (isValid) {
                    //System.out.println("Update Student Career Module ");
                    StudentCareerModule studentCareerModule = new StudentCareerModule();
                    studentCareerModule.setId(scm.getId());
                    studentCareerModule.setStudent(student);
                    studentCareerModule.setScore(Double.valueOf(modulo.getDescription2()));
                    CareerModule careerModule = new CareerModule();
                    careerModule.setId(r.getCareerModuleId());
                    studentCareerModule.setCareerModule(careerModule);
                    masiveLoadGraduatesQueries.scoreAddMasiveUpdate(studentCareerModule);
                }

            }
        });*/

        int i = 0;
        for (StudentFormatModule module : modules) {
            int j = 0;
            String calf = "";
            for (Competencia comp : competencias) {
                if (j == i) calf = comp.getCalificacion().toString();
                //System.out.println("=> "+calf);
                j++;
            }
            System.out.println(module.getModule() + " => " + calf);
            StudentCareerModule scm = new StudentCareerModule();
            boolean isValid = moduleQueries.countStudentCareerModule(student.getUser().getId(), module.getCareerModuleId()) > 0;
            if (isValid)
                scm = moduleQueries.selectStudentCareerModule(student.getUser().getId(), module.getCareerModuleId());
            if (isValid) {
                //System.out.println("Update Student Career Module ");
                StudentCareerModule studentCareerModule = new StudentCareerModule();
                studentCareerModule.setId(scm.getId());
                studentCareerModule.setStudent(student);
                studentCareerModule.setScore(Double.parseDouble(calf));
                CareerModule careerModule = new CareerModule();
                careerModule.setId(module.getCareerModuleId());
                studentCareerModule.setCareerModule(careerModule);
                masiveLoadGraduatesQueries.scoreAddMasiveUpdate(studentCareerModule);
            }
            i++;
        }

    }

    private Boolean reprobado(AlumnoCarga a) {
        Boolean reprobado = false;
        if (a.getPromedio() < 6.0) {
            reprobado = true;
        } else {
            for (Competencia c : a.getCompetencias()) {
                if (c.getCalificacion() < 6.0) {
                    reprobado = true;
                }
            }
        }
        return reprobado;
    }

    public List<MasiveDiciplinary> loadingMasiveDiciplinary(List<MasiveDiciplinary> masiveDiciplinary) {
        System.out.println("Count: " + masiveDiciplinary.size());

        Integer total_alumnos = masiveDiciplinary.size(), total_procesados = 0, total_con_error = 0;
        String curpError = "";
        for (MasiveDiciplinary diciplinary : masiveDiciplinary) {
            User user = new User();
            Boolean isvalid = userQueries.usernameExists(diciplinary.getCurp());
            if (isvalid) user = userQueries.getUserByUsername(diciplinary.getCurp());
            if (isvalid) {
                Student student = studentQueries.getStudentById(user.getId());
                CatDisciplinaryField disciplinaryField = new CatDisciplinaryField();
                if (masiveLoadGraduatesQueries.isExistDiciplinary(diciplinary.getDisciplinaryId())) {
                    disciplinaryField = masiveLoadGraduatesQueries.selectWhereId(diciplinary.getDisciplinaryId());
                    student.setDisciplinaryField(disciplinaryField);
                    masiveLoadGraduatesQueries.saveStudent(student);
                    System.out.println(disciplinaryField.getName());
                    total_procesados++;
                    System.out.println(total_procesados + " .- " + disciplinaryField.getId() + " => " + diciplinary.getCurp() + " => " + disciplinaryField.getName() + " => " + student.getEnrollmentKey());
                } else {
                    total_con_error++;
                    curpError = curpError + diciplinary.getCurp() + ", ";
                    //masiveDiciplinary.add(new MasiveDiciplinary(diciplinary.getStateId(), diciplinary.getSchoolId(), diciplinary.getCareerId(), diciplinary.getGeneration(), diciplinary.getCurp(), diciplinary.getDisciplinaryId()));
                    //throw new AppException("El campo diciplinar de "+diciplinary.getCurp()+" es incorrecto.");
                }
                //System.out.println(" => "+ diciplinary.getCurp() + " => " + diciplinary.getDiciplinaryId() + " => " + student.getEnrollmentKey());

            } else {
                throw new AppException("La curp " + diciplinary.getCurp() + " no exíste.");
            }

        }
        System.out.println("SiZE: " + total_alumnos + ", total procesado: " + total_procesados);
        System.out.println("totalErrores: " + total_con_error + ". " + curpError);
        return masiveDiciplinary;
    }

    @Transactional
    public String scoreAddMasiveNew(List<MasiveContentScore> contentScore) {
        Integer totalAlumno = contentScore.size(), totalProcesado = 0;
        for (MasiveContentScore row : contentScore) {
            User user = new User();
            SchoolCareer school = schoolCareerQueries.findByCctAndClaveCareer(row.getCct(), row.getClave_carrera());
            if (school != null) {
                Boolean isvalid = userQueries.usernameExists(row.getCurp());
                System.out.println("");
                if (isvalid) user = userQueries.getUserByUsername(row.getCurp());
                if (isvalid) {
                    Student student = studentQueries.getStudentById(user.getId());
                    List<StudentFormatModule> modules = studentQueries.getCarrerModule(school.getCareer().getId());
                    System.out.println("MOD: " + student.getStudentCareerModules().size() + " === " + school.getCareer().getId() +"--"+row.getCompetencias().size());
                    if (student.getStudentCareerModules().size() == row.getCompetencias().size()) {
                         //settingModulesIsValid(row.getCompetencias(), modules, student);
                        //System.out.println(settingIsValid);
                    }
                    Integer isNum = moduleQueries.countStudentCareerModuleByStudentId(student.getUser().getId());

                    if (isNum > row.getCompetencias().size()){
                        masiveLoadGraduatesQueries.deleteStudentCareerModules(student.getUser().getId());
                        List<StudentFormatModule> modulos = studentQueries.getCarrerModule(student.getSchoolCareer().getCareer().getId());
                        moduleQueries.addStudentCareerModule(modulos, student);
                    }
                    System.out.println("--->: "+isNum);
                    if (isNum == null || isNum.equals("")) {
                        System.out.println("-insert-");
                        List<StudentFormatModule> modulos = studentQueries.getCarrerModule(student.getSchoolCareer().getCareer().getId());
                         setModuleScore(modulos, student);
                    }
                    System.out.println("----"+student.getUser().getUsername());
                    List<CertificateEditStudentModule> setting = settingModules(row.getCompetencias(), modules, student);
                    CertificateEditStudent datos = new CertificateEditStudent(student.getUser().getUsername(), user.getName(), user.getFirstLastName(), user.getSecondLastName(), student.getEnrollmentStartDate(), student.getEnrollmentEndDate(), row.getPromedio(), school.getCareer().getName(), school.getSchool().getPdfFinalName(), null, setting, 0, 0, school.getCareer().getDisciplinaryField().getId());
                    studentQueries.editStudentModules(student, datos);
                    totalProcesado++;
                    boolean isExistPeriod = masiveLoadGraduatesQueries.isExitPerios(Integer.parseInt(row.getEntidad()), row.getGeneracion());
                    if (isExistPeriod) {
                        ConfigPeriodCertificate periodCertificate = masiveLoadGraduatesQueries.selectPeriodCertificate(Integer.parseInt(row.getEntidad()), row.getGeneracion());
                        student.setEnrollmentStartDate(periodCertificate.getDateStart());
                        if (row.getFechaTermino() != null && row.getFechaTermino() != "")
                            student.setEnrollmentEndDate(AppFunctions.parsetStringToDate(row.getFechaTermino()));
                    }
                    student.setGeneration(row.getGeneracion());
                    student.editPeriodCertificate(student);

                    masiveLoadGraduatesQueries.saveStudent(student);
                }
            }
        }
        return "{\"total_alumnos\":\"" + totalAlumno +
                "\",\"total_procesados\":\"" + totalProcesado + "\"}";
    }

    private void setModuleScore(List<StudentFormatModule> modules, Student student) {
        moduleQueries.addStudentCareerModule(modules, student);
    }

    private List<CertificateEditStudentModule> settingModules(List<Competencia> competencias, List<StudentFormatModule> modules, Student student) {
        //Student student1 = studentQueries.getStudentById(student.getUser().getId());
        CertificateEditStudent datos = studentQueries.getStudentModules(student);
        datos.getModules().forEach(r->{});
        List<CertificateEditStudentModule> score = new ArrayList<>();
        int i = 0;
        //if (student.getStudentCareerModules().size() == competencias.size()) {
            for (StudentFormatModule module : modules) {
                int j = 0;
                String calf = "";
                for (Competencia comp : competencias) {
                    if (j == i) calf = comp.getCalificacion().toString();
                    j++;
                }
                System.out.println("COM_: " + module.getModule());
                StudentCareerModule scm = new StudentCareerModule();
                boolean isValid = moduleQueries.countStudentCareerModule(student.getUser().getId(), module.getCareerModuleId()) > 0;
                if (isValid) {
                    scm = moduleQueries.selectStudentCareerModule(student.getUser().getId(), module.getCareerModuleId());
                    score.add(new CertificateEditStudentModule(scm.getId(), scm.getCareerModule().getModule().getModule(), Double.parseDouble(calf), module.getOrder()));
                    System.out.println("Di: " + scm.getId() + " " + module.getModule() + " => " + calf + "---" + student.getUser().getUsername());
                }/*else {
                    System.out.println("Di: " + null + " " + module.getModule() + " => " + calf + "---" + student.getUser().getUsername());
                    score.add(new CertificateEditStudentModule(null, module.getModule(), Double.parseDouble(calf), module.getOrder()));
                }*/
                i++;
            }
        /*} else if (student.getStudentCareerModules().size() == 0){

            student.getSchoolCareer().getCareer().getCareerModules().forEach(row->{
                System.out.println(row.getModule().getModule());
            });
        }*/
        return score;
    }

}
