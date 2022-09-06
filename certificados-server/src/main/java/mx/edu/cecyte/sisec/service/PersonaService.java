package mx.edu.cecyte.sisec.service;



import mx.edu.cecyte.sisec.dto.people.PersonaData;
import mx.edu.cecyte.sisec.dto.people.PersonaList;
import mx.edu.cecyte.sisec.dto.school.SchoolData;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.repo.people.PersonaRepository;
import mx.edu.cecyte.sisec.model.people.Persona;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.PersonaSearchQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PersonaService {
    @Autowired private UserQueries userQueries;
    @Autowired private PersonaSearchQueries personaSearchQueries;
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private PersonaRepository personaRepository;
    public PersonaData addNewPersona(PersonaData personaData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);

        boolean curpExists = personaSearchQueries.curpExists(personaData.getCurp());
        if (curpExists) throw new AppException(Messages.persona_Exite);

        Persona persona = personaSearchQueries.addNewPersona(personaData);
        auditingQueries.saveAudit("PersonaService", "addNewPersona", adminId, Persona.class, persona.getId(), "Added new persona, " + personaData);
        return new PersonaData(persona);
    }
    public List<PersonaList> getAllPersona(Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        if (!userQueries.isDevAdmin(userAdmin)) throw new AppException("No tienes permiso para ver los registros");
        List<PersonaList> listado = new ArrayList<>();
            listado = personaSearchQueries.getPersonas();
        return listado;
    }
    public PersonaData editPersona(PersonaData personaData, String curp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Persona persona = personaSearchQueries.getPersonaByCurp(curp);

        //boolean isStateAvailableForAdmin = userQueries.isStateAvailableForAdmin(adminUser, schoolData.getCityId());
        //if (!isStateAvailableForAdmin) throw new AppException(Messages.state_noEditPermissions);

        if (!curp.equalsIgnoreCase(personaData.getCurp())) {
            if (userQueries.isDevAdmin(adminUser)) {
                boolean curpExists = personaSearchQueries.curpExists(personaData.getCurp());
                if (curpExists) throw new AppException(Messages.persona_curpIsInUse);
            } else {
                personaData.setCurp(curp);
            }
        }

        persona = personaSearchQueries.editPersona(persona, personaData);
        auditingQueries.saveAudit("PersonaService", "editPersona", adminId, Persona.class, persona.getId(), "Edited persona, " + personaData);
        return new PersonaData(persona);
    }
    public Persona editPersonaDuplicatedUser(PersonaData personaData, String curp) {

        Persona persona = personaSearchQueries.getPersonaByCurpByUser(curp);
        if (persona!= null){
            if (!curp.equalsIgnoreCase(personaData.getCurp())) {
                    boolean curpExists = personaSearchQueries.curpExists(personaData.getCurp());
                    if (curpExists) throw new AppException(Messages.persona_curpIsInUse);
            }
        }

        persona = personaSearchQueries.editPersonaUser(persona, personaData);
        return persona;
    }

    public PersonaData getPersonaData(String curp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Persona persona = personaSearchQueries.getPersonaByCurp(curp);

        return new PersonaData(persona);
    }
    public void deleteData(String curp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Persona persona = personaSearchQueries.getPersonaByCurp(curp);
        personaSearchQueries.deleteData(persona.getId());

    }
}
