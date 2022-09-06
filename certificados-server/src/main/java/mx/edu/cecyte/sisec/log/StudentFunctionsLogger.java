package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class StudentFunctionsLogger {

    public static void acceptPrivacy(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("acceptPrivacy");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void updateStudentCareer(Logger log, String message, UserSession userSession, Integer schoolCareerId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("updateStudentCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SchoolCareerId: ").append(schoolCareerId);
        log.error(error);
    }

    public static void getAvailableSchoolCareer(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAvailableSchoolCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
}
