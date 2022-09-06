package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
public class DegreeSearchData {
    private String folio;
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String email;
    private String enrollmentKey;
    private String schoolKey;
    private String schoolName;
    private String careerKey;
    private String careerName;
    private Date startDateCarrer;
    private Date endDateCarrer;
    private Date dateExpedition;
    private String stampedDate;
    private String stateName;
    private String excelMessage;
    private Integer excelStatus;
}
