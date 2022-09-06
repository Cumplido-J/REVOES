package mx.edu.cecyte.sisec.classes.certificate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StudentAbrogatedDecDataModule {
    private Integer order;
    private String module;
    private String emsadCompetence;
    private Double score;
    private Integer hours;
    private Integer credits;
}
