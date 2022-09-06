package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DegreeValidationStudent {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String enrollmentKey;
    private String clave;
    private String institute;
    private String careerName;
    private String carrerKey;
    private Integer socialService;
    private String cct;
    private String schoolName;
    private boolean endingCertificate;
}
