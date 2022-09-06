package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelRowMec {
    private String fileName;
    private Integer status;
    private String message;
}
