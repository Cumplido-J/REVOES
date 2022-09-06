package mx.edu.cecyte.sisec.classes.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.degree.DegreeQueryStudent;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DegreeQueryStudentDto {
    private List<DegreeQueryStudent> students;
}
