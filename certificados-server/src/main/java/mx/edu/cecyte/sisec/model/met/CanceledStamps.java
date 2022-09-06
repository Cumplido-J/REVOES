package mx.edu.cecyte.sisec.model.met;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.degree.CancelStampExternal;
import mx.edu.cecyte.sisec.model.catalogs.CatState;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "timbrados_cancelados")
public class CanceledStamps {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "fecha_registro") private Date registrationDate;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "entidad_id") private CatState state;

    @Column(name = "tipo") private Integer stampedType;
    @Column(name = "curp") private String curp;
    @Column(name = "folio") private String folio;
    @Column(name = "motivo") private String reason;
    @Column(name = "mensaje") private String meessage;
    @Column(name = "codigo") private String code;
    @Column(name = "ambiente") private String ambient;

    public void insertCanceledStamps(CatState state, CancelStampExternal cancel, Integer codigo, String mensaje) {
        this.registrationDate = new Date();
        this.state = state;
        this.stampedType = cancel.getStampedType();
        this.curp = cancel.getCurp();
        this.folio = cancel.getFolio();
        this.reason = cancel.getMotivo();
        this.meessage = mensaje;
        this.code = codigo.toString();
        this.ambient = cancel.isStateServer() ? "P" : "T";
    }
}
