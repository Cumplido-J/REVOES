package mx.edu.cecyte.sisec.dto.lecture;

public interface Lectures {
    Integer getId();
    String getNombre();
    String getClave_uac();
    Integer getMd();
    Integer getEi();
    Integer getHoras();
    Integer getCredits();
    Integer getSemestre();
    String getOptativa();
    Integer getCampo_disciplinar_id();
    Integer getTipo_uac_id();
    String getCecyte();
    Integer getModulo_id();
}