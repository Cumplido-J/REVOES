package mx.edu.cecyte.sisec.dto.career;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
//@NoArgsConstructor
@AllArgsConstructor
public class CareerList {
    private Integer id;
    private String name;
    private String careerKey;
    private Integer totalCredits;
    private String perfilType;
}
