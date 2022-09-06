package mx.edu.cecyte.sisec.dto.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.education.CareerModule;

@Data
@Builder
@AllArgsConstructor
public class ModuleData {
    private Integer id;
    //private Integer career;
    private Integer module;
    private Integer credits;
    private Integer order;
    private Integer hours;
    public ModuleData( CareerModule careerModule){
        this.id=careerModule.getId();
        //this.career=careerModule.getCareer().getId();
        this.module=careerModule.getModule().getId();
        this.credits=careerModule.getCredits();
        this.order=careerModule.getOrder();
        this.hours=careerModule.getHours();
    }
}
