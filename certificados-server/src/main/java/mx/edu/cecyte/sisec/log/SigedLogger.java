package mx.edu.cecyte.sisec.log;

import org.apache.log4j.Logger;

public class SigedLogger {

    public static void searchFolioData(Logger log, String message, String folioNumber) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getFolioData");
        error.append(". Error: ").append(message);
        error.append(". FolioNumber: ").append(folioNumber);
        log.error(error);
    }
    public static void getDatoFolio(Logger log, String message, String variableFolio) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getDatoFolio");
        error.append(". Error: ").append(message);
        error.append(". Folio: ").append(variableFolio);
        log.error(error);
    }

    public static void searchFolioDegree(Logger log, String message, String folio) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("searchFolioDegree");
        error.append(". Error: ").append(message);
        error.append(". Folio: ").append(folio);
        log.error(error);
    }
}
