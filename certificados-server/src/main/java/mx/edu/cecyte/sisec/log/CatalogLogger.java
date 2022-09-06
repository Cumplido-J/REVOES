package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class CatalogLogger {
    public static void getStateCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStateCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getSchoolCatalogs(Logger log, String message, UserSession userSession, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSchoolCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". State Id: ").append(stateId);
        log.error(error);
    }

    public static void getCareerCatalogs(Logger log, String message, UserSession userSession, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCareerCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". School Id: ").append(schoolId);
        log.error(error);
    }

    public static void getCareerCatalogsByState(Logger log, String message, UserSession userSession, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCareerCatalogsByState");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". State Id: ").append(stateId);
        log.error(error);
    }

    public static void getCityCatalogs(Logger log, String message, UserSession userSession, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCityCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". State Id: ").append(stateId);
        log.error(error);
    }

    public static void getAllCareersCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllCareersCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getModulesByCareer(Logger log, String message, UserSession userSession, Integer careerId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllCareersCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CareerId: ").append(careerId);
        log.error(error);
    }
    public static void getCargosCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCargosCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getRoleUser(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getRoleUser");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    
    public static void getPersonalRole(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getPersonalRole");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getPerfilCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getPerfilCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getEstudioCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getEstudioCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getDiciplinarCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDiciplinarCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getSubjectCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSubjectCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getCompetencias(Logger log, String message, UserSession userSession,String careerKey) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCompetencias");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". clave recibido: ").append(careerKey);
        log.error(error);
    }

    public static void getCompetenciaCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCompetenciaCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getSubjectType(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSubjectType");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getDiciplinaryCompentenceCatalogs(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDiciplinaryCompentenceCatalogs");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getAllGroups(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllGroups");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getAllPermissions(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllPermissions");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getAllRole(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllRole");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void  getSchoolCycle(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append(" getSchoolCycle");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void selectPeriodFinished(Logger log, String message, UserSession userSession, Integer stateId, String generationId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("selectPeriodFinished");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StateId: ").append(stateId);
        error.append(". GenerationId: ").append(generationId);
        log.error(error);
    }
}
