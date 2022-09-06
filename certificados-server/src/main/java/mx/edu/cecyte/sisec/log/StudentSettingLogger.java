package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class StudentSettingLogger {
    public static void selectUserRole(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("selectUserRole");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }

    public static void assignRole(Logger log, String message, UserSession userSession, Integer studentId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("assignRole");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentId: ").append(studentId);
        log.error(error);
    }
}
