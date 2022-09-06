package mx.edu.cecyte.sisec.dto.school;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
@AllArgsConstructor
@Data
public class SchoolEquivalentSearchResult {
    private  int idschool;
    private String cct;
    private String name;
    private String finalname;
    private int status;
    private String city;
    private String schoolType;
    private Date sinemsDate;
    private boolean equivalent;
    private Integer stateId;
}
