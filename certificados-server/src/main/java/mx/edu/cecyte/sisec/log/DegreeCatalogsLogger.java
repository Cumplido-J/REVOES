package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;


public class DegreeCatalogsLogger {
    public static void getAntecedents(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAntecedents");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getReasons(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getReasons");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getAuths(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAuths");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getModalities(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getModalities");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getSigners(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSigners");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getSocialService(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSocialService");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getDegreeStates(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDegreeStates");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null": userSession.getUsername());
        log.error(error);
    }

    public static void getDegreeCarrer(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDegreeCarrer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null": userSession.getUsername());
        log.error(error);
    }

    public static void getDegreeSchools(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDegreeSchools");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getDegreeCarrers(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeCarrers");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void degreeAllStates(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeAllStates");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void schoolsNormalAll(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("schoolsNormalAll");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void careerAllDgp(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("careerAllDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void searSchoolDgp(Logger log, String message, UserSession userSession, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("searSchoolDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". schoolId: ").append(schoolId);
        log.error(error);
    }

    public static void studentPeriodDate(Logger log, String message, UserSession userSession, String studentCurp) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("studentPeriodDate");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". studentCurp: ").append(studentCurp);
        log.error(error);
    }

    public static void stateListAll(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append(" Mathod: ").append("stateListAll");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
}
