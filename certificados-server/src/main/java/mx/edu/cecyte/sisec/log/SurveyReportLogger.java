package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class SurveyReportLogger {
    public static void getCountryReport(Logger log, String message, UserSession userSession, Integer surveyType) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCountryReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyType: ").append(surveyType);
        log.error(error);
    }

    public static void getStateReport(Logger log, String message, UserSession userSession, Integer surveyType, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStateReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyType: ").append(surveyType);
        error.append(". StateId: ").append(stateId);
        log.error(error);
    }

    public static void getSchoolReport(Logger log, String message, UserSession userSession, Integer surveyType, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSchoolReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyType: ").append(surveyType);
        error.append(". SchoolId: ").append(schoolId);
        log.error(error);
    }

    public static void getStateReportAnswer(Logger log, String message, UserSession userSession, Integer surveyType, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStateReportAnswer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyType: ").append(surveyType);
        error.append(". StateId: ").append(stateId);
        log.error(error);
    }
    public static void getStateReportAnswerGraduated(Logger log, String message, UserSession userSession, Integer surveyType, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStateReportAnswerGraduated");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyType: ").append(surveyType);
        error.append(". StateId: ").append(stateId);
        log.error(error);
    }
    public static void getAnswerGraduated(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAnswerGraduated");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }
}
