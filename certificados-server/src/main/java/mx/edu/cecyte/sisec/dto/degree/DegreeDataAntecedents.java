package mx.edu.cecyte.sisec.dto.degree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.met.DegreeData;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
public class DegreeDataAntecedents {
    private Integer studentId;
    private Integer carrerId;
    private Date startDateCarrer;
    private Date endDateCarrer;
    private Integer autorizationId;

    private Date expeditionData;
    private Integer modalityId;
    private Date examinationDate;
    private Date exemptionDate;
    private Integer legalBasisId;
    private Integer socialService;
    private Integer federalEntityId;
    private String federalEntityName;

    private String institutionOrigin;
    private Integer institutionOriginTypeId;
    private Integer federalEntityOriginId;
    private Date startDate;
    private Date endDate;
    public DegreeDataAntecedents(DegreeData degreeData) {
        this.studentId = degreeData.getStudent().getId();
        this.carrerId = degreeData.getCarrerId().getId();
        this.startDateCarrer = degreeData.getStartDateCarrer();
        this.endDateCarrer = degreeData.getEndDateCarrer();
        this.autorizationId = degreeData.getAutorizationId().getId();

        this.expeditionData = degreeData.getExpeditionData();
        this.modalityId = degreeData.getModalityId().getId();
        this.examinationDate = degreeData.getExaminationDate();
        this.exemptionDate = degreeData.getExemptionDate();
        this.legalBasisId = degreeData.getLegalBasisId().getId();
        this.socialService = degreeData.getSocialService();
        this.federalEntityId = degreeData.getFederalEntityId();
        this.federalEntityName = degreeData.getFederalEntityName();

        this.institutionOrigin = degreeData.getInstitutionOrigin();
        this.institutionOriginTypeId = degreeData.getInstitutionOriginTypeId().getId();
        this.federalEntityOriginId = degreeData.getFederalEntityOriginId().getId();
        this.startDate = degreeData.getStartDate();
        this.endDate = degreeData.getEndDate();
    }
}
