package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.profile.LoginRequest;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class LoignLogger {

    public static void login(Logger log, String message, LoginRequest loginRequest) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("login");
        error.append(". Error: ").append(message);
        error.append(". LoginRequest: ").append(loginRequest);
        log.error(error);
    }

    public static void userProfile(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("userProfile");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
}
