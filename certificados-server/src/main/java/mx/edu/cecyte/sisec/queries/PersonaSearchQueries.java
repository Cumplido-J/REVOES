package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.catalogs.CargoCatalog;
import mx.edu.cecyte.sisec.dto.people.PersonaData;
import mx.edu.cecyte.sisec.dto.people.PersonaList;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.people.Persona;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.people.PersonaRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

///Este llama  a repository
@Service
public class PersonaSearchQueries {
    @Autowired private EntityManager entityManager;
    @Autowired private PersonaRepository personaRepository;
    @Autowired private StateRepository stateRepository;
    public boolean curpExists(String curp) {
        return personaRepository.countByCurp(curp) > 0;
    }

    public Persona addNewPersona(PersonaData personaData) {
        CatState state = stateRepository.findById(personaData.getStateId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        Persona persona = new Persona(personaData,state);
        return personaRepository.save(persona);
    }
///codigo funcional
    public List<PersonaList> getPersonas() {
        /*List<PersonaList> result = new ArrayList<>();
        List<Persona> personas = personaRepository.findAll();
        for(Persona persona: personas){
            Integer personaId = persona.getId();
            String curp = persona.getCurp();
            String rfc = persona.getRfc();
            String nombre = persona.getName();
            String paterno = persona.getApe1();
            String materno = persona.getApe2();
            //Integer idestado = persona.getStateId();
            Integer idestado = persona.getState().getId();
            result.add(new PersonaList(personaId,rfc,curp,nombre,paterno,materno,idestado));
        }
        return result;*/
        return personaRepository.findAll()
                .stream().map(persona -> new PersonaList(persona.getId(), persona.getRfc(), persona.getCurp(),
                persona.getName(),persona.getApe1(),persona.getApe2(),persona.getState().getName()))
                .collect(Collectors.toList());
    }
    public Persona editPersona(Persona persona, PersonaData personaData) {
        CatState state = stateRepository.findById(personaData.getStateId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        persona.editPersonaData(personaData,state);
        return personaRepository.save(persona);
    }

    public Persona editPersonaUser(Persona persona, PersonaData personaData) {
        CatState state = stateRepository.findById(personaData.getStateId()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        if (persona!=null) {
            persona.editPersonaData(personaData, state);
        }
        Persona persona1 = new Persona(personaData,state);
        persona = persona !=null ? persona :persona1;
        return personaRepository.save(persona);
    }
    public Persona getPersonaById(Integer personaId) {
        return personaRepository.findById(personaId).orElseThrow(() -> new AppException(Messages.persona_doesntExist));
    }
    public Persona getPersonaByCurp(String curp) {
        return personaRepository.findByCurp(curp).orElseThrow(() -> new AppException(Messages.persona_curpdoesntExist));
    }

    public Persona getPersonaByCurpByUser(String curp) {
        return personaRepository.findByCurp(curp).orElse(null);
    }

    public void deleteData(Integer id){
        personaRepository.deleteById(id);
    }
}
