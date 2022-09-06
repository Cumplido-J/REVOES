package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.classes.certificate.CertificateSearchFilter;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurps;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurpsFiel;
import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudent;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class CertificateLogger {
    public static void studentValidationSearch(Logger log, String message, UserSession userSession, CertificateSearchFilter filter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentValidationSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(filter);
        log.error(error);
    }

    public static void validateStudents(Logger log, String message, UserSession userSession, CertificateCurps certificateCurps) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("validateStudents");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentsCurps: ").append(certificateCurps);
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

    public static void editStudent(Logger log, String message, UserSession userSession, CertificateEditStudent certificateEditStudent) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentData: ").append(certificateEditStudent);
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

    public static void studentCertificateSearch(Logger log, String message, UserSession userSession, CertificateSearchFilter filter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("studentCertificateSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(filter);
        log.error(error);
    }

    public static void certificateStudents(Logger log, String message, UserSession userSession, CertificateCurpsFiel certificateCurpsFiel) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("certificateStudents");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CertificateCurpsFiel: ").append(certificateCurpsFiel);
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

    public static void downloadMultiplePdf(Logger log, String message, UserSession userSession, CertificateCurps certificateCurps) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("downloadMultiplePdf");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentsCurps: ").append(certificateCurps);
        log.error(error);
    }

    public static void cancelCertificate(Logger log, String message, UserSession userSession, String curp, Integer certificateType) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("cancelCertificate");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(curp);
        error.append(". CertificateType: ").append(certificateType);
        log.error(error);
    }

    public static void statusValidation(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("SerchCertificateLimit");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentCurp: ").append(curp);
        log.error(error);
    }

    public static void editStudentAbrogado(Logger log, String message, UserSession userSession, CertificateEditStudent certificateEditStudent) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editStudentAbrogado");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". StudentData: ").append(certificateEditStudent);
        log.error(error);
    }

    public static void selectDataStudent(Logger log, String message, UserSession userSession, String curp) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("selectDataStudent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CURP: ").append(curp);
        log.error(error);
    }
}
