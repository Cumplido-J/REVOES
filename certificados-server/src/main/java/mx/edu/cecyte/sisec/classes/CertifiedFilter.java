package mx.edu.cecyte.sisec.classes;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CertifiedFilter {
    private String generation;
    private Integer typeId;
}
