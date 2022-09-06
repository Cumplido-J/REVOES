package mx.edu.cecyte.sisec.dto.school;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.education.School;

import java.sql.Date;

@Data
@Builder
@AllArgsConstructor
public class SchoolData {
    private Integer idschool;
    private String cct;
    private String name;
    private Integer stateId;
    private Integer cityId;
    private Integer schoolTypeId;
    private Date sinemsDate;
    private int status;

    public SchoolData(School school) {
        this.idschool=school.getId();
        this.cct = school.getCct();
        this.name = school.getName();
        this.stateId = school.getCity().getState().getId();
        this.cityId = school.getCity().getId();
        this.schoolTypeId = school.getSchoolType().getId();
        this.sinemsDate = school.getSinemsDate();
        this.status = school.getStatus() == 1 ? 1: 2;
    }
}
