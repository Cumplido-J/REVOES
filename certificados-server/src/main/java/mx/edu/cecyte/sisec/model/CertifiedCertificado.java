package mx.edu.cecyte.sisec.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.model.student.Student;

import javax.persistence.*;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "certificado")
public class CertifiedCertificado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumno_id") private Student student;

    @Column(name = "tipo_certificado_id") private Integer typeCertified;

    @Column(name = "estatus") private String status;
    @Column(name = "nombre_archivo") private String nameFile;
    @Column(name = "mec_lote") private Integer meLot;
    @Column(name = "folio") private String folio;
    @Column(name = "excel_estatus") private Integer excelStatus;
    @Column(name = "excel_mensaje") private  String excelMsg;
}
