package mx.edu.cecyte.sisec.model.student;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.student.StudentData;
import mx.edu.cecyte.sisec.dto.student.StudentSemesters;
import mx.edu.cecyte.sisec.model.SurveyIntentions2021;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.met.DegreeData;
import mx.edu.cecyte.sisec.model.student.studentinfo.StudentInfo;
import mx.edu.cecyte.sisec.model.subjects.StudentScore;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.survey2020.SurveyGraduated2020;
import mx.edu.cecyte.sisec.model.survey2020.SurveyIntentions2020;
import mx.edu.cecyte.sisec.model.survey2021.SurveyGraduated2021;
import mx.edu.cecyte.sisec.model.survey2022.SurveyGraduated2022;
import mx.edu.cecyte.sisec.model.survey2022.SurveyIntentions2022;
import mx.edu.cecyte.sisec.model.users.User;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "alumno")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "usuario_id") private User user;

    @Column(name = "matricula") private String enrollmentKey;
    @Column(name = "periodo_inicio") private Date enrollmentStartDate;
    @Column(name = "periodo_termino") private Date enrollmentEndDate;
    @Column(name = "generacion") private String generation;
    @Column(name = "calificacion") private Double finalScore;
    @Column(name = "creditos_obtenidos") private Integer obtainedCredits;
    @Column(name = "reprobado") private Boolean reprobate;
    @Column(name = "es_bach_tec") private Boolean isPortability;
    @Column(name = "semestre") private Integer semester;
    @Column(name = "aviso_privacidad_aceptado") private Boolean noticeOfPrivacyAccepted;
    @Column(name = "alumno_estatus") private Boolean status;
    @Column(name = "certificado_parcial") private Boolean partialCertificate;
    @Column(name="genero") private String gender;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_carrera_id") private SchoolCareer schoolCareer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private StudentInfo studentInfo;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private SurveyIntentions2020 surveyIntentions2020;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private SurveyIntentions2021 surveyIntentions2021;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private SurveyIntentions2022 surveyIntentions2022;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private SurveyGraduated2020 surveyGraduated2020;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private SurveyGraduated2021 surveyGraduated2021;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "student") private SurveyGraduated2022 surveyGraduated2022;
    @OneToMany(mappedBy = "student") Set<StudentCareerModule> studentCareerModules;
    @OneToMany(mappedBy = "student") Set<Certificate> certificates;
    @OneToMany(mappedBy = "student") Set<StudentScore> studentScores;
    @OneToMany(mappedBy = "student") Set<StudentSubjectPartial> subjects;
    @Column(name = "abrogado") private Boolean abrogadoCertificate;
    @OneToMany(mappedBy = "student") Set<DegreeData> degreeData;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "competencia_disciplinar") private CatDisciplinaryField disciplinaryField;

    public Student(StudentData studentData, User user, SchoolCareer schoolCareer) {
        this.user = user;
        this.enrollmentKey = studentData.getEnrollmentKey();
        this.enrollmentStartDate = studentData.getEnrollmentStartDate();
        this.enrollmentEndDate = studentData.getEnrollmentEndDate();
        this.generation = studentData.getGeneration();
        this.reprobate = false;
        this.isPortability = false;
        this.semester = 6;
        this.noticeOfPrivacyAccepted = false;
        this.status = studentData.getStudentStatusId();
        this.schoolCareer = schoolCareer;
        this.partialCertificate = false;
    }

    public void editStudentData(StudentData studentData, String newPassword, SchoolCareer schoolCareer) {
        this.user.editUser(studentData, newPassword);
        this.enrollmentKey = studentData.getEnrollmentKey();
        this.enrollmentStartDate = studentData.getEnrollmentStartDate();
        this.enrollmentEndDate = studentData.getEnrollmentEndDate();
        this.generation = studentData.getGeneration();
        this.status = studentData.getStudentStatusId();
        this.schoolCareer = schoolCareer;
        this.user.setStatus(studentData.getStudentStatusId() ? 1 : 0);
    }

    public void editStudentSubjects(StudentSemesters semesters, List<StudentSubjectPartial> subjects) {
        this.obtainedCredits = semesters.getObtainedCredits();
        this.partialCertificate = true;
        this.finalScore = semesters.getFinalScore();
        this.subjects = new HashSet<>(subjects);
    }

    public void editStudentSubjects( Integer obtainedCredits, Double finalScore) {
        this.obtainedCredits = obtainedCredits;
        this.partialCertificate = true;
        this.finalScore = finalScore;
        //this.subjects = new HashSet<>(subjects);
    }
    public void editStatus(Boolean status){
        this.status=status;
    }

    public void editPeriodCertificate(Student student) {
        this.user = student.getUser();
        this.finalScore = student.getFinalScore();
        this.reprobate = student.getReprobate();
        this.semester = 6;
        this.enrollmentEndDate = student.getEnrollmentEndDate();
        this.enrollmentStartDate = student.getEnrollmentStartDate();
        this.generation = student.getGeneration();
    }
}
