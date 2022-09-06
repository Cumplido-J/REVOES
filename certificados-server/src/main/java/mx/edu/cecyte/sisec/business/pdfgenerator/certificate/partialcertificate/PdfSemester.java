package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PdfSemester {
    private String name;
    private List<PdfUac> uacList;
}
