package mx.edu.cecyte.sisec.model.reports;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "ciclo_escolar")
public class SchoolCycle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "nombre") private String name;
    @Column(name = "fecha_inicio") private Date start_date;
    @Column(name = "fecha_fin") private Date end_date;
}
