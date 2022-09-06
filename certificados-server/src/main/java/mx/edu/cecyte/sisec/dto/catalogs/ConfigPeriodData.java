package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
public class ConfigPeriodData {
    private Integer stateId;
    private Date dateStart;
    private Date dateOne;
    private String generation;
}
