package mx.edu.cecyte.sisec.model.siged;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "certificadosindependientes")
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "folio") private String folio;
    @Column(name = "nombre") private String  nombreCompleto;
    @Column(name = "curp") private String curp;
    @Column(name = "tipo") private String tipoCertificado;
    @Column(name = "estatus") private String estatus;
    @Column(name = "numcontrol") private String numcontrol;
    @Column(name = "emisora") private String emisora;
    @Column(name = "planestudio") private String planestudio;
    @Column(name = "cct") private String cct;
    @Column(name = "promedio") private Double promedio;
    @Column(name = "fecha_reg") private String fechaCertificado;
    @Column(name = "fechaemision") private String fechaEmision;
    @Column(name = "entidad") private String entidad;
    @Column(name = "promedioletra") private String promedioText;
    @Column(name = "genero") private String genero;
    @Column(name = "nomplantel") private String institucion;
}
