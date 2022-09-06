package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.competence.CompetenceData;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class CompetenceLogger {
    public static void addCompetencia( Logger log, String message, UserSession userSession, CompetenceData competenceData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addCompetencia");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Objeto recibido: ").append(competenceData);
        log.error(error);
    }
    public static void getAllCompetence(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllCompetence");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getCompetenceData(Logger log, String message, UserSession userSession,Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCompetenceData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Dato recibido: ").append(id);
        log.error(error);
    }
    public static void editCompetence(Logger log, String message, UserSession userSession,CompetenceData competenceData,Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editCompetence");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Dato recibido: ").append(id);
        error.append(". Objeto recibido: ").append(competenceData);
        log.error(error);
    }
    public static void moduleSearch(Logger log, String message, UserSession userSession,String searchText) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("moduleSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Texto recibido: ").append(searchText);
        log.error(error);
    }
}
