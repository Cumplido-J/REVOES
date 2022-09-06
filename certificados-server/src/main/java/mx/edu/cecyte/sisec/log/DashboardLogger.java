package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class DashboardLogger {
    public static void getTotal(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getTotal");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getTotal2(Logger log, String message, UserSession userSession,String question) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getTotal");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append("Pregunta ").append(question);
        log.error(error);
    }
    public static void getMexicoReport(Logger log, String message, UserSession userSession, Integer surveyType) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getMexicoReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyType: ").append(surveyType);
        log.error(error);
    }
    public static void getNew(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getNew");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
}
