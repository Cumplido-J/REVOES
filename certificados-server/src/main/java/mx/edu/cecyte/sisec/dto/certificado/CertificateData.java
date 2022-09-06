package mx.edu.cecyte.sisec.dto.certificado;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.siged.Certification;

@Data
@Builder
@AllArgsConstructor
public class CertificateData {
    //private Integer certificadoId;
    private String folio;
    private String nombreCompleto;
    private String curp;
    private String institucion;
    private String fechaCertificado;
    private String estatus;
    private String tipoCertificado;
    private Double promedio;
    private String promedioTexto;
    private String carrera;
    private String entidad;
    private String fechaEmision;
    private String emisora;
    private String planestudio;
    public CertificateData(Certification certification){
        this.folio=certification.getFolio();
        this.nombreCompleto=certification.getNombreCompleto();
        this.curp=certification.getCurp();
        this.fechaCertificado=certification.getFechaCertificado();
        this.estatus=certification.getEstatus();
        this.tipoCertificado= certification.getTipoCertificado();
        this.promedio=certification.getPromedio();
        this.promedioTexto=certification.getPromedioText();
        this.institucion= certification.getInstitucion();
        this.emisora=certification.getEmisora();
        this.planestudio=certification.getPlanestudio();
        this.fechaEmision=certification.getFechaEmision();
        this.entidad=certification.getEntidad();
    }
}
