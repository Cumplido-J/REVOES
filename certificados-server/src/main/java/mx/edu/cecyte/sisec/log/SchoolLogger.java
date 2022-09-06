package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.classes.SchoolFilter;
import mx.edu.cecyte.sisec.dto.school.SchoolCareerData;
import mx.edu.cecyte.sisec.dto.school.SchoolData;
import mx.edu.cecyte.sisec.dto.school.SchoolDto;
import mx.edu.cecyte.sisec.dto.school.SchoolEquivalentData;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class SchoolLogger {
    public static void schoolSearch(Logger log, String message, UserSession userSession, SchoolFilter schoolFilter) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("schoolSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Filter: ").append(schoolFilter);
        log.error(error);
    }

    public static void getSchoolData(Logger log, String message, UserSession userSession, String cct) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getSchoolData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CCT: ").append(cct);
        log.error(error);
    }

    public static void addNewSchool(Logger log, String message, UserSession userSession, SchoolData schoolData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewSchool");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". School data: ").append(schoolData);
        log.error(error);
    }

    public static void editSchool(Logger log, String message, UserSession userSession, SchoolData schoolData, String cct) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editSchool");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CCT: ").append(cct);
        error.append(". School data: ").append(schoolData);
        log.error(error);
    }

    public static void addNewSchoolCareer(Logger log, String message, UserSession userSession, SchoolCareerData schoolCareer) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addCareerSchool");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". School data: ").append(schoolCareer);
        log.error(error);
    }

    public static void deleteSchoolCareer(Logger log, String message, UserSession userSession, SchoolCareerData schoolCareer) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteCareerSchool");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". School data: ").append(schoolCareer);
        log.error(error);
    }

    public static void deleteCareer(Logger log, String message, UserSession userSession, Integer id, SchoolDto schoolDto) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Objeto SchoolCareer: ").append(schoolDto);
        error.append(". CCT: ").append(id);
        log.error(error);
    }
    public static void getTotal(Logger log, String message, UserSession userSession, Integer careerId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getTotal");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Student Carreer_School ").append(careerId);
        log.error(error);
    }

    public static void addchoolEquivaalent(Logger log, String message, UserSession userSession, SchoolEquivalentData schoolEquivalentData) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("addchoolEquivaalent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SchoolEquivalentData: ").append(schoolEquivalentData);
        log.error(error);
    }

    public static void selectSchoolEquivalent(Logger log, String message, UserSession userSession, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("selectSchoolEquivalent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". schoolId: ").append(schoolId);
        log.error(error);
    }

    public static void updateSchoolEquivalent(Logger log, String message, UserSession userSession, SchoolEquivalentData schoolEquivalentData) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("updateSchoolEquivalent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SchoolEquivalentData: ").append(schoolEquivalentData);
        log.error(error);
    }

    public static void deleteSchoolEquivalent(Logger log, String message, UserSession userSession, Integer equivalentId) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("deleteSchoolEquivalent");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". equivalentId: ").append(equivalentId);
        log.error(error);
    }

    public static void schoolEquivalentSearch(Logger log, String message, UserSession userSession, SchoolFilter schoolFilter) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("schoolEquivalentSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SchoolFilter: ").append(schoolFilter);
        log.error(error);
    }
    public static void schoolByState(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("schoolByState");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
}
