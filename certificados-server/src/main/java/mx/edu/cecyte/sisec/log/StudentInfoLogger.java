package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.student.StudentInfoDto;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class StudentInfoLogger {
    public static void getStudentInfo(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStudentInfo");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void editStudentInfo(Logger log, String message, UserSession userSession, StudentInfoDto studentInfoDto) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editStudentInfo");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentInfoDto: ").append(studentInfoDto);
        log.error(error);
    }
}
