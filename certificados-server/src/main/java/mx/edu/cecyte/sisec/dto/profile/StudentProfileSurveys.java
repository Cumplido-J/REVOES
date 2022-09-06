package mx.edu.cecyte.sisec.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileSurveys {
    private String name;
    private String link;
    private Date startDate;
    private Date endDate;
    private String folio;
}
