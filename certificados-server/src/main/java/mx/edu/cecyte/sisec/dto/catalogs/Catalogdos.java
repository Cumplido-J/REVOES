package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Catalogdos {
    private Integer id; //Id-Carrera
    private Integer schoolcareerId;//Id plantel Carrera;
    private String description1;
    private String description2;
    private Integer cct;///id_plantel
}
