package mx.edu.cecyte.sisec.model.lecture;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "carrera_uac")
public class LectureCareerAssociation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="semestre") private int semestre;
    @Column(name = "carrera_id") private int carrera_id;
    @Column(name = "uac_id") private int uac_id;
}
