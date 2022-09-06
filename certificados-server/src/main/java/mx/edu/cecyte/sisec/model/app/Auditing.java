package mx.edu.cecyte.sisec.model.app;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "auditoria")
public class Auditing {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "fecha") private Date date;
    @Column(name = "clase") private String classCaller;
    @Column(name = "metodo") private String methodCaller;
    @Column(name = "usuario_id") private Integer userIdCaller;
    @Column(name = "tabla") private String affectedTable;
    @Column(name = "tabla_id") private Integer affectedTableId;
    @Column(name = "descripcion") private String description;

    public Auditing(String classCaller, String methodCaller, Integer userIdCaller, String affectedTable, Integer affectedTableId, String description) {
        this.classCaller = classCaller;
        this.methodCaller = methodCaller;
        this.userIdCaller = userIdCaller;
        this.affectedTable = affectedTable;
        this.affectedTableId = affectedTableId;
        this.description = description;
    }
}
