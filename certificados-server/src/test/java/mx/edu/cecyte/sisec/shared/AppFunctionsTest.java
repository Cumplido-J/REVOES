package mx.edu.cecyte.sisec.shared;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

class AppFunctionsTest {

    @Test
    void positiveInteger_nullValue_false() {
        Integer number = null;
        boolean result = AppFunctions.positiveInteger(number);
        assertFalse(result);
    }

    @Test
    void positiveInteger_100_true() {
        Integer number = 100;
        boolean result = AppFunctions.positiveInteger(number);
        assertTrue(result);
    }

    @Test
    void positiveInteger_neg100_false() {
        Integer number = -100;
        boolean result = AppFunctions.positiveInteger(number);
        assertFalse(result);
    }

    @Test
    void splitTextOnLines_example1() {
        String longText = "Dirección General del Colegio de Estudios Científicos y Tecnológicos del Estado de Jalisco";
        int lines = 2;

        String result = AppFunctions.splitTextOnLines(longText, lines);

        String expectedResult = "Dirección General del Colegio de Estudios" + System.lineSeparator() + "Científicos y Tecnológicos del Estado de Jalisco";

        assertEquals(expectedResult, result);
    }

    @Test
    void splitTextOnLines_example2() {
        String longText = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19";
        int lines = 5;

        String result = AppFunctions.splitTextOnLines(longText, lines);
        String expectedResult = "1 2 3" + System.lineSeparator() +
                "4 5 6 7" + System.lineSeparator() +
                "8 9 10 11" + System.lineSeparator() +
                "12 13 14 15" + System.lineSeparator() +
                "16 17 18 19";

        assertEquals(expectedResult, result);
    }

    //
//    @Test
//    void changeExtensionName() throws IOException {
//
//        Path certificatesPath = Paths.get("D:", "dev", "certificados2");
//        changeExtension(certificatesPath);
//    }
//
//    void changeExtension(Path path) throws IOException {
//        if (Files.isDirectory(path)) {
//            for (Path directoryPath : Files.newDirectoryStream(path)) {
//                changeExtension(directoryPath);
//            }
//            return;
//        }
//        String fileNameWithoutExtension = FilenameUtils.removeExtension(path.getFileName().toString());
//        String extension = FilenameUtils.getExtension(path.getFileName().toString());
//        if (fileNameWithoutExtension.contains(extension)) {
//            String parent = path.getParent().toString();
//            Path newPath = Paths.get(parent, fileNameWithoutExtension);
//            Files.move(path, newPath);
//        }
//    }
    void deleteEmptyFolders(Path directoryPath) throws IOException {
        DirectoryStream<Path> batchDirectoryStream = Files.newDirectoryStream(directoryPath);
        int i = 0;
        for (Path path : batchDirectoryStream) {
            i++;
        }
        if (i == 0) {
            Files.delete(directoryPath);
        }
    }

    @Test
    void moveFiles() throws IOException {

        String[] stateFolders = {"4. Campeche", "10. Durango", "14. Jalisco", "17. Morelos", "18. Nayarit", "19. Nuevo León", "21. Puebla", "25. Sinaloa", "27. Tabasco", "28. Tamaulipas", "29. Tlaxcala", "31. Yucatán"};
//        Path uploadPath = Paths.get("D:", "dev", "certificados", "Carga");
//        Path downloadPath = Paths.get("D:", "dev", "certificados", "Descarga");
        Path queryPath = Paths.get("D:", "dev", "certificados", "Consulta");
        Path finalPath = Paths.get("D:", "dev", "certificados", "Todos");

//        DirectoryStream<Path> uploadStream = Files.newDirectoryStream(uploadPath);
        DirectoryStream<Path> stream = Files.newDirectoryStream(queryPath);
        for (Path batchNumberPath : stream) {
            String batchNumber = batchNumberPath.getFileName().toString();
            for (String stateFolder : stateFolders) {
                Path destinyBatchNumberPath = Paths.get(finalPath.toString(), stateFolder, batchNumber);
                if (Files.exists(destinyBatchNumberPath)) {
                    String fileName = "ConsultaCertificadosIEMS.xls";

                    Path originPath = Paths.get(batchNumberPath.toString(), fileName);
                    Path destinyPath = Paths.get(destinyBatchNumberPath.toString(), fileName);
                    System.out.println(String.format("Origin: %s\nDestiny: %s\n", originPath, destinyPath));
                    Files.move(originPath, destinyPath);
                    break;
                }
            }

            deleteEmptyFolders(batchNumberPath);
        }

    }

    private String getStateFolder(Path xmlFile) throws IOException {
        String xmlString = new String(Files.readAllBytes(xmlFile));
        String newFolder = "";
        if (xmlString.contains("idIEMS=\"10017\"")) {
            newFolder = "4. Campeche";
        } else if (xmlString.contains("idIEMS=\"10021\"")) {
            newFolder = "10. Durango";
        } else if (xmlString.contains("idIEMS=\"10025\"")) {
            newFolder = "14. Jalisco";
        } else if (xmlString.contains("idIEMS=\"10028\"")) {
            newFolder = "17. Morelos";
        } else if (xmlString.contains("idIEMS=\"10029\"")) {
            newFolder = "18. Nayarit";
        } else if (xmlString.contains("idIEMS=\"10030\"")) {
            newFolder = "19. Nuevo León";
        } else if (xmlString.contains("idIEMS=\"10032\"")) {
            newFolder = "21. Puebla";
        } else if (xmlString.contains("idIEMS=\"10036\"")) {
            newFolder = "25. Sinaloa";
        } else if (xmlString.contains("idIEMS=\"10038\"")) {
            newFolder = "27. Tabasco";
        } else if (xmlString.contains("idIEMS=\"10039\"")) {
            newFolder = "28. Tamaulipas";
        } else if (xmlString.contains("idIEMS=\"10040\"")) {
            newFolder = "29. Tlaxcala";
        } else if (xmlString.contains("idIEMS=\"10042\"")) {
            newFolder = "31. Yucatán";
        }
        return newFolder;
    }

}