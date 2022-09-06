package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDegreeStructure {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String email;
    private String enrollmentKey;
    private String schoolKey;
    private String schoolName;
    private Integer careerId;
    private String careerKey;
    private String careerName;
    private Date startDateCareer;
    private Date endDateCareer;
    private Integer autorizationId;
    private String auth;
    private Date expeditionDate;
    private Integer modalityId;
    private String degreeModality;
    private Date examinationDate;
    private Date exemptionDate;
    private Integer socialService;
    private Integer legalBasisId;
    private String legalBasis;
    private Integer federalEntityId;
    private String state;
    private String institutionOrigin;
    private Integer institutionOriginTypeId;
    private String antecedent;
    private Integer federalEntityOriginId;
    private String antecedentState;
    private Date antecedentStartDate;
    private Date antecedentEndDate;
}
