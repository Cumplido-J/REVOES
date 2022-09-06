package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.model.reports.EducationLevelReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationLevelReportsRepository extends JpaRepository<EducationLevelReports, Integer> {

    @Query("SELECT ser " +
            "FROM EducationLevelReports ser " +
            "WHERE " +
            "ser.estado_id = :estadoId " +
            "AND ser.plantel_id = :plantel_id " +
            "AND ser.ciclo_id = :ciclo_id " +
            "AND ser.turno = :turno " +
            "AND ser.plaza = :plaza ")
    List<EducationLevelReports> getEducationLevel(Integer estadoId, Integer  plantel_id, Integer ciclo_id, String turno, String plaza);

    //actualiza  el reporte con las llaves reportid
    @Modifying
    @Query("UPDATE EducationLevelReports " +
            "set " +
            "doc_t_m = :doc_t_m, doc_ec_m = :doc_ec_m, doc_es_m = :doc_es_m, mia_t_m = :mia_t_m, mia_ec_m = :mia_ec_m, mia_es_m = :mia_es_m, "+
            "esp_t_m = :esp_t_m, esp_ec_m = :esp_ec_m, esp_es_m = :esp_es_m, lic_t_m = :lic_t_m, lic_ec_m = :lic_ec_m, lic_es_m = :lic_es_m, "+
            "sup_t_m = :sup_t_m, sup_ec_m = :sup_ec_m, sup_es_m = :sup_es_m, mto_t_m = :mto_t_m, mto_ec_m = :mto_ec_m, mto_es_m = :mto_es_m, "+
            "bac_t_m = :bac_t_m, bac_ec_m = :bac_ec_m, bac_es_m = :bac_es_m, tec_t_m = :tec_t_m, tec_ec_m = :tec_ec_m, tec_es_m = :tec_es_m, "+
            "com_t_m = :com_t_m, com_ec_m = :com_ec_m, com_es_m = :com_es_m, sec_t_m = :sec_t_m, sec_ec_m = :sec_ec_m, sec_es_m = :sec_es_m, "+
            "pia_t_m = :pia_t_m, pia_ec_m = :pia_ec_m, pia_es_m = :pia_es_m, doc_t = :doc_t, doc_ec = :doc_ec, doc_es = :doc_es, mia_t = :mia_t, "+
            "mia_ec = :mia_ec, mia_es = :mia_es, esp_t = :esp_t, esp_ec = :esp_ec, esp_es = :esp_es, lic_t = :lic_t, lic_ec = :lic_ec, "+
            "lic_es = :lic_es, sup_t = :sup_t, sup_ec = :sup_ec, sup_es = :sup_es, mto_t = :mto_t, mto_ec = :mto_ec, mto_es = :mto_es, "+
            "bac_t = :bac_t, bac_ec = :bac_ec, bac_es = :bac_es, tec_t = :tec_t, tec_ec = :tec_ec, tec_es = :tec_es, com_t = :com_t, "+
            "com_ec = :com_ec, com_es = :com_es, sec_t = :sec_t, sec_ec = :sec_ec, sec_es = :sec_es, pia_t = :pia_t, pia_ec = :pia_ec, pia_es = :pia_es "+
            "WHERE reportes_id = :reportsId"
            )
    void updateEducationLevelReports(@Param("doc_t_m")Integer doc_t_m,@Param("doc_ec_m")Integer doc_ec_m,@Param("doc_es_m")Integer doc_es_m,@Param("mia_t_m")Integer mia_t_m,
                                     @Param("mia_ec_m")Integer mia_ec_m,@Param("mia_es_m")Integer mia_es_m,@Param("esp_t_m")Integer esp_t_m,@Param("esp_ec_m")Integer esp_ec_m,
                                     @Param("esp_es_m")Integer esp_es_m,@Param("lic_t_m")Integer lic_t_m,@Param("lic_ec_m")Integer lic_ec_m,@Param("lic_es_m")Integer lic_es_m,
                                     @Param("sup_t_m")Integer sup_t_m,@Param("sup_ec_m")Integer sup_ec_m,@Param("sup_es_m")Integer sup_es_m,@Param("mto_t_m")Integer mto_t_m,
                                     @Param("mto_ec_m")Integer mto_ec_m,@Param("mto_es_m")Integer mto_es_m,@Param("bac_t_m")Integer bac_t_m,@Param("bac_ec_m")Integer bac_ec_m,
                                     @Param("bac_es_m")Integer bac_es_m,@Param("tec_t_m")Integer tec_t_m,@Param("tec_ec_m")Integer tec_ec_m,@Param("tec_es_m")Integer tec_es_m,
                                     @Param("com_t_m")Integer com_t_m,@Param("com_ec_m")Integer com_ec_m,@Param("com_es_m")Integer com_es_m,@Param("sec_t_m")Integer sec_t_m,
                                     @Param("sec_ec_m")Integer sec_ec_m,@Param("sec_es_m")Integer sec_es_m,@Param("pia_t_m")Integer pia_t_m,@Param("pia_ec_m")Integer pia_ec_m,
                                     @Param("pia_es_m")Integer pia_es_m,@Param("doc_t")Integer doc_t,@Param("doc_ec")Integer doc_ec,@Param("doc_es")Integer doc_es,
                                     @Param("mia_t")Integer mia_t,@Param("mia_ec")Integer mia_ec,@Param("mia_es")Integer mia_es,@Param("esp_t")Integer esp_t,@Param("esp_ec")Integer esp_ec,
                                     @Param("esp_es")Integer esp_es,@Param("lic_t")Integer lic_t,@Param("lic_ec")Integer lic_ec,@Param("lic_es")Integer lic_es,@Param("sup_t")Integer sup_t,
                                     @Param("sup_ec")Integer sup_ec,@Param("sup_es")Integer sup_es,@Param("mto_t")Integer mto_t,@Param("mto_ec")Integer mto_ec,@Param("mto_es")Integer mto_es,
                                     @Param("bac_t")Integer bac_t,@Param("bac_ec")Integer bac_ec,@Param("bac_es")Integer bac_es,@Param("tec_t")Integer tec_t,@Param("tec_ec")Integer tec_ec,
                                     @Param("tec_es")Integer tec_es,@Param("com_t")Integer com_t,@Param("com_ec")Integer com_ec,@Param("com_es")Integer com_es,@Param("sec_t")Integer sec_t,
                                     @Param("sec_ec")Integer sec_ec,@Param("sec_es")Integer sec_es,@Param("pia_t")Integer pia_t,@Param("pia_ec")Integer pia_ec,@Param("pia_es")Integer pia_es,
                                     @Param("reportsId")Integer reportsId);


}
