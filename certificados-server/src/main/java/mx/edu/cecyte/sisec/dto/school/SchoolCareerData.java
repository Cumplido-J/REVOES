package mx.edu.cecyte.sisec.dto.school;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SchoolCareerData {
    private String cct;
    private List<Integer> careerTypeId;
}
