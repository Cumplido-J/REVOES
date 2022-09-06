package mx.edu.cecyte.sisec.log;
import mx.edu.cecyte.sisec.dto.people.PersonaData;
import mx.edu.cecyte.sisec.dto.school.SchoolData;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class PersonaLogger {

    public static void addNewPersona(Logger log, String message, UserSession userSession, PersonaData personaData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewPersona");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Persona data: ").append(personaData);
        log.error(error);
    }
    public static void getAllPersona(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllPersona");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        //error.append(". Stateid: ").append(stateid);
        log.error(error);
    }
    public static void editPersona(Logger log, String message, UserSession userSession, PersonaData personaData, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editPersona");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        error.append(". Persona data: ").append(personaData);
        log.error(error);
    }

    public static void getPersonaData(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getPersonaData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }
    public static void getDeleteData(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDelete");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }
}
