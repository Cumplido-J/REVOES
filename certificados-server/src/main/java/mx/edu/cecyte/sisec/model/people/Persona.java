package mx.edu.cecyte.sisec.model.people;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.people.PersonaData;
import mx.edu.cecyte.sisec.model.catalogs.CatState;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "administrador_titulacion")
public class Persona {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;
    @Column(name = "curp") private String curp;
    @Column(name = "rfc") private String rfc;
    @Column(name = "nombre") private String name;
    @Column(name = "apellido_p") private String ape1;
    @Column(name = "apellido_m") private String ape2;
    @Column(name = "status_id") private int statusId;
    @Column(name = "cargo_id") private int cargoId;
    @Column(name = "genero") private String sexo;
    //@Column(name = "estado_id") private int stateId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "estado_id") private CatState state;
    public Persona(PersonaData personaData,CatState state) {
        this.curp = personaData.getCurp();
        this.rfc = personaData.getRfc();
        this.name = personaData.getName();
        this.ape1 = personaData.getApe1();
        this.ape2 = personaData.getApe2();
        //this.stateId = personaData.getStateId();
        this.state = state;
        this.statusId = personaData.getStatusId()== 1 ? 1: 0;
        this.cargoId = personaData.getCargoId();
        this.sexo = personaData.getSexo();
    }
    public void editPersonaData(PersonaData personaData,CatState state) {
        this.curp = personaData.getCurp();
        this.rfc = personaData.getRfc();
        this.name =personaData.getName();
        this.ape1 = personaData.getApe1();
        this.ape2 = personaData.getApe2();
        //this.stateId = personaData.getStateId();
        this.state = state;
        this.statusId = personaData.getStatusId()== 1 ? 1: 0;
        this.cargoId = personaData.getCargoId();
        this.sexo =personaData.getSexo();
    }

}
