package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.dto.reports.EducationLevelSchoolReports;
import mx.edu.cecyte.sisec.dto.reports.EducationLevelSchoolsReports;
import mx.edu.cecyte.sisec.dto.reports.EducationLevelStateReports;
import mx.edu.cecyte.sisec.model.reports.EducationLevelReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationLevelStateReportsRepository extends JpaRepository<EducationLevelReports, Integer> {

    //busca por estados la cantidad de planteles y su formacion
    @Query(value="select e.nombre entidad, e.id idEntidad, count(DISTINCT p.cct) num_plantel, " +
            "SUM(rme.doc_t_m + rme.doc_ec_m + rme.doc_es_m + rme.doc_t + rme.doc_ec + rme.doc_es) sumDoc, " +
            "SUM(rme.mia_t_m + rme.mia_ec_m + rme.mia_es_m + rme.mia_t + rme.mia_ec + rme.mia_es) sumMia, " +
            "SUM(rme.esp_t_m + rme.esp_ec_m + rme.esp_es_m + rme.esp_t + rme.esp_ec + rme.esp_es) sumEsp, " +
            "SUM(rme.lic_t_m + rme.lic_ec_m + rme.lic_es_m + rme.lic_t + rme.lic_ec + rme.lic_es) sumLic, " +
            "SUM(rme.sup_t_m + rme.sup_ec_m + rme.sup_es_m + rme.sup_t + rme.sup_ec + rme.sup_es) sumSup, " +
            "SUM(rme.mto_t_m + rme.mto_ec_m + rme.mto_es_m + rme.mto_t + rme.mto_ec + rme.mto_es) sumMto, " +
            "SUM(rme.bac_t_m + rme.bac_ec_m + rme.bac_es_m + rme.bac_t + rme.bac_ec + rme.bac_es) sumBac, " +
            "SUM(rme.tec_t_m + rme.tec_ec_m + rme.tec_es_m + rme.tec_t + rme.tec_ec + rme.tec_es) sumTec, " +
            "SUM(rme.com_t_m + rme.com_ec_m + rme.com_es_m + rme.com_t + rme.com_ec + rme.com_es) sumCom, " +
            "SUM(rme.sec_t_m + rme.sec_ec_m + rme.sec_es_m + rme.sec_t + rme.sec_ec + rme.sec_es) sumSec, " +
            "SUM(rme.pia_t_m + rme.pia_ec_m + rme.pia_es_m + rme.pia_t + rme.pia_ec + rme.pia_es) sumPia  " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.reportes_nivel_estudios rme " +
            "WHERE p.id=rme.plantel_id  " +
            "AND m.id=p.municipio_id  " +
            "AND e.id=m.estado_id  " +
            "AND p.estatus=1 " +
            "AND rme.ciclo_id= :cicloId " +
            "GROUP BY e.nombre, e.id;", nativeQuery = true
    )
    List<EducationLevelStateReports> educationLevelByState(@Param("cicloId")Integer cicloId);

    //busca planteles
    @Query(value="SELECT rme.reportes_id as IdReporte, p.nombre plantel, p.cct, rme.turno, rme.plaza, c.nombre ciclo," +
            "rme.doc_t_m,rme.doc_ec_m,rme.doc_es_m,rme.mia_t_m,rme.mia_ec_m,rme.mia_es_m,rme.esp_t_m,rme.esp_ec_m,rme.esp_es_m,rme.lic_t_m," +
            "rme.lic_ec_m,rme.lic_es_m,rme.sup_t_m,rme.sup_ec_m,rme.sup_es_m,rme.mto_t_m,rme.mto_ec_m,rme.mto_es_m,rme.bac_t_m,rme.bac_ec_m," +
            "rme.bac_es_m,rme.tec_t_m,rme.tec_ec_m,rme.tec_es_m,rme.com_t_m,rme.com_ec_m,rme.com_es_m,rme.sec_t_m,rme.sec_ec_m,rme.sec_es_m," +
            "rme.pia_t_m,rme.pia_ec_m,rme.pia_es_m,rme.doc_t,rme.doc_ec,rme.doc_es,rme.mia_t,rme.mia_ec,rme.mia_es,rme.esp_t,rme.esp_ec,rme.esp_es," +
            "rme.lic_t,rme.lic_ec,rme.lic_es,rme.sup_t,rme.sup_ec,rme.sup_es,rme.mto_t,rme.mto_ec,rme.mto_es,rme.bac_t,rme.bac_ec,rme.bac_es," +
            "rme.tec_t,rme.tec_ec,rme.tec_es,rme.com_t,rme.com_ec,rme.com_es,rme.sec_t,rme.sec_ec,rme.sec_es,rme.pia_t,rme.pia_ec,rme.pia_es " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.ciclo_escolar c, sisec.reportes_nivel_estudios rme " +
            "WHERE " +
            "p.id=rme.plantel_id " +
            "AND m.id=p.municipio_id " +
            "AND e.id=m.estado_id " +
            "AND c.id=rme.ciclo_id " +
            "AND p.estatus=1 " +
            "AND rme.ciclo_id= :cicloId AND rme.plantel_id= :plantel_id " +
            "ORDER BY rme.reportes_id", nativeQuery = true
    )
    List<EducationLevelSchoolReports> educationLevelByStateSchool(@Param("cicloId")Integer cicloId, @Param("plantel_id")Integer plantel_id);

    //busca para agrupar por planteles va previa a la anterior
    @Query(value="SELECT rme.plantel_id, p.nombre plantel, p.cct, c.nombre ciclo, " +
            "SUM(rme.doc_t_m+rme.doc_ec_m+rme.doc_es_m) doc_m, SUM(rme.doc_t+rme.doc_ec+rme.doc_es) doc_h, SUM(rme.mia_t_m+rme.mia_ec_m+rme.mia_es_m) mia_m, SUM(rme.mia_t+rme.mia_ec+rme.mia_es) mia_h, " +
            "SUM(rme.esp_t_m+rme.esp_ec_m+rme.esp_es_m) esp_m, SUM(rme.esp_t+rme.esp_ec+rme.esp_es) esp_h, SUM(rme.lic_t_m+rme.lic_ec_m+rme.lic_es_m) lic_m, SUM(rme.lic_t+rme.lic_ec+rme.lic_es) lic_h, " +
            "SUM(rme.sup_t_m+rme.sup_ec_m+rme.sup_es_m) sup_m, SUM(rme.sup_t+rme.sup_ec+rme.sup_es) sup_h, SUM(rme.mto_t_m+rme.mto_ec_m+rme.mto_es_m) mto_m, SUM(rme.mto_t+rme.mto_ec+rme.mto_es) mto_h, " +
            "SUM(rme.bac_t_m+rme.bac_ec_m+rme.bac_es_m) bac_m, SUM(rme.bac_t+rme.bac_ec+rme.bac_es) bac_h, SUM(rme.tec_t_m+rme.tec_ec_m+rme.tec_es_m) tec_m, SUM(rme.tec_t+rme.tec_ec+rme.tec_es) tec_h, " +
            "SUM(rme.com_t_m+rme.com_ec_m+rme.com_es_m) com_m, SUM(rme.com_t+rme.com_ec+rme.com_es) com_h, SUM(rme.sec_t_m+rme.sec_ec_m+rme.sec_es_m) sec_m, SUM(rme.sec_t+rme.sec_ec+rme.sec_es) sec_h, " +
            "SUM(rme.pia_t_m+rme.pia_ec_m+rme.pia_es_m) pia_m, SUM(rme.pia_t+rme.pia_ec+rme.pia_es) pia_h  " +
            "FROM sisec.cat_estado e, sisec.cat_municipio m, sisec.plantel p, sisec.ciclo_escolar c, sisec.reportes_nivel_estudios rme " +
            "WHERE " +
            "m.id=p.municipio_id " +
            "AND e.id=m.estado_id " +
            "AND c.id=rme.ciclo_id " +
            "AND p.estatus=1 " +
            "AND rme.ciclo_id=:cicloId AND m.estado_id=:estado_id AND p.id=rme.plantel_id " +
            "GROUP BY rme.plantel_id", nativeQuery = true
    )
    List<EducationLevelSchoolsReports> educationLevelByStateSchools(@Param("cicloId")Integer cicloId, @Param("estado_id")Integer estado_id);
}
