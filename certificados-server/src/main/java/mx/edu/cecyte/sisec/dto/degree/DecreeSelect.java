package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
public class DecreeSelect {
    private Integer id;
    private String name;
    private String abbreviation;
    private String decreeNumber;
    private String decreeDate;
    private Integer state;
    private String cityName;
}
