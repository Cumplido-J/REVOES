package mx.edu.cecyte.sisec.dto.student;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@NoArgsConstructor
@Builder
@Data
public class StudentRecord {
    private Integer studentId;
    private Integer endign;
    private Integer partial;
    private Integer abrogate;
    private StudentRecordData studentData;
    private List<StudentRecordScore> subjectData;
    private List<StudentRecordData> recordData;

    public StudentRecord(Integer studentId, Integer endign, Integer partial, Integer abrogate, StudentRecordData studentData, List<StudentRecordScore> subjectData, List<StudentRecordData> recordData) {
        this.studentId = studentId;
        this.endign = endign >= 0 ? endign : 0;
        this.partial = partial >= 0 ? partial : 0;
        this.abrogate = abrogate >= 0 ? abrogate : 0;
        this.studentData = studentData;
        this.subjectData = subjectData;
        this.recordData = recordData;
    }
}
