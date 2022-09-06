package mx.edu.cecyte.sisec.model.student.studentinfo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.student.StudentInfoDto;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "alumno_datos")
public class StudentInfo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @MapsId @JoinColumn(name = "alumno_id") private Student student;

    @Column(name = "fecha_update") private Date updateDate;
    @Column(name = "codigo_postal") private String postalCode;
    @Column(name = "numero_telefonico") private String phoneNumber;
    @Column(name = "compartir_informacion") private Boolean shareInformation;
    @Column(name = "continua_estudios") private Boolean continueStudies;
    @Column(name = "discapacidad") private String disability;
    @Column(name = "grupo_etnico") private String ethnicGroup;
    @Column(name = "idioma") private String language;
    @Column(name = "lengua") private String indigenousLangage;
    @Column(name = "institucion") private String futureSchool;
    @Column(name = "emprendimiento") private Boolean entrepreneurship;
    @Column(name = "emprendimiento_carrera") private Boolean entrepreneurshipCareer;
    @Column(name = "emprendimiento_derivado") private Boolean entrepreneurshipDerivated;
    @Column(name = "emprendimiento_estatus") private String entrepreneurshipStatus;
    @Column(name = "examen") private String exam;
    @Column(name = "hogar") private String home;
    @Column(name = "programa") private String program;

    public StudentInfo(Student student, StudentInfoDto studentInfoDto) {
        this.student = student;
        editStudentInfo(studentInfoDto);
    }


    public void editStudentInfo(StudentInfoDto studentInfoDto) {
        this.postalCode = studentInfoDto.getPostalCode();
        this.phoneNumber = studentInfoDto.getPhoneNumber();
        this.disability = studentInfoDto.getDisability();
        this.ethnicGroup = studentInfoDto.getEthnicGroup();
        this.indigenousLangage = studentInfoDto.getIndigenousLanguage();
        this.language = studentInfoDto.getLanguage();
        this.entrepreneurship = studentInfoDto.getEntrepreneurship();
        this.entrepreneurshipCareer = studentInfoDto.getEntrepreneurshipCareer();
        this.entrepreneurshipDerivated = studentInfoDto.getEntrepreneurshipDerivated();
        this.continueStudies = studentInfoDto.getContinueStudies();
        this.futureSchool = studentInfoDto.getFutureSchool();
        this.shareInformation = studentInfoDto.getShareInformation();
        this.entrepreneurshipStatus = studentInfoDto.getEntrepreneurshipStatus();
        this.exam = studentInfoDto.getExam();
        this.home = studentInfoDto.getHome();
        this.program = studentInfoDto.getProgram();
        this.updateDate = studentInfoDto.getUpdateDate();
    }
}
