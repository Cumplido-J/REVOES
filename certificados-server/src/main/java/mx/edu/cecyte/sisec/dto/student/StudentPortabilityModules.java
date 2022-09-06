package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentPortabilityModules {
    private String careerName;
    private Integer id;
    private String moduleName;
    private Double score;

    public StudentPortabilityModules(CareerModule careerModule) {
        this.careerName = careerModule.getCareer().getName();
        this.id = careerModule.getId();
        this.moduleName = careerModule.getModule().getModule();
        this.score = 0d;
    }

    public StudentPortabilityModules(StudentCareerModule studentCareerModule) {
        this.careerName = studentCareerModule.getCareerModule().getCareer().getName();
        this.id = studentCareerModule.getCareerModule().getId();
        this.moduleName = studentCareerModule.getCareerModule().getModule().getModule();
        this.score = studentCareerModule.getScore();
    }

}
