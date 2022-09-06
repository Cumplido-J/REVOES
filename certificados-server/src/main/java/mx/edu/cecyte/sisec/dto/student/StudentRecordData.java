package mx.edu.cecyte.sisec.dto.student;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.student.Student;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
public class StudentRecordData {
    private Integer id;
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String email;
    private String enrollmentKey;
    private Integer stateId;
    private String stateName;
    private Integer schoolId;
    private String schoolName;
    private Integer careerId;
    private String careerName;
    private String cct;
    private Date enrollmentStartDate;
    private Date enrollmentEndDate;
    private Boolean studentStatusId;
    private String generation;
    private Boolean isPortability;
    private Boolean partialCertificate;
    private Boolean abrogadoCertificate;

    public StudentRecordData(Student student) {
        this.curp = student.getUser().getUsername();
        this.name = student.getUser().getName();
        this.firstLastName = student.getUser().getFirstLastName();
        this.secondLastName = student.getUser().getSecondLastName();
        this.email = student.getUser().getEmail();
        this.enrollmentKey = student.getEnrollmentKey();

        if (student.getSchoolCareer() == null && student.getSchool() != null) {
            this.stateId = student.getSchool().getCity().getState().getId();
            this.stateName = student.getSchool().getCity().getState().getName();
            this.schoolId = student.getSchool().getId();
            this.schoolName = student.getSchool().getName();
            this.careerId = 0;
            this.careerName = "";
            this.cct = student.getSchool().getCct();
        } else if (student.getSchoolCareer() != null) {
            this.stateId = student.getSchoolCareer().getSchool().getCity().getState().getId();
            this.stateName = student.getSchoolCareer().getSchool().getCity().getState().getName();
            this.schoolId = student.getSchoolCareer().getSchool().getId();
            this.schoolName = student.getSchoolCareer().getSchool().getName();
            this.careerId = student.getSchoolCareer().getCareer().getId();
            this.careerName = student.getSchoolCareer().getCareer().getName();
            this.cct = student.getSchoolCareer().getSchool().getCct();
        }
        this.studentStatusId = student.getStatus();
        this.generation = student.getGeneration();
        this.enrollmentStartDate = student.getEnrollmentStartDate();
        this.enrollmentEndDate = student.getEnrollmentEndDate();
        this.isPortability= student.getIsPortability();
        this.partialCertificate =student.getPartialCertificate();
        this.abrogadoCertificate=student.getAbrogadoCertificate();
    }

    public StudentRecordData(Integer id, String curp, String name, String firstLastName, String secondLastName,
    String email, String enrollmentKey, Integer stateId, String stateName, Integer schoolId, String schoolName,
    Integer careerId, String careerName, String cct, Date enrollmentStartDate, Date enrollmentEndDate, Boolean studentStatusId,
    String generation, Boolean isPortability, Boolean partialCertificate, Boolean abrogadoCertificate) {
        this.id = id;
        this.curp = curp;
        this.name = name;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.email = email;
        this.enrollmentKey = enrollmentKey;
        this.stateId = stateId;
        this.stateName = stateName;
        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.careerId = careerId;
        this.careerName = careerName;
        this.cct = cct;
        this.enrollmentStartDate = enrollmentStartDate;
        this.enrollmentEndDate = enrollmentEndDate;
        this.studentStatusId = studentStatusId;
        this.generation = generation;
        this.isPortability = isPortability;
        this.partialCertificate = partialCertificate;
        this.abrogadoCertificate = abrogadoCertificate;
    }

}
