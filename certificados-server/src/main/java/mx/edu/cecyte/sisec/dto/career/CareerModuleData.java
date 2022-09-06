package mx.edu.cecyte.sisec.dto.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CareerModuleData {
    //private String idCareer;
    private List<Integer> careerModuleId;
}
