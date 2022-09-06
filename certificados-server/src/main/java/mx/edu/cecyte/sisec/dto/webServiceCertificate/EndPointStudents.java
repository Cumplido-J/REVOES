package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EndPointStudents {

    private EndPointStudentData endPointStudentData;

    private List<ScoreModule> scoreModules;

    private List<ScoreModulePartial> scoreModulePartials;
}
