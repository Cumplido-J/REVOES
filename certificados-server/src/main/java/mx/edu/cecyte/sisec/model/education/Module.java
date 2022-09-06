package mx.edu.cecyte.sisec.model.education;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.competence.CompetenceData;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "competencia")
public class Module {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "modulo") private String module;
    @Column(name = "competencia_emsad") private String emsadCompetence;

    @OneToMany(mappedBy = "module") Set<CareerModule> careerModules;

    public Module( CompetenceData competenceData){
        this.module=competenceData.getModule();
        this.emsadCompetence=competenceData.getEmsadCompetence();
    }

    public void editCompetenceData(CompetenceData competenceData){
        this.module=competenceData.getModule();
        this.emsadCompetence=competenceData.getEmsadCompetence();
    }
}
