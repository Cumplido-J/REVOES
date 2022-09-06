package mx.edu.cecyte.sisec.dto.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.education.Career;

@Data
@Builder
@AllArgsConstructor
public class CareerData {
    private Integer idcareer;
    private String name;
    private String careerKey;
    private Integer totalCredits;
    private Integer profileType;//tipo perfil
    private Integer subjectType;//tipo uac
    private Integer studyType;//tipo estudio
    private Integer  disciplinaryField;//campo diciplinar
    private Integer statusId;
    public CareerData( Career career){
        this.idcareer=career.getId();
        this.name=career.getName();
        this.careerKey=career.getCareerKey();
        this.totalCredits=career.getTotalCredits();
        this.profileType=career.getProfileType().getId();
        //this.subjectType=career.getSubjectType().getId();
        this.subjectType=career.getSubjectType() != null ? career.getProfileType().getId() : 0;
        this.studyType=career.getStudyType().getId();
        this.disciplinaryField=career.getDisciplinaryField().getId();
        this.statusId=career.getStatusId() == 1 ? 1: 2;
    }

}

