package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.classes.degree.DegreeSearchFilter;
import mx.edu.cecyte.sisec.dto.degree.CancelStampExternal;
import mx.edu.cecyte.sisec.dto.degree.DegreeCurps;
import mx.edu.cecyte.sisec.dto.degree.DegreeCurpsFiel;
import mx.edu.cecyte.sisec.dto.degree.DegreeDataAntecedents;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class DegreeLogger {

    public static void studentValidationSearch(Logger log, String message, UserSession userSession, DegreeSearchFilter filter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentValidationSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(filter);
        log.error(error);
    }

    public static void validateStudents(Logger log, String message, UserSession userSession, DegreeCurps degreeCurps) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("validateStudents");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentsCurps: ").append(degreeCurps);
        log.error(error);
    }

    public static void reprobateStudent(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("reprobateStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(curp);
        log.error(error);
    }

    public static void getStudentModules(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getStudentModules");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(curp);
        log.error(error);
    }

    public static void studentDegreeSearch(Logger log, String message, UserSession userSession, DegreeSearchFilter filter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentDegreeSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(filter);
        log.error(error);
    }

    public static void degreeStudents(Logger log, String message, UserSession userSession, DegreeCurpsFiel fiel) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeStudents");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DegreeCurpsFiel: ").append(fiel);
        log.error(error);
    }

    public static void downloadPdf(Logger log, String message, UserSession userSession, String folioNumber) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("downloadPdf");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". FolioNumber: ").append(folioNumber);
        log.error(error);
    }

    public static void downloadXml(Logger log, String message, UserSession userSession, String folioNumber) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("downloadXml");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". folioNumber: ").append(folioNumber);
        log.error(error);
    }

    public static void getPendientBatches(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getPendientBatches");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void sincronizeBatches(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("sincronizeBatches");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void downloadMultiplePdf(Logger log, String message, UserSession userSession, DegreeCurps degreeCurps) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("downloadMultiplePdf");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentsCurps: ").append(degreeCurps);
        log.error(error);
    }

    public static void cancelDegree(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("cancelDegree");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(curp);
        log.error(error);
    }

    public static void studentQuerySearch(Logger log, String message, UserSession userSession, DegreeSearchFilter filter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentQuerySearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(filter);
        log.error(error);
    }

    public static void antecedentsData(Logger log, String message, UserSession userSession, String studentCurp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("antecedentsData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(studentCurp);
        log.error(error);
    }

    public static void degreeView(Logger log, String message, UserSession userSession, String studentCurp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeView");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". studentCurp: ").append(studentCurp);
        log.error(error);
    }

    public static void editStudentModules(Logger log, String message, UserSession userSession, DegreeDataAntecedents degreeDataAntecedents) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editStudentModules");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DataAntecedents: ").append(degreeDataAntecedents);
        log.error(error);
    }

    public static void degreeCancelExternal(Logger log, String message, UserSession userSession, CancelStampExternal cancelStampExternal) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("degreeCancelExternal");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DegreeCancelExternal: ").append(cancelStampExternal);
        log.error(error);
    }
}
