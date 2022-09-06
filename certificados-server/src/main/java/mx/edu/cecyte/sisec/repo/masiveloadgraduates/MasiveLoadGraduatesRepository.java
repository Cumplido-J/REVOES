package mx.edu.cecyte.sisec.repo.masiveloadgraduates;

import mx.edu.cecyte.sisec.dto.masiveload.graduates.ObtieneId;
import mx.edu.cecyte.sisec.model.users.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MasiveLoadGraduatesRepository extends JpaRepository<UserRole, Integer> {

    @Query(value="SELECT id FROM sisec.roles WHERE " +
            "name='ROLE_ALUMNO'", nativeQuery = true
    )
    List<ObtieneId> getRolId();


    @Query(value="SELECT pc.id FROM sisec.plantel_carrera pc, sisec.carrera c, sisec.plantel p  " +
            "WHERE " +
            "p.cct=:cct AND  " +
            "c.clave_carrera=:cve_carrera AND " +
            "pc.carrera_id=c.id AND  " +
            "pc.plantel_id=p.id", nativeQuery = true
    )
    List<ObtieneId> getPlantelCarreraId(@Param("cct")String cct, @Param("cve_carrera")String cve_carrera);

    @Modifying
    @Query(value="INSERT INTO sisec.plantel_carrera (carrera_id, plantel_id) " +
            "VALUES " +
            "(:carrera_id,:plantel_id)", nativeQuery = true
    )
    void putPlantelCarrera(@Param("carrera_id")Integer carrera_id, @Param("plantel_id")Integer plantel_id);


    @Query(value="SELECT id FROM sisec.usuario  " +
            "WHERE " +
            "username=:curp", nativeQuery = true
    )
    List<ObtieneId> getUsuarioId(@Param("curp")String curp);

    @Modifying
    @Query(value="INSERT INTO sisec.usuario (username, fecha_insert, password, nombre, primer_apellido, segundo_apellido, email) " +
            "VALUES " +
            "(:curp,:fecha,:pssEnc,:nombre,:ap_paterno,:ap_materno,:correo)", nativeQuery = true
    )
    void putUsuario(@Param("curp")String curp,@Param("fecha")String fecha,@Param("pssEnc")String pssEnc,
                    @Param("nombre")String nombre,@Param("ap_paterno")String ap_paterno,
                    @Param("ap_materno")String ap_materno,@Param("correo")String correo);



    @Query(value="SELECT plantel_carrera_id as id FROM alumno " +
            "WHERE " +
            "usuario_id=:usuario_id", nativeQuery = true
    )
    List<ObtieneId> getPlantelCarreraIdDeAlumno(@Param("usuario_id")Integer usuario_id);

    @Modifying
    @Query(value="INSERT INTO sisec.alumno (usuario_id,matricula,periodo_inicio,periodo_termino,generacion,calificacion,creditos_obtenidos,reprobado,es_bach_tec,semestre,aviso_privacidad_aceptado, " +
            "alumno_estatus,plantel_carrera_id,plantel_id,carrera_id,certificado_parcial,genero,numero_contacto,numero_movil,direccion,codigo_postal,cambio_subsistema, " +
            "cambio_carrera,estatus,estatus_inscripcion,permitir_inscripcion,tipo_alumno,tipo_trayectoria,grupo,turno,abrogado,competencia_disciplinar,ruta_fotografia) " +
            "VALUES (" +
            ":usuario_id, " +
            ":matricula, " +
            "null,null, " +
            ":generacion, " +
            "null,null,0,0,6,0,1, " +
            ":plantel_carrera_id, " +
            ":plantel_id, " +
            ":carrera_id, " +
            "0, " +
            ":genero, " +
            "null,null,null,null,0,0,'Documentos completos','Egresado','No permitir','Regular','Regular', " +
            ":grupo, " +
            ":turno, " +
            "null,null,null)", nativeQuery = true
    )
    void putAlumno(@Param("usuario_id")Integer usuario_id,@Param("matricula")String matricula,@Param("plantel_carrera_id")Integer plantel_carrera_id,
                   @Param("plantel_id")Integer plantel_id,@Param("carrera_id")Integer carrera_id,@Param("genero")String genero,
                   @Param("grupo")String grupo,@Param("turno")String turno,@Param("generacion")String generacion);

    @Modifying
    @Query(value="INSERT INTO sisec.usuarios_roles (model_id,role_id,model_type) " +
            "VALUES " +
            "(:usuario_id,:rol_id,'App\\Usuario')", nativeQuery = true
    )
    void putUsuariosRoles(@Param("usuario_id")Integer usuario_id,@Param("rol_id")Integer rol_id);


    @Modifying
    @Query(value="INSERT INTO sisec.usuario_rol (usuario_id,rol_id) " +
            "VALUES " +
            "(:usuario_id,3)", nativeQuery = true
    )
    void putUsuarioRol(@Param("usuario_id")Integer usuario_id);


    @Modifying
    @Query(value="UPDATE sisec.alumno " +
            "SET " +
            "plantel_carrera_id=:plantel_carrera_id, " +
            "carrera_id=:carrera_id " +
            "WHERE " +
            "usuario_id=:usuario_id", nativeQuery = true
    )
    void updateAlumno(@Param("plantel_carrera_id")Integer plantel_carrera_id,@Param("carrera_id")Integer carrera_id,@Param("usuario_id")Integer usuario_id);


    @Query(value="SELECT id FROM sisec.carrera  WHERE " +
            "clave_carrera=:cve_carrera", nativeQuery = true
    )
    List<ObtieneId> getCarreraId(@Param("cve_carrera")String cve_carrera);


    @Query(value="SELECT id FROM sisec.plantel  WHERE " +
            "cct=:cct", nativeQuery = true
    )
    List<ObtieneId> getPlantelId(@Param("cct")String cct);

    @Modifying
    @Query(value="UPDATE sisec.alumno SET "+
            "usuario_id=:usuario_id, " +
            "matricula=:matricula, " +
            "periodo_inicio=null, periodo_termino=null, " +
            "generacion=:generacion, " +
            "calificacion=null, creditos_obtenidos=null, reprobado=0, " +
            "es_bach_tec=0, semestre=6, aviso_privacidad_aceptado=0, " +
            "alumno_estatus=1, " +
            "plantel_carrera_id=:plantel_carrera_id, " +
            "plantel_id=:plantel_id, " +
            "carrera_id=:carrera_id, " +
            "certificado_parcial=0, " +
            "genero=:genero, " +
            "numero_contacto=null, numero_movil=null, direccion=null, codigo_postal=null, " +
            "cambio_subsistema=0, cambio_carrera=0,estatus='Documentos completos', estatus_inscripcion='Egresado', " +
            "permitir_inscripcion='No permitir', tipo_alumno='Regular', tipo_trayectoria='Regular', " +
            "grupo=:grupo, " +
            "turno=:turno, " +
            "abrogado=null, competencia_disciplinar=null, ruta_fotografia=null WHERE usuario_id=:usuario_id", nativeQuery = true
    )
    void setUpdateStudent(@Param("usuario_id")Integer usuario_id,@Param("matricula")String matricula,@Param("plantel_carrera_id")Integer plantel_carrera_id,
                          @Param("plantel_id")Integer plantel_id,@Param("carrera_id")Integer carrera_id,@Param("genero")String genero,
                          @Param("grupo")String grupo,@Param("turno")String turno,@Param("generacion")String generacion);


   @Modifying
    @Query(value="UPDATE sisec.usuario " +
            "SET " +
            "username=:username, " +
            "password=:pssEnc, " +
            "nombre=:nombre, " +
            "primer_apellido=:ap_paterno," +
            "segundo_apellido=:ap_materno, " +
            "email=:correo " +
            "WHERE id=:id", nativeQuery = true
    )
    void setUpdateUser(@Param("id") Integer id, @Param("username") String username, @Param("pssEnc") String pssEnc,
                       @Param("nombre") String nombre, @Param("ap_paterno") String ap_paterno,
                       @Param("ap_materno")String ap_materno,@Param("correo")String correo);

   @Query("SELECT COUNT(*) FROM UserRole ur WHERE ur.user.id=:userId")
    Integer countRoleUser(Integer userId);

   @Query("SELECT ur FROM UserRole ur WHERE ur.user.id=:userId")
    UserRole findUserRoleUserId(Integer userId);

   @Modifying
   @Query(value="UPDATE sisec.usuario_rol " +
           "SET " +
           "usuario_id=:usuario_id, " +
           "rol_id=:rol_id " +
           "WHERE id=:id", nativeQuery = true)
    void updateUserRole(@Param("id") Integer id, @Param("usuario_id") Integer usuario_id, @Param("rol_id") Integer rol_id);

    @Modifying
    @Query(value="UPDATE sisec.alumno " +
            "SET " +
            "plantel_id=:plantel_id, carrera_id=:carrera_id, " +
            "alumno_estatus=1, " +
            "genero=:genero, " +
            "grupo=:grupo, " +
            "turno=:turno " +
            "WHERE usuario_id=:usuario_id ", nativeQuery = true
    )
    void editStudentFantante(@Param("usuario_id") Integer usuario_id, @Param("plantel_id") Integer plantel_id, @Param("carrera_id") Integer carrera_id, @Param("genero") String genero, @Param("grupo") String grupo, @Param("turno") String turno);

    @Modifying
    @Query(value="DELETE FROM alumno_carrera_competencia " +
            "WHERE alumno_id=:alumno_id ", nativeQuery = true)
    void  deleteStudentCareerModules(@Param("alumno_id") Integer alumno_id);

    @Modifying
    @Query(value="UPDATE sisec.alumno_carrera_competencia " +
            "SET " +
            "calificacion=:calificacion " +
            "WHERE carrera_competencia_id=:carrera_competencia_id AND alumno_id=:alumno_id ", nativeQuery = true
    )
    void editStudentCareerCompetencia(@Param("calificacion") Double calificacion, @Param("carrera_competencia_id") Integer carrera_competencia_id, @Param("alumno_id") Integer alumno_id);

    @Modifying
    @Query(value="UPDATE sisec.alumno_carrera_competencia " +
            "SET " +
            "calificacion=0 " +
            "WHERE  alumno_id=:alumno_id ", nativeQuery = true
    )
    void editStudentCareerCompetenciaScore(@Param("alumno_id") Integer alumno_id );
}
