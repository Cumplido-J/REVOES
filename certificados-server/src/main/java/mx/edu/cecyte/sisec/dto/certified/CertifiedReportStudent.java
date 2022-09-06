package mx.edu.cecyte.sisec.dto.certified;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertifiedReportStudent {
    private String schoolName;
    private String careerName;
    private String curp;
    private String enrollmentKey;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String folioNumber;
    private String typeCertified;
    private String generation;
    private String timbrado;
    private String inicio;
    private String termino;
}
