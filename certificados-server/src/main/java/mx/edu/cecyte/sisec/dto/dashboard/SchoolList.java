package mx.edu.cecyte.sisec.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolList {
    private Integer id;
    private String title;
    private Float latitude;
    private Float longitude;

}
