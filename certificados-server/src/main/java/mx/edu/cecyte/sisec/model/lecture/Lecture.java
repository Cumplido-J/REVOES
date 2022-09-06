package mx.edu.cecyte.sisec.model.lecture;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "uac")
public class Lecture {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="nombre") private String nombre;
    @Column(name = "clave_uac") private String clave_uac;
    @Column(name = "md") private int md;
    @Column(name = "ei") private int ei;
    @Column(name = "horas") private int horas;
    @Column(name = "creditos") private int creditos;
    @Column(name = "semestre") private int semestre;
    @Column(name = "optativa") private String optativa;
    @Column(name = "campo_disciplinar_id") private int campo_disciplinar_id;
    @Column(name = "tipo_uac_id") private int tipo_uac_id;
    @Column(name = "cecyte") private String cecyte;
    @Column(name = "modulo_id") private int modulo_id;
}
