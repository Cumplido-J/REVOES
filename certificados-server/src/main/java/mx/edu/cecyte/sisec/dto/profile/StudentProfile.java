package mx.edu.cecyte.sisec.dto.profile;

import lombok.Data;
import mx.edu.cecyte.sisec.model.student.Student;

import java.util.Date;

@Data
public class StudentProfile {
    private String enrollmentKey;
    private Boolean noticeOfPrivacyAccepted;
    private String cct;
    private String schoolName;
    private String careerName;
    private String careerKey;
    private String state;
    private String city;
    private Date lastUpdateInfo;

    public StudentProfile(Student student) {
        this.enrollmentKey = student.getEnrollmentKey();
        this.noticeOfPrivacyAccepted = student.getNoticeOfPrivacyAccepted();
        if (student.getSchoolCareer() != null) {
            this.cct = student.getSchoolCareer().getSchool().getCct();
            this.schoolName = student.getSchoolCareer().getSchool().getName();
            this.careerName = student.getSchoolCareer().getCareer().getName();
            this.careerKey = student.getSchoolCareer().getCareer().getCareerKey();
            this.state = student.getSchoolCareer().getSchool().getCity().getState().getName();
            this.city = student.getSchoolCareer().getSchool().getCity().getName();
        } else if (student.getSchool() != null) {
            this.cct = student.getSchool().getCct();
            this.schoolName = student.getSchool().getName();
            this.state = student.getSchool().getCity().getState().getName();
            this.city = student.getSchool().getCity().getName();
        }
        if (student.getStudentInfo() != null) {
            this.lastUpdateInfo = student.getStudentInfo().getUpdateDate();
        }
    }
}
