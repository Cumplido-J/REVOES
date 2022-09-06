package mx.edu.cecyte.sisec.dto.competence;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.education.Module;

@Data
@Builder
@AllArgsConstructor
public class CompetenceData {
    //private Integer idmodule;
    private String module;
    private String emsadCompetence;
    public CompetenceData( Module module){
        //this.idmodule=module.getId();
        this.module=module.getModule();
        this.emsadCompetence=module.getEmsadCompetence();
    }
}
