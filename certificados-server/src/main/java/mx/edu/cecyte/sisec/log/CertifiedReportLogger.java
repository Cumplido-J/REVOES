package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class CertifiedReportLogger {
    public static void getCountryReport(Logger log, String message, UserSession userSession, String certifiedType) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCountryReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CertifiedType: ").append(certifiedType);
        log.error(error);
    }

    public static void getStateReport(Logger log, String message, UserSession userSession, String certifiedType, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStateReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CertifiedType: ").append(certifiedType);
        error.append(". StateId: ").append(stateId);
        log.error(error);
    }

    public static void getSchoolReport(Logger log, String message, UserSession userSession, String certifiedType, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSchoolReport");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CertifiedType: ").append(certifiedType);
        error.append(". SchoolId: ").append(schoolId);
        log.error(error);
    }
}
