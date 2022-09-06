package mx.edu.cecyte.sisec.model.education;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.school.SchoolData;
import mx.edu.cecyte.sisec.model.catalogs.CatCity;
import mx.edu.cecyte.sisec.model.catalogs.CatEducationalOption;
import mx.edu.cecyte.sisec.model.catalogs.CatIems;
import mx.edu.cecyte.sisec.model.catalogs.CatSchoolType;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial;
import mx.edu.cecyte.sisec.model.users.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "plantel")
public class School {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "cct") private String cct;
    @Column(name = "fecha_sinems") private Date sinemsDate;
    @Column(name = "pdfNombre") private String pdfName;
    @Column(name = "pdfNumero") private String pdfNumber;
    @Column(name = "nombre_final") private String pdfFinalName;
    @Column(name = "estatus") private int status;
    @Column(name = "latitud") private Float latitude;
    @Column(name = "longitud") private Float longitude;

    @OneToMany(mappedBy = "school") Set<SchoolCareer> schoolCareers;
    //@OneToMany(mappedBy = "school") Set<SchoolControlAdmin> schoolControlAdmins;
    //@OneToMany(mappedBy = "school") Set<GraduateTracingAdmin> graduateTracingAdmins;
    @OneToMany(mappedBy = "school") Set<Student> students;
    @OneToMany(mappedBy = "school") Set<StudentRecordPartial> studentRecordPartials;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "municipio_id") private CatCity city;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tipo_plantel_id") private CatSchoolType schoolType;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "iems_id") private CatIems iems;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "opcion_educativa_id")
    private CatEducationalOption educationalOption;

    //@OneToMany(mappedBy = "school") Set< PlaneacionAdmin > planeacionAdmins;


    @OneToOne(fetch = FetchType.LAZY, mappedBy = "school") private SchoolEquivalent schoolEquivalents;
        
    @OneToMany(mappedBy = "school") Set< ScopeDetail > scopeDetails;

    public School(SchoolData schoolData, CatCity city, CatSchoolType schoolType, CatIems iems, CatEducationalOption educationalOption) {
        this.cct = schoolData.getCct();
        this.name = schoolData.getName();
        this.sinemsDate = schoolData.getSinemsDate();
        this.iems = iems;
        this.educationalOption = educationalOption;
        this.city = city;
        this.schoolType = schoolType;
        this.status = schoolData.getStatus() == 1 ? 1: 0;
    }

    public void editSchoolData(SchoolData schoolData, CatCity city, CatSchoolType schoolType, CatIems iems, CatEducationalOption educationalOption) {
        this.cct = schoolData.getCct();
        this.name = schoolData.getName();
        this.sinemsDate = schoolData.getSinemsDate();
        this.iems = iems;
        this.educationalOption = educationalOption;
        this.city = city;
        this.schoolType = schoolType;
        this.status = schoolData.getStatus() == 1 ? 1: 0;
    }
}
