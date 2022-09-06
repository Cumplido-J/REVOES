package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.career.CareerData;
import mx.edu.cecyte.sisec.dto.career.CareerModuleData;
import mx.edu.cecyte.sisec.dto.career.ModuleData;
import mx.edu.cecyte.sisec.model.lecture.Lecture;
import mx.edu.cecyte.sisec.model.lecture.LectureCareerAssociation;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class CareerLogger {
    public static void addNewCareer( Logger log, String message, UserSession userSession, CareerData careerData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Career data: ").append(careerData);
        log.error(error);
    }
    public static void careerSearch(Logger log, String message, UserSession userSession,String searchText) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("careerSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Texto recibido: ").append(searchText);
        log.error(error);
    }
    public static void getAllCareer(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }
    public static void getCareerData(Logger log, String message, UserSession userSession,String careerKey) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCareerData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Dato recibido: ").append(careerKey);
        log.error(error);
    }
    public static void editCareer(Logger log, String message, UserSession userSession,CareerData careerData,String careerKey) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Dato recibido: ").append(careerKey);
        error.append(". Objeto recibido: ").append(careerData);
        log.error(error);
    }
    public static void addModule( Logger log, String message, UserSession userSession, ModuleData moduleData, Integer career) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addModule");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Dato recibido: ").append(career);
        error.append(". Objeto recibido: ").append(moduleData);
        log.error(error);
    }
    public static void getCareerModuleData(Logger log, String message, UserSession userSession,Integer idcareerModule) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getCareerModuleData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". paramentro recibido: ").append(idcareerModule);
        log.error(error);
    }
    public static void editCareerModule(Logger log, String message, UserSession userSession,ModuleData moduleData,Integer idcareerModule,Integer careerId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editCareerModule");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". parametro recibido: ").append(idcareerModule+" "+careerId);
        error.append(". Objeto recibido: ").append(moduleData);
        log.error(error);
    }
    public static void deleteCompetences(Logger log, String message, UserSession userSession, CareerModuleData modData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteCompetences");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Objeto recibido: ").append(modData);
        log.error(error);
    }

    public static void getLecturesByCareer(Logger log, String message, UserSession userSession, String clave_carrera) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getLecturesByCareer_UAC");
        error.append(", Error: ").append(message);
        error.append(", User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(", Clave de Carrera: ").append(clave_carrera);
        log.error(error);
    }

    public static void getLecturesByCareer_UAC(Logger log, String message, UserSession userSession, String busqueda, String clave_carrera) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getLecturesByCareer_UAC");
        error.append(", Error: ").append(message);
        error.append(", User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(", Busqueda: ").append(busqueda);
        error.append(", Clave de Carrera: ").append(clave_carrera);
        log.error(error);
    }

    public static void deleteLectureAssociationByCU_Id(Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteLectureAssociationByCU_Id");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(", ID: ").append(id);
        log.error(error);
    }

    public static void getLectureById(Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getLectureById");
        error.append(", Error: ").append(message);
        error.append(", User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(", ID: ").append(id);
        log.error(error);
    }

    public static void updateLectureById(Logger log, String message, UserSession userSession, Integer id, Lecture ser) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("updateLectureById");
        error.append(", Error: ").append(message);
        error.append(", User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(", Id: ").append(id);
        error.append(". Lecture: ").append(ser);
        log.error(error);
    }

    public static void insertLectureCareerAssociation(Logger log, String message, UserSession userSession, LectureCareerAssociation ser) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("insertLectureCareerAssociation");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". LectureCareerAssociation: ").append(ser);
        log.error(error);
    }

    public static void insertLecture(Logger log, String message, UserSession userSession, int id_carrera, Lecture ser) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("insertLecture");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Id_Caarrera: ").append(id_carrera);
        error.append(". Lecture: ").append(ser);
        log.error(error);
    }
}

