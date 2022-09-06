package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.abrogatedcertificate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PdfModuleAbrogated {
    private String name;
    private String score;
    private String hours;
    private String credits;
}
