package mx.edu.cecyte.sisec.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateEditStudentModule implements Comparable<CertificateEditStudentModule> {
    private Integer id;
    private String name;
    private Double score;
    private Integer order;

    public CertificateEditStudentModule(StudentCareerModule studentCareerModule) {
        this.id = studentCareerModule.getId();
        this.name = studentCareerModule.getCareerModule().getModule().getModule();
        this.score = studentCareerModule.getScore();
        this.order = studentCareerModule.getCareerModule().getOrder();
    }

    @Override public int compareTo(CertificateEditStudentModule certificateEditStudentModule) {
        return this.getOrder().compareTo(certificateEditStudentModule.getOrder());
    }
}
