package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.CertifiedCertificado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertifiedReportRepository extends JpaRepository<CertifiedCertificado, Integer> {

    @Query(value="(SELECT COUNT(certificado.tipo_certificado_id) as total FROM certificado"+
            " INNER JOIN alumno on alumno.usuario_id=certificado.alumno_id "+
            "INNER JOIN plantel_carrera on plantel_carrera.id=alumno.plantel_carrera_id"+
            " INNER JOIN plantel on plantel.id=plantel_carrera.plantel_id"+
            " INNER JOIN cat_municipio on cat_municipio.id=plantel.municipio_id"+
            " INNER JOIN cat_estado on cat_estado.id=cat_municipio.estado_id"+
            " WHERE certificado.tipo_certificado_id= :type and certificado.estatus = 'CERTIFICADO' "+
            " AND cat_estado.id= :stateId AND alumno.generacion=:generation "+
            "GROUP BY cat_estado.nombre) UNION (SELECT 0) LIMIT 1;", nativeQuery=true)
    Integer getCountCertified(Integer stateId, String generation, Integer type);

    @Query(value = "(SELECT COUNT(certificado.tipo_certificado_id) as total FROM certificado" +
            " INNER JOIN alumno on alumno.usuario_id=certificado.alumno_id" +
            " INNER JOIN plantel_carrera on plantel_carrera.id=alumno.plantel_carrera_id" +
            " INNER JOIN plantel on plantel.id=plantel_carrera.plantel_id" +
            " INNER JOIN cat_municipio on cat_municipio.id=plantel.municipio_id" +
            " INNER JOIN cat_estado on cat_estado.id=cat_municipio.estado_id" +
            " WHERE certificado.tipo_certificado_id = :type and certificado.estatus = 'CERTIFICADO'" +
            "AND cat_estado.id = :stateId AND alumno.generacion= :generation AND plantel.id = :schoolId " +
            "GROUP BY plantel.nombre) UNION (SELECT 0) LIMIT 1;", nativeQuery = true)
    Integer getCountSchool(Integer stateId, Integer schoolId, String generation, Integer type);

    @Query(value = "SELECT CONCAT(plantel.cct, '-', plantel.nombre) as plantel, carrera.nombre as carrera, usuario.username as curp, alumno.matricula, usuario.nombre as alumno, usuario.primer_apellido, usuario.segundo_apellido, certificado.folio, cat_tipo_certificado.nombre as tipo_certificado, alumno.generacion, certificado.fechasep as timbrado, alumno.periodo_inicio as inicio, alumno.periodo_termino as termino FROM certificado, alumno, usuario, cat_tipo_certificado, plantel_carrera, plantel, carrera, cat_municipio WHERE certificado.tipo_certificado_id=cat_tipo_certificado.id AND certificado.alumno_id=alumno.usuario_id AND alumno.usuario_id=usuario.id AND alumno.plantel_carrera_id=plantel_carrera.id AND plantel_carrera.plantel_id=plantel.id AND plantel_carrera.carrera_id=carrera.id AND plantel.municipio_id=cat_municipio.id AND certificado.estatus='CERTIFICADO' AND alumno.generacion=:generation AND plantel.id=:schoolId", nativeQuery = true)
    List<Object[]> getCertifiedStudents(Integer schoolId, String generation);


    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.typeCertified = :type " +
            "AND certified.status='CERTIFICADO'")
    Integer countByTypeCertified(Integer type);

    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.typeCertified = :type " +
            "AND certified.student.schoolCareer.school.city.state.id= :stateId " +
            "AND certified.status = :status")
    Integer countByIdAndTypeCertifiedAndState(Integer type,Integer stateId,String status);

    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.typeCertified = :type " +
            "AND certified.student.schoolCareer.school.id = :schoolId " +
            "AND certified.status = :status")
    Integer countTypeCertifiedAndSchool(Integer type,Integer schoolId,String status);

    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.typeCertified = :type " +
            "AND certified.student.schoolCareer.school.id = :schoolId " +
            "AND certified.student.schoolCareer.school.city.state.id = :stateId " +
            "AND certified.status = :status")
    Integer countByStateAndSchool(Integer type,Integer schoolId, Integer stateId,String status);
    //por hombre y mujer
    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.student.schoolCareer.school.city.state.id = :stateId " +
            "AND certified.student.gender= :sexo "+
            "AND certified.status = :status")
    Integer countBySexoAndState(Integer stateId,String status,String sexo);

    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.student.schoolCareer.school.id = :schoolId " +
            "AND certified.student.schoolCareer.school.city.state.id = :stateId " +
            "AND certified.student.gender= :sexo "+
            "AND certified.status = :status")
    Integer countBySexoStateAndSchool(Integer schoolId, Integer stateId,String status,String sexo);

    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.student.schoolCareer.school.id = :schoolId " +
            "AND certified.student.gender= :sexo "+
            "AND certified.status = :status")
    Integer countBySexoAndSchool(Integer schoolId,String status,String sexo);

    @Query("SELECT COUNT(certified) " +
            "FROM CertifiedCertificado certified " +
            "WHERE certified.student.gender = :sexo "+
            "AND certified.status = :status")
    Integer countBySexo(String status,String sexo);

}
