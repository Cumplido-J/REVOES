package mx.edu.cecyte.sisec.model.met;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.degree.DegreeDataAntecedents;
import mx.edu.cecyte.sisec.model.catalogs.degree.*;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;
import java.util.Date;
@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "titulo_datos")
public class DegreeData {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)  private Integer id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrera_id") private CatDegreeCombinationDgp carrerId;
    @Column(name = "fecha_inicio_carrera") private Date startDateCarrer;
    @Column(name = "fecha_termino_carrera") private Date endDateCarrer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "autorizacion_id") private CatDegreeAuth autorizationId;

    @Column(name = "fecha_expedicion_titulo") private Date expeditionData;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "modalidad_id") private CatDegreeModality modalityId;
    @Column(name = "fecha_examen_profesional") private Date examinationDate;
    @Column(name = "fecha_examen_exencion") private Date exemptionDate;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "fundameto_legal_id") private CatDegreeSocialService legalBasisId;
    @Column(name = "servicio_social") private Integer socialService;
    @Column(name = "entidad_expedicion_id") private Integer federalEntityId;
    @Column(name = "entidad_nombre") private String federalEntityName;

    @Column(name = "nombre_institucion_origen") private String institutionOrigin;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_intitucion_origen_id") private CatDegreeAntecedent institutionOriginTypeId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "entidad_origen_id") private CatDegreeState federalEntityOriginId;
    @Column(name = "fecha_inicio_origen") private Date startDate;
    @Column(name = "fecha_termino_origen")private Date endDate;



    public DegreeData(DegreeDataAntecedents data, Student student, CatDegreeCombinationDgp carrer, CatDegreeAuth auth, CatDegreeModality modality, CatDegreeSocialService legal, CatDegreeAntecedent antecedent, CatDegreeState state) {
        this.id = null;
        this.student = student;
        this.carrerId = carrer;
        this.startDateCarrer = data.getStartDateCarrer();
        this.endDateCarrer = data.getEndDateCarrer();
        this.autorizationId = auth;
        this.expeditionData = data.getExpeditionData();
        this.modalityId = modality;
        this.examinationDate = data.getExaminationDate();
        this.exemptionDate = data.getExemptionDate();
        this.legalBasisId = legal;
        this.socialService = data.getSocialService();
        this.federalEntityId = data.getFederalEntityId();
        this.federalEntityName = data.getFederalEntityName();
        this.institutionOrigin = data.getInstitutionOrigin();
        this.institutionOriginTypeId = antecedent;
        this.federalEntityOriginId = state;
        this.startDate = data.getStartDate();
        this.endDate = data.getEndDate();
    }

    public DegreeData(Integer id, DegreeDataAntecedents data, Student student, CatDegreeCombinationDgp carrer, CatDegreeAuth auth, CatDegreeModality modality, CatDegreeSocialService legal, CatDegreeAntecedent antecedent, CatDegreeState state) {
        this.id = id;
        this.student = student;
        this.carrerId = carrer;
        this.startDateCarrer = data.getStartDateCarrer();
        this.endDateCarrer = data.getEndDateCarrer();
        this.autorizationId = auth;
        this.expeditionData = data.getExpeditionData();
        this.modalityId = modality;
        this.examinationDate = data.getExaminationDate();
        this.exemptionDate = data.getExemptionDate();
        this.legalBasisId = legal;
        this.socialService = data.getSocialService();
        this.federalEntityId = data.getFederalEntityId();
        this.federalEntityName = data.getFederalEntityName();
        this.institutionOrigin = data.getInstitutionOrigin();
        this.institutionOriginTypeId = antecedent;
        this.federalEntityOriginId = state;
        this.startDate = data.getStartDate();
        this.endDate = data.getEndDate();
    }
}
