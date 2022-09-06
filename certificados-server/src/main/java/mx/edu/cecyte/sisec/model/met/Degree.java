package mx.edu.cecyte.sisec.model.met;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.classes.degree.ExcelRowDegree;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "titulo")
public class Degree {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;

    @Column(name = "estatus") private String status;
    @Column(name = "nombre_archivo") private String fileName;
    @Column(name = "met_lote") private Integer batchNumber;
    @Column(name = "folio") private String folio;
    @Column(name = "estado_timbrado") private String typeStamp;
    @Column(name = "excel_estatus") private Integer excelStatus;
    @Column(name = "excel_mensaje") private String excelMessage;
    @Column(name = "fechasep") private String dateSep;

    public Degree(Student student) {
        this.student = student;
        this.status = DegreeStatus.validated;
    }

    public void updateExcelResult(ExcelRowDegree excelRow) {
        this.excelMessage = excelRow.getMessage();
        this.excelStatus = excelRow.getStatus();
        this.status = excelRow.getStatus() == 1 ? DegreeStatus.degreed : DegreeStatus.error;
        this.folio = excelRow.getFolio();
    }

    public void setInProcess(Integer mecBatchNumber, MetCredentials metCredentials) {
        this.status = DegreeStatus.inProcess;
        this.batchNumber = mecBatchNumber;
        this.typeStamp = metCredentials.getValidated().equals("0") ? "T" : "P";
    }

    public void cancel() {
        this.status = DegreeStatus.canceled;
    }
}
