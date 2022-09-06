package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.dto.degree.DegreeIntituteDgp;
import mx.edu.cecyte.sisec.dto.degree.DgpCombinationCareer;
import mx.edu.cecyte.sisec.dto.degree.DgpSelectCareer;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

import java.util.Set;

public class DgpLogger {

    public static void selectSchoolDgp(Logger log, String message, UserSession userSession, Integer schoolId) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("selectSchoolDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". SchoolId: ").append(schoolId);
        log.error(error);
    }


    public static void updateSchoolDgp(Logger log, String message, UserSession userSession, DegreeIntituteDgp degreeIntituteDgp) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("updateSchoolDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". degreeIntituteDgp: ").append(degreeIntituteDgp);
        log.error(error);
    }

    public static void addNewSchoolDgp(Logger log, String message, UserSession userSession, DegreeIntituteDgp degreeIntituteDgp) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("addNewSchoolDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DegreeIntituteDgp: ").append(degreeIntituteDgp);
        log.error(error);
    }

    public static void DgpCombinationCareer(Logger log, String message, UserSession userSession, DgpCombinationCareer dgpCombinationCareer) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("DgpCombinationCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DgpCombinationCareer: ").append(dgpCombinationCareer);
        log.error(error);
    }

    public static void selectAllDecree(Logger log, String message, UserSession userSession, Integer stateId) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("selectAllDecree");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". stateId: ").append(stateId);
        log.error(error);
    }

    public static void updateStateDecree(Logger log, String message, UserSession userSession, DecreeSelect decreeSelect) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("updateStateDecree");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DecreeSelect: ").append(decreeSelect);
        log.error(error);
    }

    public static void selectAllCareerDgp(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("selectAllCareerDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void addNewCareerDgp(Logger log, String message, UserSession userSession, DgpSelectCareer dgpSelectCareer) {
        StringBuilder error = new StringBuilder();
        error.append(" Method: ").append("addNewCareerDgp");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". DgpSelectCareer: ").append(dgpSelectCareer);
        log.error(error);
    }

    public static void deleteCombinationCareer(Logger log, String message, UserSession userSession, Integer combinationId) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteCombinationCareer");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". CombinationId: ").append(combinationId);
        log.error(error);
    }
}
