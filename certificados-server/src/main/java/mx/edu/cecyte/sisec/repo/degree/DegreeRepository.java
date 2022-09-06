package mx.edu.cecyte.sisec.repo.degree;

import mx.edu.cecyte.sisec.dto.certified.CertifiedReportStudent;
import mx.edu.cecyte.sisec.model.met.Degree;
import mx.edu.cecyte.sisec.model.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DegreeRepository extends JpaRepository<Degree, Integer> {
    @Query("SELECT degree " +
            "FROM Degree degree " +
            "WHERE degree.fileName IN :fileNames")
    List<Degree> findAllByFileName(List<String> fileNames);

    @Query("SELECT degree " +
            "FROM Degree degree " +
            "WHERE degree.fileName = :fileName " +
            "AND degree.status = :status")
    Optional<Degree> findInProcessByFileName(String fileName, String status);

    @Query("SELECT degree " +
            "FROM Degree degree " +
            "WHERE degree.student.user.username = :username " +
            "AND degree.status = :status")
    Optional<Degree> findByUsernameAndStatus(String username, String status);

    @Query("SELECT degree " +
            "FROM Degree degree " +
            "WHERE degree.student.user.username IN :usernames " +
            "AND degree.status = :status")
    List<Degree> findListByStatusAndUsername(List<String> usernames, String status);

    Optional<Degree> findByFolio(String folioNumber);

    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree " +
            "WHERE degree.student.schoolCareer.school.city.state.id = :stateId " +
            "AND degree.status = :status")
    Integer countInProcessByStateId(Integer stateId, String status);

    @Query("SELECT degree " +
            "FROM Degree degree " +
            "WHERE degree.student.schoolCareer.school.city.state.id = :stateId " +
            "AND degree.status = :status")
    List<Degree> findInProcessByStateId(Integer stateId, String status);

    Optional<Degree> getByStudentAndStatus(Student student, String status);

    @Query("SELECT degree FROM Degree degree WHERE degree.folio = :folio")
    Degree findByFolioDegree(String folio);

    @Query("SELECT COUNT(*) FROM Degree degree WHERE degree.folio = :folio")
    Integer countFolio(String folio);

    //dashboard//unicamente por genro
    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree  " +
            "WHERE degree.student.gender= :sexo "+
            "AND degree.status = :status")
    Integer countBySexo(String status,String sexo);
    //por genro y por estado
    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree  " +
            "WHERE degree.student.schoolCareer.school.city.state.id = :stateId " +
            "AND degree.student.gender= :sexo "+
            "AND degree.status = :status")
    Integer countBySexoAndStateId(String status,String sexo,Integer stateId);
    //por genro, por estado y por plantel
    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree  " +
            "WHERE degree.student.schoolCareer.school.city.state.id = :stateId " +
            "AND degree.student.schoolCareer.school.id = :schoolId " +
            "AND degree.student.gender= :sexo "+
            "AND degree.status = :status")
    Integer countBySexoAndStateIdAndSchoolId(String status,String sexo,Integer stateId,Integer schoolId);
    //por genero y por plantel id
    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree  " +
            "WHERE degree.student.schoolCareer.school.id = :schoolId " +
            "AND degree.student.gender= :sexo "+
            "AND degree.status = :status")
    Integer countBySexoAndStateIdAndSchoolId(String status,String sexo,Integer schoolId);

    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree  " +
            "WHERE degree.student.generation = :generation " +
            "AND degree.student.schoolCareer.school.city.state.id = :stateId " +
            "AND degree.status='TITULADO' " +
            "AND degree.typeStamp = 'P' ")
    Integer degreeeCountCountry(Integer stateId, String generation);


    @Query("SELECT COUNT(degree) " +
            "FROM Degree degree  " +
            "WHERE degree.student.generation = :generation " +
            "AND degree.student.schoolCareer.school.city.state.id = :stateId " +
            "AND degree.student.schoolCareer.school.id = :schoolId " +
            "AND degree.status = 'TITULADO' " +
            "AND degree.typeStamp = 'P' ")
    Integer degreeCountSchool(Integer stateId, Integer schoolId, String generation);

    @Query(value = "SELECT CONCAT(cat_titulo_instituciones.cve_institucion,'-',cat_titulo_instituciones.nombre_institucion) as schoolName, CONCAT(cat_titulo_carrera_dgp.cve_carrera,'-',cat_titulo_carrera_dgp.carrera_dgp) as careerName, usuario.username as curp, alumno.matricula as enrollmentKey, usuario.nombre as name, usuario.primer_apellido as firstLastName, usuario.segundo_apellido as secondLastName, titulo.folio as folioNumber, titulo.estado_timbrado as typeCertified, alumno.generacion as generation, titulo.fechasep as timbrado, alumno.periodo_inicio as inicio, alumno.periodo_termino as termino FROM titulo_datos, alumno, usuario, cat_titulo_dgp, cat_titulo_instituciones, cat_titulo_carrera_dgp, titulo \n" +
            "WHERE titulo_datos.alumno_id=alumno.usuario_id AND alumno.usuario_id=usuario.id AND titulo_datos.carrera_id=cat_titulo_dgp.id AND cat_titulo_dgp.institucion_id=cat_titulo_instituciones.id AND cat_titulo_dgp.carrera_id=cat_titulo_carrera_dgp.id AND titulo.alumno_id=alumno.usuario_id AND titulo.estatus='TITULADO' AND titulo.estado_timbrado='P' AND alumno.generacion=:generation AND cat_titulo_instituciones.plantel_id=:schoolId ", nativeQuery = true)
    List<Object[]> degreeSchoolReport(Integer schoolId, String generation);
}
