package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.model.reports.ScholarEnrollmentReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScholarEnrollmentReportsRepository extends JpaRepository<ScholarEnrollmentReports, Integer> {

    @Query("SELECT ser " +
            "FROM ScholarEnrollmentReports ser " +
            "WHERE ser.plantelId = :plantelId " +
            "AND ser.cicloId = :cicloId " +
            "AND ser.matricula = :matricula " +
            "AND ser.carreraId = :carreraId ")
    List<ScholarEnrollmentReports> getByIds(Integer plantelId, String cicloId, String matricula, Integer carreraId);

    //actualiza  el reporte con las llaves plantel_id, ciclo_id, matricula, carrera_id
    @Modifying
    @Query("UPDATE ScholarEnrollmentReports s " +
            "set s.semestre = :semestre, s.turno = :turno, "+
            "s.num_grupos = :num_grupos, s.num_h = :num_h, s.num_m = :num_m " +
            "WHERE s.reportsId = :reportsId"
            )
    void updateScholarEnrollment( @Param("semestre")Integer semestre, @Param("turno") Integer turno,
                                  @Param("num_grupos")Integer num_grupos, @Param("num_h")Integer num_h, @Param("num_m")Integer num_m,
                                  @Param("reportsId")Integer reportsId);


}
