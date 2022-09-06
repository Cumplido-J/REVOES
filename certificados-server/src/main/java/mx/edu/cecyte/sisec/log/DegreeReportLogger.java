package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class DegreeReportLogger {
    public static void degreeCountryReport(Logger log, String message, UserSession userSession, String generation) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeCountryReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Generation: ").append(generation);
        log.error(error);
    }

    public static void degreeStateReport(Logger log, String message, UserSession userSession, String generation, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeStateReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Generation: ").append(generation);
        error.append(". StateId: ").append(stateId);
        log.error(error);
    }

    public static void degreeSchoolReport(Logger log, String message, UserSession userSession, String generation, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeSchoolReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". generation: ").append(generation);
        error.append(". SchoolId: ").append(schoolId);
        log.error(error);
    }
}
