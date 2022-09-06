package mx.edu.cecyte.sisec.log;

import org.apache.log4j.Logger;

public class DevLogger {
    public static void schoolSearch(Logger log, String message) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("schoolSearch");
        error.append(". Error: ").append(message);
        log.error(error);
    }

    public static void generateAllSchoolControlAdmins(Logger log, String message) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("generateAllSchoolControlAdmins");
        error.append(". Error: ").append(message);
        log.error(error);
    }

    public static void generateAllTracingAdmins(Logger log, String message) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("generateAllTracingAdmins");
        error.append(". Error: ").append(message);
        log.error(error);
    }
}
