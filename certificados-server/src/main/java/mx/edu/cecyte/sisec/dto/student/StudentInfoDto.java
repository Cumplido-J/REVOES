package mx.edu.cecyte.sisec.dto.student;

import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.studentinfo.StudentInfo;

import java.util.Date;

@Data
@NoArgsConstructor
public class StudentInfoDto {

    private String postalCode;
    private String phoneNumber;
    private String disability;
    private String ethnicGroup;
    private String indigenousLanguage;
    private String language;
    private Boolean entrepreneurship;
    private Boolean entrepreneurshipCareer;
    private Boolean entrepreneurshipDerivated;
    private Boolean continueStudies;
    private String futureSchool;
    private Boolean shareInformation;
    private String entrepreneurshipStatus;
    private String exam;
    private String home;
    private String program;

    private String email;
    private Date updateDate;

    public StudentInfoDto(Student student) {

        this.email = student.getUser().getEmail();
        StudentInfo studentInfo = student.getStudentInfo();
        if (studentInfo == null) return;
        this.postalCode = studentInfo.getPostalCode();
        this.phoneNumber = studentInfo.getPhoneNumber();
        this.disability = studentInfo.getDisability();
        this.ethnicGroup = studentInfo.getEthnicGroup();
        this.indigenousLanguage = studentInfo.getIndigenousLangage();
        this.language = studentInfo.getLanguage();
        this.entrepreneurship = studentInfo.getEntrepreneurship();
        this.entrepreneurshipCareer = studentInfo.getEntrepreneurshipCareer();
        this.entrepreneurshipDerivated = studentInfo.getEntrepreneurshipDerivated();
        this.continueStudies = studentInfo.getContinueStudies();
        this.futureSchool = studentInfo.getFutureSchool();
        this.shareInformation = studentInfo.getShareInformation();
        this.entrepreneurshipStatus = studentInfo.getEntrepreneurshipStatus();
        this.exam = studentInfo.getExam();
        this.home = studentInfo.getHome();
        this.program = studentInfo.getProgram();
        this.updateDate = studentInfo.getUpdateDate();
    }
}
