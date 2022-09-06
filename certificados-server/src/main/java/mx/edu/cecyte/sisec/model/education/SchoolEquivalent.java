package mx.edu.cecyte.sisec.model.education;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.school.SchoolEquivalentData;
import mx.edu.cecyte.sisec.model.catalogs.CatCity;

import javax.persistence.*;

@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "plantel_equivalencia")
public class SchoolEquivalent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plantel_id") private School school;
    @Column(name = "cct") private String cct;
    @Column(name = "pdf_nombre") private String pdfName;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "municipio_id") private CatCity city;

    @Column(name = "genero") private Integer gender;

    public  SchoolEquivalent() {}

    public SchoolEquivalent(SchoolEquivalentData schoolData, School school, CatCity city){
        this.school = school;
        this.cct = schoolData.getCct();
        this.pdfName = schoolData.getPdfName();
        this.city = city;
        this.gender = schoolData.getGender();
    }

    public void SchoolEquivalent(SchoolEquivalentData schoolData, School school, CatCity city) {
        this.school = school;
        this.cct = schoolData.getCct();
        this.pdfName = schoolData.getPdfName();
        this.city = city;
        this.gender = schoolData.getGender();
    }
}
