package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import lombok.Data;

@Data
//@AllArgsConstructor
public class PdfUac {
    private String cct;
    private String name;
    private String score;
    private String hours;
    private String credits;
    private String schoolPeriod;
    private String type;

    public PdfUac(String cct, String name, String score, String hours, String credits, String schoolPeriod, Integer idUacType) {
        this.cct = cct;
        this.name = name;
        this.score = score;
        this.hours = hours;
        this.credits = credits;
        this.schoolPeriod = schoolPeriod;

        if (idUacType == 1) this.type = "Disciplinar básica";
        else if (idUacType == 2) this.type = "Disciplinar extendida";
        else if (idUacType == 3) this.type = "Profesional básica";
        else if (idUacType == 4) this.type = "Profesional extendida";
        else this.type = "***";

    }
}
