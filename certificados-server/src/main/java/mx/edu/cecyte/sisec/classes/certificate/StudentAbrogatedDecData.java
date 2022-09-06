package mx.edu.cecyte.sisec.classes.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAbrogatedDecData {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String enrollmentKey;
    private Date enrollmentStartDate;
    private Date enrollmentEndDate;
    private Double finalScore;
    private String pdfName;
    private String pdfNumber;
    private String pdfFinalName;
    private String cct;
    private Integer schoolTypeId;
    private Integer iemsId;
    private Integer educationalOptionId;
    private Integer stateId;
    private String localityId;
    private Integer studyTypeId;
    private String careerName;
    private String careerKey;
    private Integer credits;
    private String profileType;
    private Integer disciplinarFieldId;
    private String disciplinarField;
    private String studyArea;
    private Boolean isPortability;
    private List<StudentAbrogatedDecDataModule> modules;
    private Integer gender;

    public String getStateIdString() {
        if (stateId < 10) return "0" + stateId;
        return stateId.toString();
    }

    public StudentAbrogatedDecData(String curp, String name, String firstLastName, String secondLastName, String enrollmentKey, Date enrollmentStartDate, Date enrollmentEndDate, Double finalScore, String pdfName, String pdfNumber, String pdfFinalName, String cct, Integer schoolTypeId, Integer iemsId, Integer educationalOptionId, Integer stateId, String localityId, Integer studyTypeId, String careerName, String careerKey, Integer credits, String profileType, Integer disciplinarFieldId, String disciplinarField, String studyArea, Boolean isPortability) {
        this.curp = curp;
        this.name = name;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.enrollmentKey = enrollmentKey;
        this.enrollmentStartDate = enrollmentStartDate;
        this.enrollmentEndDate = enrollmentEndDate;
        this.finalScore = finalScore;
        this.pdfName = pdfName;
        this.pdfNumber = pdfNumber;
        this.pdfFinalName = pdfFinalName;
        this.cct = cct;
        this.schoolTypeId = schoolTypeId;
        this.iemsId = iemsId;
        this.educationalOptionId = educationalOptionId;
        this.stateId = stateId;
        this.localityId = localityId;
        this.studyTypeId = studyTypeId;
        this.careerName = careerName;
        this.careerKey = careerKey;
        this.credits = credits;
        this.profileType = profileType;
        this.disciplinarFieldId = disciplinarFieldId;
        this.disciplinarField = disciplinarField;
        this.studyArea = studyArea;
        this.isPortability = isPortability;
    }
}
