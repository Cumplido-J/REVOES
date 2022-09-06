package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudentModule;
import mx.edu.cecyte.sisec.dto.masiveload.Competencia;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.catalogs.ConfigPeriodCertificate;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.repo.StudentCareerModuleRepository;
import mx.edu.cecyte.sisec.repo.catalogs.ConfigPeriodCertificateRepository;
import mx.edu.cecyte.sisec.repo.catalogs.DiciplinaryRepository;
import mx.edu.cecyte.sisec.repo.masiveloadgraduates.MasiveLoadGraduatesRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRepository;
import mx.edu.cecyte.sisec.repo.users.UserRepository;
import mx.edu.cecyte.sisec.repo.users.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import mx.edu.cecyte.sisec.dto.masiveload.graduates.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MasiveLoadGraduatesQueries {

    @Autowired private MasiveLoadGraduatesRepository masiveLoadGraduatesRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserRoleRepository userRoleRepository;
    @Autowired private StudentCareerModuleRepository studentCareerModuleRepository;
    @Autowired private ConfigPeriodCertificateRepository configPeriodCertificateRepository;
    @Autowired private DiciplinaryRepository diciplinaryRepository;

    public Integer getRolId() {
        List<ObtieneId> id=null;
        id=masiveLoadGraduatesRepository.getRolId();
        Integer elId=0;
        if(id!=null && !id.isEmpty())
        {
            elId=id.get(0).getId();
        }
        return elId;
    }

    public Integer getPlantelCarreraId(String cct, String cve_carrera) {
        List<ObtieneId> id=null;
        id=masiveLoadGraduatesRepository.getPlantelCarreraId(cct, cve_carrera);
        Integer elId=0;
        if(id!=null && !id.isEmpty())
        {
            elId=id.get(0).getId();
        }
        return elId;
    }

    public void putPlantelCarrera(Integer carrera_id, Integer plantel_id) {
        masiveLoadGraduatesRepository.putPlantelCarrera(carrera_id,plantel_id);
    }

    public Integer getUsuarioId(String curp) {
        List<ObtieneId> id=null;
        id=masiveLoadGraduatesRepository.getUsuarioId(curp);
        Integer elId=0;
        if(id!=null && !id.isEmpty())
        {
            elId=id.get(0).getId();
        }
        return elId;
    }

    public void putUsuario(String curp, String fecha, String pssEnc, String nombre, String ap_paterno, String ap_materno, String correo) {
        masiveLoadGraduatesRepository.putUsuario(curp,fecha,pssEnc,nombre,ap_paterno,ap_materno,correo);
    }

    public Integer getPlantelCarreraIdDeAlumno(Integer usuario_id) {
        List<ObtieneId> id=null;
        id=masiveLoadGraduatesRepository.getPlantelCarreraIdDeAlumno(usuario_id);
        Integer elId=0;
        if(id!=null && !id.isEmpty())
        {
            elId=id.get(0).getId();
        }
        return elId;
    }

    public void putAlumno(Integer usuario_id, String matricula, Integer plantel_carrera_id, Integer plantel_id, Integer carrera_id, String genero, String grupo, String turno, String generacion) {
        masiveLoadGraduatesRepository.putAlumno(usuario_id,matricula,plantel_carrera_id,plantel_id,carrera_id,genero,grupo,turno,generacion);
    }

    public void putUsuariosRoles(Integer usuario_id, Integer rol_id) {
        masiveLoadGraduatesRepository.putUsuariosRoles(usuario_id,rol_id);
    }

    public void putUsuarioRol(Integer usuario_id) {
        masiveLoadGraduatesRepository.putUsuarioRol(usuario_id);
    }

    public void updateAlumno(Integer plantel_carrera_id, Integer carrera_id, Integer usuario_id) {
        masiveLoadGraduatesRepository.updateAlumno(plantel_carrera_id,carrera_id,usuario_id);
    }

    public Integer getCarreraId(String cve_carrera) {
        List<ObtieneId> id=null;
        id=masiveLoadGraduatesRepository.getCarreraId(cve_carrera);
        Integer elId=0;
        if(id!=null && !id.isEmpty())
        {
            elId=id.get(0).getId();
        }
        return elId;
    }

    public Integer getPlantelId(String cct) {
        List<ObtieneId> id=null;
        id=masiveLoadGraduatesRepository.getPlantelId(cct);
        Integer elId=0;
        if(id!=null && !id.isEmpty())
        {
            elId=id.get(0).getId();
        }
        return elId;
    }

    public Student getStudentById(Integer usuario_id) {
        return studentRepository.findAll().stream().filter(s->s.getUser().getId().equals(usuario_id)).findFirst().get();
    }


    public void setUpdateStudent(Integer usuario_id, String matricula, Integer plantel_carrera_id, Integer plantel_id, Integer carrera_id, String genero, String grupo, String turno, String generacion) {
        masiveLoadGraduatesRepository.setUpdateStudent(usuario_id,matricula,plantel_carrera_id,plantel_id,carrera_id,genero,grupo,turno,generacion);
        boolean isExistUserRole = masiveLoadGraduatesRepository.countRoleUser(usuario_id) > 0;
        UserRole userRole = new UserRole();
        if (isExistUserRole) {
            userRole = masiveLoadGraduatesRepository.findUserRoleUserId(usuario_id);
            masiveLoadGraduatesRepository.updateUserRole(userRole.getId(), userRole.getUser().getId(), userRole.getRole().getId());
        } else {
            masiveLoadGraduatesRepository.putUsuarioRol(usuario_id);
        }

    }

    public void setUpdateUser(Integer usuario_id, String curp, String pssEnc, String nombre, String ap_paterno, String ap_materno, String correo) {
        masiveLoadGraduatesRepository.setUpdateUser(usuario_id, curp,pssEnc,nombre,ap_paterno,ap_materno,correo);
    }

    public void editStudentFantante(Integer usuario_id, Integer plantel_id, Integer carrera_id, String genero, String grupo, String turno) {
        masiveLoadGraduatesRepository.editStudentFantante(usuario_id, plantel_id, carrera_id, genero, grupo, turno);
    }

    public void scoreAddMasiveUpdate(StudentCareerModule studentCareerModule) {
        studentCareerModuleRepository.save(studentCareerModule);
    }

    public void scoreAddMasiveInsert(StudentCareerModule studentCareerModule) {
        studentCareerModuleRepository.save(studentCareerModule);
    }

    public boolean isExitPerios(Integer stateId, String generation) {
        return configPeriodCertificateRepository.isExistStateAndGeneration(stateId, generation) > 0;
    }

    public ConfigPeriodCertificate selectPeriodCertificate(Integer stateId, String generation) {
        return configPeriodCertificateRepository.selectPeriodFinished(stateId, generation);
    }

    public void saveStudent(Student student){
        studentRepository.save(student);
    }

    public boolean isExistDiciplinary(Integer diciplinaryId) {
        return diciplinaryRepository.isExistDiciplinary(diciplinaryId) > 0;
    }
    public CatDisciplinaryField selectWhereId(Integer diciplinaryId) {
        return diciplinaryRepository.selectWhereId(diciplinaryId);
    }
    @Transactional
    public void deleteStudentCareerModules(Integer studentId) {
        masiveLoadGraduatesRepository.deleteStudentCareerModules(studentId);
    }
    //@Transactional
    public void editStudentCareerCompetencia(Integer studentId, Integer moduleid, Double score) {
        masiveLoadGraduatesRepository.editStudentCareerCompetencia(score, moduleid, studentId);
    }

    public void editStudentCareerCompetenciaScore(Integer studentId) {
        masiveLoadGraduatesRepository.editStudentCareerCompetenciaScore(studentId);
    }

}
