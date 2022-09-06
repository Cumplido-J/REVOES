package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PdfModule {
    private String name;
    private String score;
    private String hours;
    private String credits;
}
