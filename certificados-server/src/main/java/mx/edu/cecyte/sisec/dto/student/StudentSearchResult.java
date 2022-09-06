package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudentSearchResult {
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
    private Integer estatus;

    public StudentSearchResult(String curp, String name, String firstLastName, String secondLastName, String enrollmentKey, String cct, String schoolName, String generation) {
        this.curp = curp;
        this.name = name;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.enrollmentKey = enrollmentKey;
        this.cct = cct;
        this.schoolName = schoolName;
        this.generation = generation;
    }
}
