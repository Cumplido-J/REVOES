package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CareerModuleCatalog {
    private Integer id;
    private Integer career;
    private String module;
    private Integer order;
    private Integer credits;
    private Integer hours;
}
