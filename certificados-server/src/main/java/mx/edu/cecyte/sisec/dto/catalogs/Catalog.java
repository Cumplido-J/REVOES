package mx.edu.cecyte.sisec.dto.catalogs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Catalog implements Comparable<Catalog>{
    private Integer id;
    private String description1;
    private String description2;

    public Catalog(Integer id, String description1) {
        this.id = id;
        this.description1 = description1;
    }


    @Override
    public int compareTo(Catalog o) {
        if(o.getId()>id){
            return -1;
        }else {
            return 0;
        }
    }
}
