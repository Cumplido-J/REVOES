package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentFormatResult {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String enrollmentKey;
    private String cct;
    private String schoolName;
    private String carrerKey;
    private String careerName;
    private String generation;
}
