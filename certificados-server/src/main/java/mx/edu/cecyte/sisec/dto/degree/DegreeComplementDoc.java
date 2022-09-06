package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DegreeComplementDoc {
    private String nameState;
    private String cityName;
    private String numberDecree;
    private String dateDecree;
    private String nameSchool;
    private String nameCity;
    private String nameMunicipality;
    private Date dateExpedition;
    private String nameDirector;
    private String firstLastNameDirector;
    private String secondLastNameDirector;
    private String nameAcademic;
    private String firstLastNameAcademic;
    private String secondLastNameAcademic;
    private String gender;
    private String logoNameAbbreviation;
    private Integer stateId;
    private String curpAcademic;
}
