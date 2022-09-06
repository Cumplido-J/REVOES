package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.Subject;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSubject {
    private Integer partialId;
    private Integer studentId;
    private String cct;
    private Integer subjectTypeId;
    private String subjectType;
    private String name;
    private String score;
    private String hours;
    private String credits;
    private String period;
    private Integer semester;

    public StudentSubject(StudentSubjectPartial subject) {
        this.partialId = subject.getId();
        this.studentId = subject.getStudent().getId();
        this.cct = subject.getCct();
        this.subjectTypeId = subject.getSubjectType().getId();
        this.subjectType = subject.getSubjectType().getName();
        this.name = subject.getName();
        this.score = subject.getScore();
        this.hours = subject.getHours();
        this.credits = subject.getCredits();
        this.period = subject.getScholarPeriod();
        this.semester = subject.getPeriodNumber();
    }

    public StudentSubject(Student student, Subject subject) {
        this.cct = student.getSchoolCareer().getSchool().getCct();
        this.subjectTypeId = subject.getSubjectType().getId();
        this.subjectType = subject.getSubjectType().getName();
        this.name = subject.getName();
        this.score = "0";
        this.hours = subject.getHours().toString();
        this.credits = subject.getCredits().toString();
        this.period = "";
        this.semester = subject.getSemester();
    }

    public StudentSubject(Student student, CareerModule careerModule, boolean cecyte) {
        this.cct = student.getSchoolCareer().getSchool().getCct();
        if (cecyte) {
            this.subjectTypeId = 4;
            this.subjectType = "Profesional extendida";
            this.semester = careerModule.getOrder() + 1;
        } else {
            this.subjectTypeId = 4;
            this.subjectType = "Profesional básica";
            if (careerModule.getOrder() == 1 || careerModule.getOrder() == 2) this.semester = 3;
            if (careerModule.getOrder() == 3 || careerModule.getOrder() == 4) this.semester = 4;
            if (careerModule.getOrder() == 5 || careerModule.getOrder() == 6) this.semester = 5;
            if (careerModule.getOrder() == 7 || careerModule.getOrder() == 8) this.semester = 6;
        }
        this.name = careerModule.getModule().getModule();
        this.score = "0";
        this.hours = careerModule.getHours().toString();
        this.credits = careerModule.getCredits().toString();
        this.period = "";


    }
}
