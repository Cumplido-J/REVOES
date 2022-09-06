package mx.edu.cecyte.sisec.model.mec;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.classes.ExcelRowMec;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "certificado")
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;

    @Column(name = "tipo_certificado_id") private Integer certificateTypeId;

    @Column(name = "estatus") private String status;
    @Column(name = "nombre_archivo") private String fileName;
    @Column(name = "mec_lote") private Integer mecBatchNumber;
    @Column(name = "folio") private String folio;
    @Column(name = "excel_estatus") private Integer excelStatus;
    @Column(name = "excel_mensaje") private String excelMessage;
    @Column(name = "fechasep") private String dateSep;
    @Column(name = "origen") private String origin;

    public Certificate(Student student, Integer certificateTypeId) {
        this.student = student;
        this.status = CertificateStatus.validated;
        this.certificateTypeId = certificateTypeId;
    }

    public void updateExcelResult(ExcelRowMec excelRow) {
        this.excelMessage = excelRow.getMessage();
        this.excelStatus = excelRow.getStatus();
        this.status = excelRow.getStatus() == 1 ? CertificateStatus.certified : CertificateStatus.error;
    }

    public void setInProcess(Integer mecBatchNumber) {
        this.status = CertificateStatus.inProcess;
        this.mecBatchNumber = mecBatchNumber;
    }

    public void cancel() {
        this.status = CertificateStatus.canceled;
    }
}
