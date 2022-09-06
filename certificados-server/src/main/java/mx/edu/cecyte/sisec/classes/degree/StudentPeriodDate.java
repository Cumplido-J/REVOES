package mx.edu.cecyte.sisec.classes.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
public class StudentPeriodDate {
    private Date startDateCarrer;
    private Date endDateCarrer;
}
