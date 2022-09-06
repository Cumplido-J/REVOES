package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.masiveload.AlumnoCarga;
import mx.edu.cecyte.sisec.dto.masiveload.MasiveContentScore;
import mx.edu.cecyte.sisec.dto.masiveload.MasiveDiciplinary;
import mx.edu.cecyte.sisec.dto.masiveload.graduates.GraduadosCarga;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

public class MasiveGraduateLogger {
    public static void insertMasiveGraduate(Logger log, String message, UserSession userSession, ArrayList<GraduadosCarga> graduadosAlumnos) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("insertMasiveGraduate");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". ArrayList<GraduadosCarga>: ").append(graduadosAlumnos);
        log.error(error);
    }

    public static void scoreAddMasive(Logger log, String message, UserSession userSession, ArrayList<AlumnoCarga> cargaAlumnos) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("scoreAddMasive");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". ArrayList<AlumnoCarga>: ").append(cargaAlumnos);
        log.error(error);
    }

    public static void loadingMasiveDiciplinary(Logger log, String message, UserSession userSession, List<MasiveDiciplinary> masiveDiciplinary) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("loadingMasiveDiciplinary");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". MasiveDiciplinary: ").append(masiveDiciplinary);
        log.error(error);
    }

    public static void scoreAddMasiveNew(Logger log, String message, UserSession userSession, List<MasiveContentScore> contentScore) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("scoreAddMasiveNew");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". MasiveContentScore: ").append(contentScore);
        log.error(error);
    }
}
