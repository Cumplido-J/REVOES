package mx.edu.cecyte.sisec.dto.people;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.user.UserData;
import mx.edu.cecyte.sisec.model.people.Persona;

@Data
@Builder
//@NoArgsConstructor
@AllArgsConstructor
public class PersonaData {
    private String curp;
    private String rfc;
    private String name;
    private String ape1;
    private String ape2;
    private Integer stateId;
    private int statusId;
    private int cargoId;
    private String sexo;
    public PersonaData(Persona persona){
        this.curp=persona.getCurp();
        this.rfc=persona.getRfc();
        this.name=persona.getName();
        this.ape1=persona.getApe1();
        this.ape2=persona.getApe2();
        //this.stateId=persona.getStateId();
        this.stateId=persona.getState().getId();
        this.statusId=persona.getStatusId() == 1 ? 1: 2;
        this.cargoId=persona.getCargoId();
    }

    public PersonaData( UserData userData ){
        this.curp=userData.getUsername();
        this.rfc=userData.getRfc();
        this.name=userData.getName();
        this.ape1=userData.getFirstLastName();
        this.ape2=userData.getSecondLastName();
        //this.stateId=persona.getStateId();
        this.stateId=userData.getStateId();
        this.statusId=1;
        this.cargoId=userData.getCargoIdTitulo();
        this.sexo = userData.getSexo() == 1 ? "H":"M"  ;
    }
}
