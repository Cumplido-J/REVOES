package mx.edu.cecyte.sisec.classes.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelRowDegree {
    private String fileName;
    private Integer status;
    private String message;
    private String folio;
}
