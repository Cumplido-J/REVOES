package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.dto.reports.GraduatesSchoolReports;
import mx.edu.cecyte.sisec.dto.reports.ScholarCareerReports;
import mx.edu.cecyte.sisec.dto.reports.ScholarSchoolReports;
import mx.edu.cecyte.sisec.dto.reports.ScholarStateReports;
import mx.edu.cecyte.sisec.model.reports.ScholarEnrollmentReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateEnrollmentReportsRepository extends JpaRepository<ScholarEnrollmentReports, Integer> {

    //busca por estados la cantidad de planteles
    @Query(value="select e.nombre entidad, e.id idEntidad, count(DISTINCT p.cct) num_plantel, SUM(rme.num_h + rme.num_m) matricula " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.reportes_matr_escolar rme " +
            "WHERE p.id=rme.plantel_id " +
            "AND m.id=p.municipio_id " +
            "AND e.id=m.estado_id " +
            "AND p.cct like %:tipoPlantel% " +
            "AND rme.ciclo_id= :cicloId AND rme.matricula= :matricula " +
            "GROUP BY e.nombre, e.id", nativeQuery = true
    )
    List<ScholarStateReports> reportsETCEMSByState( @Param("tipoPlantel")String tipoPlantel,
                                                    @Param("cicloId")Integer cicloId,@Param("matricula")Integer matricula);

    //busca los planteles por estado
    @Query(value="SELECT p.id, p.nombre, SUM(rme.num_grupos) num_grupos, SUM(rme.num_h) num_h, SUM(rme.num_m) num_m  " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.reportes_matr_escolar rme " +
            "WHERE " +
            "p.id=rme.plantel_id " +
            "AND m.id=p.municipio_id " +
            "AND e.id=m.estado_id " +
            "AND p.cct like %:tipoPlantel% " +
            "AND rme.ciclo_id= :cicloId AND rme.matricula= :matricula AND m.estado_id= :estado " +
            "GROUP BY p.id", nativeQuery = true
    )
    List<ScholarSchoolReports> reportsEnrollmentBySchools(@Param("tipoPlantel")String tipoPlantel,
                                                          @Param("cicloId")Integer cicloId, @Param("matricula")Integer matricula, @Param("estado")Integer estado);

    //busca carreras
    @Query(value="SELECT rme.reportes_id id, c.nombre, rme.num_grupos, rme.semestre ,rme.num_h, rme.num_m, " +
            " CASE " +
            "  WHEN rme.turno =1 THEN 'Matutino' " +
            "  WHEN rme.turno =2 THEN 'Vespertino' " +
            " END as turno " +
            " FROM sisec.reportes_matr_escolar rme, sisec.carrera c " +
            " WHERE " +
            " c.id = rme.carrera_id " +
            " AND rme.ciclo_id= :cicloId AND rme.matricula= :matricula AND rme.plantel_id= :plantel" +
            " ORDER BY rme.reportes_id", nativeQuery = true
    )
    List<ScholarCareerReports> reportsEnrollmentByCareer(@Param("cicloId")Integer cicloId, @Param("matricula")Integer matricula, @Param("plantel")Integer plantel);
}
