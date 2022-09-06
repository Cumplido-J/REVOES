package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentFormatCarrer {
    private String carrerKey;
    private String careerName;
    private List<StudentFormatResult> student;
    private List<StudentFormatModule> module;
}
