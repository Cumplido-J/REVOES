package mx.edu.cecyte.sisec.model.education;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.career.CareerData;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.catalogs.CatProfileType;
import mx.edu.cecyte.sisec.model.catalogs.CatStudyType;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial;
import mx.edu.cecyte.sisec.model.subjects.Subject;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "carrera")
public class Career {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "clave_carrera") private String careerKey;
    @Column(name = "total_creditos") private Integer totalCredits;

    @OneToMany(mappedBy = "career") Set<SchoolCareer> schoolCareers;
    @OneToMany(mappedBy = "career") Set<CareerModule> careerModules;
    @OneToMany(mappedBy = "career") Set<StudentRecordPartial> studentRecordPartials;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_perfil_id") private CatProfileType profileType;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_uac_id") private CatSubjectType subjectType;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_estudio_id") private CatStudyType studyType;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "campo_disciplinar_id")
    private CatDisciplinaryField disciplinaryField;

    @Column(name = "status_id") private Integer statusId;

    public Career(CareerData careerData, CatProfileType profileType, CatSubjectType subjectType, CatStudyType studyType, CatDisciplinaryField disciplinaryField){
        this.name=careerData.getName();
        this.careerKey=careerData.getCareerKey();
        this.totalCredits=careerData.getTotalCredits();
        this.profileType=profileType;
        if(subjectType!=null) {
            this.subjectType=subjectType;
        }
        this.studyType = studyType;
        this.disciplinaryField=disciplinaryField;
        this.statusId=careerData.getStatusId()== 1 ? 1: 0;
    }

    public void editCareerData( CareerData careerData, CatProfileType profileType, CatSubjectType subjectType, CatStudyType studyType, CatDisciplinaryField disciplinaryField){
        this.name=careerData.getName();
        this.careerKey=careerData.getCareerKey();
        this.totalCredits=careerData.getTotalCredits();
        this.profileType=profileType;
        if(subjectType!=null) {
            this.subjectType = subjectType;
        }
        this.studyType=studyType;
        this.disciplinaryField=disciplinaryField;
        this.statusId=careerData.getStatusId()== 1 ? 1: 0;
    }

}
