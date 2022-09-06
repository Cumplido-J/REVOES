package mx.edu.cecyte.sisec.classes.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.degree.StudentDegreeStructure;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDegreeView {
    private String curp;
    private String generation;
    private List<StudentDegreeStructure> student;

}
