package mx.edu.cecyte.sisec.dto.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.model.student.Student;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudentSemesters {
    private Integer credits;
    private Integer obtainedCredits;
    private Double finalScore;
    private List<StudentSubject> subjects;
    private List<Catalog> optionals;

    public StudentSemesters(Student student, List<StudentSubject> subjects, List<Catalog> optionals) {
        this.credits = student.getSchoolCareer().getCareer().getTotalCredits();
        this.obtainedCredits = student.getObtainedCredits();
        this.finalScore = student.getFinalScore();
        this.subjects = subjects;
        this.optionals = optionals;
    }

    public StudentSemesters(Student student, List<Catalog> optionals) {
        this.credits = student.getSchoolCareer().getCareer().getTotalCredits();
        this.obtainedCredits = student.getObtainedCredits();
        this.finalScore = student.getFinalScore();
        this.subjects = new ArrayList<>();
        this.optionals = optionals;
    }

}
