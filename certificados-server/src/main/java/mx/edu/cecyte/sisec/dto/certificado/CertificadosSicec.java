package mx.edu.cecyte.sisec.dto.certificado;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.mec.Certificate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificadosSicec {
    private String folio;
    private String curp;
    private String institucion;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String numControl;
    private String cctSchool;
    private Integer obtainedCredits;
    private String fechaEmision;
    private String tipoCertificado;
    private String carrera;
    private String emisora;
    private Integer tipoPlantel;
    private Integer creditsTotal;
    private Double promedio;
    private String promedioText;
    private Integer len;
    private String estatus;
    public CertificadosSicec(Certificate certificate){
        this.folio=certificate.getFolio() !=null ? certificate.getFolio() : "No disponible";
        this.curp=certificate.getStudent().getUser().getUsername()!=null ? certificate.getStudent().getUser().getUsername():" ";
        this.nombres=certificate.getStudent().getUser().getName()!=null ? certificate.getStudent().getUser().getName():"";
        this.primerApellido=certificate.getStudent().getUser().getFirstLastName() !=null ? certificate.getStudent().getUser().getFirstLastName():" ";
        this.segundoApellido=certificate.getStudent().getUser().getSecondLastName() !=null ? certificate.getStudent().getUser().getSecondLastName():" ";
        this.numControl=certificate.getStudent().getEnrollmentKey()!=null ? certificate.getStudent().getEnrollmentKey():"";
        this.fechaEmision=certificate.getDateSep()!=null ? certificate.getDateSep():" ";
        this.obtainedCredits=certificate.getStudent().getObtainedCredits()!=null ? certificate.getStudent().getObtainedCredits():certificate.getStudent().getSchoolCareer().getCareer().getTotalCredits();
        this.tipoPlantel=certificate.getStudent().getSchoolCareer().getSchool().getSchoolType().getId();
        this.creditsTotal=certificate.getStudent().getSchoolCareer().getCareer().getTotalCredits();
        this.promedio=certificate.getStudent().getFinalScore()!=null ? certificate.getStudent().getFinalScore():0;
        this.promedioText=promedio.toString();
        this.len=promedioText.length();
        if (certificate.getStatus().equals("CERTIFICADO")) {
            this.estatus = "REGISTRADO";
        }else{
            this.estatus=certificate.getStatus();
        }
        if(certificate.getCertificateTypeId()==1){
            this.tipoCertificado="Certificado de Terminación de Estudios";
        }else if(certificate.getCertificateTypeId()==2){
            this.tipoCertificado="Certificado Parcial de Estudios";
        }else{
            this.tipoCertificado="Certificado de Terminación de Estudios";
        }


        if (certificate.getStudent().getSchoolCareer() == null) {
            this.cctSchool=certificate.getStudent().getSchool().getCct();
            this.emisora=certificate.getStudent().getSchool().getCity().getState().getName();
            if(certificate.getStudent().getSchool().getSchoolType().getId()==18){
                ///CECyTE
                this.institucion="CECyTE "+certificate.getStudent().getSchool().getPdfFinalName();
            }
            if (certificate.getStudent().getSchool().getSchoolType().getId()==19){
                //CEMSaD
                this.institucion ="CEMSaD "+certificate.getStudent().getSchool().getPdfFinalName();
            }

        } else if (certificate.getStudent().getSchoolCareer() != null) {
            this.cctSchool=certificate.getStudent().getSchoolCareer().getSchool().getCct();
            this.emisora=certificate.getStudent().getSchoolCareer().getSchool().getCity().getState().getName();

            if(certificate.getStudent().getSchoolCareer().getSchool().getSchoolType().getId()==18){
                ///CECyTE
                this.institucion="CECyTE "+certificate.getStudent().getSchoolCareer().getSchool().getPdfFinalName();
            }
            if (certificate.getStudent().getSchoolCareer().getSchool().getSchoolType().getId()==19){
                //CEMSaD
                this.institucion ="CEMSaD "+certificate.getStudent().getSchoolCareer().getSchool().getPdfFinalName();
            }
        }


        if(certificate.getStudent().getSchoolCareer().getSchool().getSchoolType().getId()==18){

            this.carrera="Bachillerato Tecnológico, con la carrera Técnica en "+certificate.getStudent().getSchoolCareer().getCareer().getName();
        }
        if (certificate.getStudent().getSchoolCareer().getSchool().getSchoolType().getId()==19){
            this.carrera="Bachillerato general, con la formación elemental para el trabajo en "+certificate.getStudent().getSchoolCareer().getCareer().getName();
        }


    }
}
