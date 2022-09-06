package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCreditsUpdate {
    private String curp;
    private String totalCredits;
    private Integer obtainedCredits;
    private Double finalScore;
}
