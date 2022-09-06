package mx.edu.cecyte.sisec.dto.school;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.education.SchoolEquivalent;

@Data
@Builder
@AllArgsConstructor
public class SchoolEquivalentData {
    private Integer schoolId;
    private String cct;
    private String pdfName;
    private Integer cityId;
    private String cityName;
    private Integer stateId;
    private String state;
    private Integer id;
    private Integer gender;

    public SchoolEquivalentData(SchoolEquivalent equivalent) {
        this.schoolId = equivalent.getSchool().getId();
        this.cct = equivalent.getCct();
        this.pdfName = equivalent.getPdfName();
        this.cityId = equivalent.getCity().getId();
    }
}
