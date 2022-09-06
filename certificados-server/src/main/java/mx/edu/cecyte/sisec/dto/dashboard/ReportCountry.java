package mx.edu.cecyte.sisec.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportCountry {
    private String id;
    private String name;
    private Integer hvalue;
    private Integer mvalue;
}
