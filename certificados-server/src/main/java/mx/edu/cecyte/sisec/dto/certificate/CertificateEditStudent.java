package mx.edu.cecyte.sisec.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.student.Student;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateEditStudent {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private Date enrollmentStartDate;
    private Date enrollmentEndDate;
    private Double finalScore;
    private String careerName;
    private String schoolName;
    private Boolean reprobate;
    private List<CertificateEditStudentModule> modules;
    private Integer isPortability=1;
    private Integer isAbrogado=1;
    private Integer disciplinaryCompetence=0;

    public CertificateEditStudent(Student student) {
        this.curp = student.getUser().getUsername();
        this.name = student.getUser().getName();
        this.firstLastName = student.getUser().getFirstLastName();
        this.secondLastName = student.getUser().getSecondLastName();
        this.enrollmentStartDate = student.getEnrollmentStartDate();
        this.enrollmentEndDate = student.getEnrollmentEndDate();
        this.finalScore = student.getFinalScore();
        this.careerName = student.getSchoolCareer().getCareer().getName();
        this.schoolName = student.getSchoolCareer().getSchool().getName();
        this.reprobate = student.getReprobate();
        this.modules = new ArrayList<>();
        for (StudentCareerModule studentCareerModule : student.getStudentCareerModules()) {
            modules.add(new CertificateEditStudentModule(studentCareerModule));
        }
        Collections.sort(this.modules);
        this.disciplinaryCompetence = student.getDisciplinaryField() != null ? student.getDisciplinaryField().getId() : 0;
    }
}
