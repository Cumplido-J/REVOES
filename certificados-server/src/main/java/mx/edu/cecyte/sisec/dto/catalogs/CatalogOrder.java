package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CatalogOrder implements Comparable<CatalogOrder>{
    private Integer id;
    private String description1;
    private String description2;
    private Integer order;

    public CatalogOrder(Integer id, String description1, Integer order) {
        this.id = id;
        this.description1 = description1;
        this.order=order;
    }


    @Override
    public int compareTo(CatalogOrder o) {
        if(o.getOrder()>order){
            return -1;
        }else {
            return 0;
        }
    }
}
