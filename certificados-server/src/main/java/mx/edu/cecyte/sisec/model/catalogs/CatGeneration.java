package mx.edu.cecyte.sisec.model.catalogs;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "cat_generacion")
public class CatGeneration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "generacion") private String generation;

    @OneToMany(mappedBy = "generation") Set<ConfigPeriodCertificate> configPeriodCertificates;
}
