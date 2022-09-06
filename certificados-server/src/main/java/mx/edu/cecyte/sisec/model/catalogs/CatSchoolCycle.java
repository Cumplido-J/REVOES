package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "ciclogeneracion")
public class CatSchoolCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

    @Column(name = "generacion") private String generation;

    @Column(name = "estatus") private boolean status;
}
