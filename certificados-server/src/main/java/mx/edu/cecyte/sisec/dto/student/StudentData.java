package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import mx.edu.cecyte.sisec.model.student.Student;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
public class StudentData {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String email;
    private String enrollmentKey;
    private Integer stateId;
    private Integer schoolId;
    private Integer careerId;
    private String generation;
    private Date enrollmentStartDate;
    private Date enrollmentEndDate;
    private Boolean studentStatusId;
    private Boolean isPortability;
    private Boolean partialCertificate;
    private Boolean abrogadoCertificate;
    private Integer statusSchool;

    public StudentData(Student student) {
        this.curp = student.getUser().getUsername();
        this.name = student.getUser().getName();
        this.firstLastName = student.getUser().getFirstLastName();
        this.secondLastName = student.getUser().getSecondLastName();
        this.email = student.getUser().getEmail();
        this.enrollmentKey = student.getEnrollmentKey();

        if (student.getSchoolCareer() == null && student.getSchool() != null) {
            this.stateId = student.getSchool().getCity().getState().getId();
            this.schoolId = student.getSchool().getId();
            this.careerId = 0;
            this.statusSchool=student.getSchool().getStatus();
        } else if (student.getSchoolCareer() != null) {
            this.stateId = student.getSchoolCareer().getSchool().getCity().getState().getId();
            this.schoolId = student.getSchoolCareer().getSchool().getId();
            this.careerId = student.getSchoolCareer().getCareer().getId();
            this.statusSchool=student.getSchoolCareer().getSchool().getStatus();
        }
        this.studentStatusId = student.getStatus();
        this.generation = student.getGeneration();
        this.enrollmentStartDate = student.getEnrollmentStartDate();
        this.enrollmentEndDate = student.getEnrollmentEndDate();
        this.isPortability= student.getIsPortability();
        this.partialCertificate =student.getPartialCertificate();
        this.abrogadoCertificate=student.getAbrogadoCertificate();
    }
}
