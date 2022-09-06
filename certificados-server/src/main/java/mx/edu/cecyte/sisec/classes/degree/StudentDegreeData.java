package mx.edu.cecyte.sisec.classes.degree;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDegreeData {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String email;

    private String schoolKey;
    private String schoolName;

    //Career
    private String careerKey;
    private String careerName;
    private Date startDate;
    private Date endDate;
    private Integer authId;
    private String auth;

    //Profeisonista
    private Date expeditionDate;
    private Integer degreeModalityId;
    private String degreeModality;
    private Date examDate;
    private Date exencionExamen;
    private Integer hasSocialService;
    private Integer socialServiceId;
    private String socialService;
    private Integer stateId;
    private String state;

    //Antecdente
    private String antecdentSchoolName;
    private Integer antecedentId;
    private String antecedent;
    private Integer antecedentStateId;
    private String antecedentState;
    private Date antecedentStartDate;
    private Date antecedentEndDate;
    private String antecedentCedula;


    /*public String getStateIdString() {
        if (stateId < 10) return "0" + stateId;
        return stateId.toString();
    }*/
}
