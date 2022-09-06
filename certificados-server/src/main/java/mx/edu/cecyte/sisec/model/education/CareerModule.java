package mx.edu.cecyte.sisec.model.education;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.career.ModuleData;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "carrera_competencia")
public class CareerModule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "creditos") private Integer credits;
    @Column(name = "orden") private Integer order;
    @Column(name = "horas") private Integer hours;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "carrera_id") private Career career;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "competencia_id") private Module module;

    @OneToMany(mappedBy = "careerModule") Set<StudentCareerModule> studentCareerModules;

    public CareerModule ( ModuleData moduleData, Career career, Module module){
        this.credits=moduleData.getCredits();
        this.hours=moduleData.getHours();
        this.order=moduleData.getOrder();
        this.career=career;
        this.module=module;
    }

    public void editCareerModuleData(ModuleData moduleData,Career career, Module module){
        this.credits=moduleData.getCredits();
        this.hours=moduleData.getHours();
        this.order=moduleData.getOrder();
        this.career=career;
        this.module=module;
    }
}
