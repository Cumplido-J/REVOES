package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateCatalog {
    private Integer id;
    private String name;
    private List<SchoolCatalog> schools;

    public StateCatalog(Integer id, String name) {
        this.id = id;
        this.name = name;
        this.schools = new ArrayList<>();
    }
}
