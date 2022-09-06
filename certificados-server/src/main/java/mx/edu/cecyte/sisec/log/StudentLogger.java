package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.classes.StudentFilter;
import mx.edu.cecyte.sisec.dto.student.*;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

import java.util.List;

public class StudentLogger {
    public static void studentSearch(Logger log, String mensaje, UserSession userSession, StudentFilter studentFilter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentSearch");
        error.append(". Error: ").append(mensaje);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(studentFilter);
        log.error(error);
    }

    public static void getStudentData(Logger log, String message, UserSession userSession, String studentCurp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStudentData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Student CURP: ").append(studentCurp);
        log.error(error);
    }

    public static void editStudent(Logger log, String message, UserSession userSession, StudentData studentData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Student data: ").append(studentData);
        log.error(error);
    }

    public static void editStudentPassword(Logger log, String message, UserSession userSession, StudentPasswordDto password) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editStudentPassword");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Password: ").append(password);
        log.error(error);
    }

    public static void getStudentSubjects(Logger log, String message, UserSession userSession, String studentCurp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStudentSubjects");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(studentCurp);
        log.error(error);
    }

    public static void addPortabilityModules(Logger log, String message, UserSession userSession, StudentPortability studentPortability) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addPortabilityModules");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentPortability: ").append(studentPortability);
        log.error(error);
    }

    public static void getStudentModules(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStudentSubjects");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Curp: ").append(curp);
        log.error(error);
    }

    public static void addNewStudent(Logger log, String message, UserSession userSession, StudentData studentData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Student data: ").append(studentData);
        log.error(error);
    }

    public static void addStudentSubjects(Logger log, String message, UserSession userSession, StudentSemesters semesters, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Curp: ").append(curp);
        error.append(". Semesters: ").append(semesters);
        log.error(error);
    }

    public static void getAvailableStudentSubjects(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Curp: ").append(curp);
        log.error(error);
    }

    public static void studentFormatDownload(Logger log, String message, UserSession userSession, StudentDataFormat studentDataFormat) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentFormatDownload");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentFormat data: ").append(studentDataFormat);
        log.error(error);
    }

    public static void getUpdateStudentSubject(Logger log, String message, UserSession userSession, StudentSubjectUpdate studentSubjectUpdate) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getUpdateStudentSubject");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void updateCreditsStudent(Logger log, String message, UserSession userSession, StudentCreditsUpdate studentCreditsUpdate) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("updateCreditsStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void deleteScoreStudent(Logger log, String message, UserSession userSession, StudentDeleteScore studentDeleteScore) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("deleteScoreStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentDeleteScore: ").append(studentDeleteScore);
        log.error(error);
    }

    public static void addSubjectRow(Logger log, String message, UserSession userSession, StudentSubjectRow studentSubjectRow) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("addSubjectRow");
        error.append(". Error; ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentSubjectRow: ").append(studentSubjectRow);
        log.error(error);
    }

    public static void studentRecord(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentRecord");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }

    public static void selectRecordCourse(Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("selectRecordCourse");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". RecordId: ").append(id);
        log.error(error);
    }

    public static void returnCourseRecors(Logger log, String message, UserSession userSession, Integer studentId, StudentRecordData studentRecordData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("returnCourseRecors");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentId: ").append(studentId);
        error.append(". StudentRecordData: ").append(studentRecordData);
        log.error(error);
    }

    public static void selectIssuedCertificates(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("selectIssuedCertificates");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }


    public static void deleteRowRecord(Logger log, String message, UserSession userSession, StudentRecordData studentRecordData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteRowRecord");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentRecordData: ").append(studentRecordData);
        log.error(error);
    }
    public static void studentSearchCopy(Logger log, String mensaje, UserSession userSession, String text) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentSearch");
        error.append(". Error: ").append(mensaje);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(text);
        log.error(error);
    }
    public static void changeStatus(Logger log, String mensaje, UserSession userSession, String curp, Boolean status) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentSearch");
        error.append(". Error: ").append(mensaje);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Curp: ").append(curp);
        error.append(". Status: ").append(status);
        log.error(error);
    }
}
