package mx.edu.cecyte.sisec.model.reports;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "reportes_nivel_estudios")
public class EducationLevelReports {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="reportes_id") private Integer reportes_id;
    @Column(name = "plantel_id") private int plantel_id;
    @Column(name = "ciclo_id") private int ciclo_id;
    @Column(name = "estado_id") private int estado_id;
    @Column(name = "turno") private String turno;
    @Column(name = "plaza") private String plaza;

    @Column(name = "doc_t_m") private int doc_t_m;
    @Column(name = "doc_ec_m") private int doc_ec_m;
    @Column(name = "doc_es_m") private int doc_es_m;
    @Column(name = "mia_t_m") private int mia_t_m;
    @Column(name = "mia_ec_m") private int mia_ec_m;
    @Column(name = "mia_es_m") private int mia_es_m;
    @Column(name = "esp_t_m") private int esp_t_m;
    @Column(name = "esp_ec_m") private int esp_ec_m;
    @Column(name = "esp_es_m") private int esp_es_m;
    @Column(name = "lic_t_m") private int lic_t_m;
    @Column(name = "lic_ec_m") private int lic_ec_m;
    @Column(name = "lic_es_m") private int lic_es_m;
    @Column(name = "sup_t_m") private int sup_t_m;
    @Column(name = "sup_ec_m") private int sup_ec_m;
    @Column(name = "sup_es_m") private int sup_es_m;
    @Column(name = "mto_t_m") private int mto_t_m;
    @Column(name = "mto_ec_m") private int mto_ec_m;
    @Column(name = "mto_es_m") private int mto_es_m;
    @Column(name = "bac_t_m") private int bac_t_m;
    @Column(name = "bac_ec_m") private int bac_ec_m;
    @Column(name = "bac_es_m") private int bac_es_m;
    @Column(name = "tec_t_m") private int tec_t_m;
    @Column(name = "tec_ec_m") private int tec_ec_m;
    @Column(name = "tec_es_m") private int tec_es_m;
    @Column(name = "com_t_m") private int com_t_m;
    @Column(name = "com_ec_m") private int com_ec_m;
    @Column(name = "com_es_m") private int com_es_m;
    @Column(name = "sec_t_m") private int sec_t_m;
    @Column(name = "sec_ec_m") private int sec_ec_m;
    @Column(name = "sec_es_m") private int sec_es_m;
    @Column(name = "pia_t_m") private int pia_t_m;
    @Column(name = "pia_ec_m") private int pia_ec_m;
    @Column(name = "pia_es_m") private int pia_es_m;
    @Column(name = "doc_t") private int doc_t;
    @Column(name = "doc_ec") private int doc_ec;
    @Column(name = "doc_es") private int doc_es;
    @Column(name = "mia_t") private int mia_t;
    @Column(name = "mia_ec") private int mia_ec;
    @Column(name = "mia_es") private int mia_es;
    @Column(name = "esp_t") private int esp_t;
    @Column(name = "esp_ec") private int esp_ec;
    @Column(name = "esp_es") private int esp_es;
    @Column(name = "lic_t") private int lic_t;
    @Column(name = "lic_ec") private int lic_ec;
    @Column(name = "lic_es") private int lic_es;
    @Column(name = "sup_t") private int sup_t;
    @Column(name = "sup_ec") private int sup_ec;
    @Column(name = "sup_es") private int sup_es;
    @Column(name = "mto_t") private int mto_t;
    @Column(name = "mto_ec") private int mto_ec;
    @Column(name = "mto_es") private int mto_es;
    @Column(name = "bac_t") private int bac_t;
    @Column(name = "bac_ec") private int bac_ec;
    @Column(name = "bac_es") private int bac_es;
    @Column(name = "tec_t") private int tec_t;
    @Column(name = "tec_ec") private int tec_ec;
    @Column(name = "tec_es") private int tec_es;
    @Column(name = "com_t") private int com_t;
    @Column(name = "com_ec") private int com_ec;
    @Column(name = "com_es") private int com_es;
    @Column(name = "sec_t") private int sec_t;
    @Column(name = "sec_ec") private int sec_ec;
    @Column(name = "sec_es") private int sec_es;
    @Column(name = "pia_t") private int pia_t;
    @Column(name = "pia_ec") private int pia_ec;
    @Column(name = "pia_es") private int pia_es;
}
