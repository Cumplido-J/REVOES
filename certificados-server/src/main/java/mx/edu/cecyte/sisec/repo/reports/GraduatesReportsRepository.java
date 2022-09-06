package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.model.reports.GraduatesReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GraduatesReportsRepository extends JpaRepository<GraduatesReports, Integer> {

    @Query("SELECT ser " +
            "FROM GraduatesReports ser " +
            "WHERE ser.plantelId = :plantelId " +
            "AND ser.cicloId = :cicloId " +
            "AND ser.matricula = :matricula " +
            "AND ser.carreraId = :carreraId ")
    List<GraduatesReports> getByIds(Integer plantelId, String cicloId, String matricula, Integer carreraId);

    //actualiza  el reporte con las llaves plantel_id, ciclo_id, matricula, carrera_id
    @Modifying
    @Query("UPDATE GraduatesReports s " +
            "set s.tit_h = :tit_h, s.tit_m = :tit_m, s.egr_h = :egr_h, s.egr_m = :egr_m " +
            "WHERE s.reportsId = :reportsId"
            )
    void updateGraduatesReports( @Param("tit_h")Integer tit_h, @Param("tit_m")Integer tit_m, @Param("egr_h")Integer egr_h, @Param("egr_m")Integer egr_m,
                                  @Param("reportsId")Integer reportsId);


}
