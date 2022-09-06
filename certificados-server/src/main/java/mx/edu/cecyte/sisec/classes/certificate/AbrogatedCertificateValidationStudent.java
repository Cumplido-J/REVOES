package mx.edu.cecyte.sisec.classes.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AbrogatedCertificateValidationStudent {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String enrollmentKey;
    private String cct;
    private String schoolName;
    private String careerName;
    private String carrerKey;
    private boolean dataComplete;
    private boolean isPortability;
    private boolean reprobate;
}
