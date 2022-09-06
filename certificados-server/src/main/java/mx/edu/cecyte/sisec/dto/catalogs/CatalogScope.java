package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.CatUserScope;

@NoArgsConstructor @AllArgsConstructor @Data
public class CatalogScope {

    private Integer id;
    private String description2;
    private String description3;
    private Integer description4;

    public CatalogScope(Integer id, String description2, Integer description4){
        this.id = id;

        this.description2 = description2;

        this.description4 = description4;
    }

    public CatalogScope( CatUserScope catUserScope ){
        this.id = catUserScope.getId();

        this.description2 = catUserScope.getName();

        this.description3 = catUserScope.getDescription();
    }

}
