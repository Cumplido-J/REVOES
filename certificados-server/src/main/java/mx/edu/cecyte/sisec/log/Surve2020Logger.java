package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2020Request;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class Surve2020Logger {
    public static void saveSurvey(Logger log, String message, UserSession userSession, SurveyGraduated2020Request surveyRequest) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("saveSurvey");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SurveyRequest: ").append(surveyRequest);
        log.error(error);
    }

    public static void getInfoFromFolio(Logger log, String message, String confirmationFolio) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getInfoFromFolio");
        error.append(". Error: ").append(message);
        error.append(". Folio: ").append(confirmationFolio);
        log.error(error);
    }
}
