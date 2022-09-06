package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.dto.reports.GraduatesSchoolCareerReports;
import mx.edu.cecyte.sisec.dto.reports.GraduatesSchoolReports;
import mx.edu.cecyte.sisec.dto.reports.GraduatesStateReports;
import mx.edu.cecyte.sisec.model.reports.GraduatesReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GraduatesStateReportsRepository extends JpaRepository<GraduatesReports, Integer> {

    //busca por estados la cantidad de planteles y su matricula para planteles para EMS y ETC
    @Query(value="select e.nombre entidad, e.id idEntidad, count(DISTINCT p.cct) num_plantel, SUM(rme.tit_h + rme.tit_m) titulados, SUM(rme.egr_h + rme.egr_m) egresados " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.reportes_reg_egr_tit rme " +
            "WHERE p.id=rme.plantel_id " +
            "AND m.id=p.municipio_id " +
            "AND e.id=m.estado_id " +
            "AND p.cct like %:tipoPlantel% " +
            "AND rme.ciclo_id= :cicloId AND rme.matricula= :matricula " +
            "GROUP BY e.nombre, e.id", nativeQuery = true
    )
    List<GraduatesStateReports> graduatesByState(@Param("tipoPlantel")String tipoPlantel,
                                                                  @Param("cicloId")Integer cicloId, @Param("matricula")Integer matricula);

    //busca planteles
    @Query(value="SELECT p.id, p.nombre, SUM(rme.tit_h + rme.tit_m) suma_titulados, SUM(rme.egr_h + rme.egr_m) suma_egresados " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.reportes_reg_egr_tit rme  " +
            "WHERE " +
            "p.id=rme.plantel_id " +
            "AND m.id=p.municipio_id " +
            "AND e.id=m.estado_id " +
            "AND p.cct like %:tipoPlantel% " +
            "AND rme.ciclo_id= :cicloId AND rme.matricula= :matricula AND m.estado_id= :estado " +
            "GROUP BY p.id", nativeQuery = true
    )
    List<GraduatesSchoolReports> graduatesByStateSchool(@Param("tipoPlantel")String tipoPlantel,
                                                                          @Param("cicloId")Integer cicloId, @Param("matricula")Integer matricula, @Param("estado")Integer estado);

    //busca carrera
    @Query(value="SELECT rme.egr_tit_id as id, c.nombre nombre, rme.tit_h, rme.tit_m ,rme.egr_h, rme.egr_m, " +
            "CASE " +
            "  WHEN rme.matricula =1 THEN 'Inicio' " +
            "  WHEN rme.matricula =2 THEN 'Fin' " +
            "END as matricula, (rme.tit_h+rme.egr_h) as suma_h, (rme.tit_m+rme.egr_m) as suma_m " +
            "FROM sisec.plantel p, sisec.reportes_reg_egr_tit rme, sisec.carrera c " +
            "WHERE " +
            "p.id=rme.plantel_id " +
            "AND c.id=rme.carrera_id " +
            "AND rme.ciclo_id= :cicloId AND rme.matricula= :matricula AND rme.plantel_id= :plantelId " +
            "ORDER BY rme.egr_tit_id", nativeQuery = true
    )
    List<GraduatesSchoolCareerReports> graduatesByStateSchoolCareer(@Param("cicloId")Integer cicloId,
                                                                    @Param("matricula")Integer matricula, @Param("plantelId")Integer plantelId);
}
