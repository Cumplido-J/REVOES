package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolCatalog {
    private Integer id;
    private String name;
    private String cct;
    private List<CareerCatalog> careers;

    public SchoolCatalog(Integer id, String name, String cct) {
        this.id = id;
        this.name = name;
        this.cct = cct;
        this.careers = new ArrayList<>();
    }
}
