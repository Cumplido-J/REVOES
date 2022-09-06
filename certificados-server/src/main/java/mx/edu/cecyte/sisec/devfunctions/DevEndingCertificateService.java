package mx.edu.cecyte.sisec.devfunctions;

import mx.edu.cecyte.dectermino.Dec;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate.EndingCertificatePdfService;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate.EndingPdfData;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.dto.catalogs.ConfigPeriodData;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurpsFiel;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import mx.edu.cecyte.sisec.webservice.EndingDecParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class DevEndingCertificateService {
    @Autowired private EndingCertificatePdfService endingCertificatePdfService;

    public void generateCecyteEndingPdf() {
        Path pathXml = Paths.get("D:", "dev", "EndingCecyte.xml");
        Path pathPdf = Paths.get("D:", "dev", "NewPdf", "EndingCecyte.pdf");
        Path pathPdfBlank = Paths.get("D:", "dev", "NewPdf", "EndingCecyteBlank.pdf");
        generatePdf(pathXml, pathPdf, false, false);
        generatePdf(pathXml, pathPdfBlank, false, true);
    }

    public void generateEmsadEndingPdf() {
        Path pathXml = Paths.get("D:", "dev", "EndingEmsad.xml");
        Path pathPdf = Paths.get("D:", "dev", "NewPdf", "EndingEmsad.pdf");
        Path pathPdfBlank = Paths.get("D:", "dev", "NewPdf", "EndingEmsadBlank.pdf");
        generatePdf(pathXml, pathPdf, false, false);
        generatePdf(pathXml, pathPdfBlank, false, true);
    }

    public void generatePortabilityEndingPdf() {
        Path pathXml = Paths.get("D:", "dev", "EndingPortability.xml");
        Path pathPdf = Paths.get("D:", "dev", "NewPdf", "EndingPortability.pdf");
        generatePdf(pathXml, pathPdf, true, false);
    }

    private void generatePdf(Path pathXml, Path pathPdf, boolean isPortability, boolean blank) {
        try {
            byte[] bytesXmlTest = Files.readAllBytes(pathXml);
            Files.createDirectories(pathPdf.getParent());

            Dec endingDec = EndingDecParser.xmlToClass(bytesXmlTest);
            Date sinemsDate = new SimpleDateFormat("dd/MM/yyyy").parse("06/06/2016");
            DecreeSelect decree = null;
            ConfigPeriodData periodData = null;
            EndingPdfData pdfData = new EndingPdfData(endingDec, sinemsDate, isPortability, decree, periodData);
            if (blank) pdfData.blankPdfData();
            byte[] bytesPdf = endingCertificatePdfService.generatePdf(pdfData);
            Files.write(pathPdf, bytesPdf);
        } catch (ParseException | IOException e) {
            throw new AppException(Messages.dev_cantReadFile);
        }
    }

    public void GenerateDocument( CertificateCurpsFiel certificateCurpsFiel, String username ) {
        try {

            String origin = "/home/sisec/FIELs/" + username;
            File fileOrigin = new File(origin);
            if (!fileOrigin.exists()) {fileOrigin.mkdirs();}

            String cer = origin + "/Cer.txt";
            String contenidoCer = DesEncript(certificateCurpsFiel.getFiel().getCer(), certificateCurpsFiel.getFielBytes());
            File fileCer = new File(cer);
            FileWriter fwCer = new FileWriter(fileCer);
            BufferedWriter bwCer = new BufferedWriter(fwCer);
            bwCer.write(contenidoCer);
            bwCer.close();
            if (!fileCer.exists()) {
                fileCer.createNewFile();
            }

            String key = origin + "/Key.txt";
            String contenidoKey = DesEncript(certificateCurpsFiel.getFiel().getKey(), certificateCurpsFiel.getFielBytes());
            File filekey = new File(key);
            FileWriter fwkey = new FileWriter(filekey);
            BufferedWriter bwkey = new BufferedWriter(fwkey);
            bwkey.write(contenidoKey);
            bwkey.close();
            if (!filekey.exists()) {
                filekey.createNewFile();
            }


            String password = origin + "/Password.txt";
            String contenidoPass = certificateCurpsFiel.getFiel().getPassword();
            File filePass = new File(password);
            FileWriter fwPass = new FileWriter(filePass);
            BufferedWriter bwPass = new BufferedWriter(fwPass);
            bwPass.write(contenidoPass);
            bwPass.close();
            if (!filePass.exists()) {
                filePass.createNewFile();
            }


        } catch (Exception e) {
            System.out.println("Documento no generado: " + e);
        }
    }



    public String DesEncript( String certificateFiel, Fiel fielBytes )
            //throws UnsupportedEncodingException
    {

        if (certificateFiel != "" && certificateFiel != null) {
            //byte[] encbytes = certificateFiel.getBytes();
            //Base64.Decoder dec = Base64.getDecoder();
            //byte[] decbytes = dec.decode(encbytes);
            //byte[] decbytes = Base64.getMimeDecoder().decode(encbytes);


            /*String text = "";
            for (byte decbytess: decbytes) {
                int decimal = decbytess;
                char letra = (char) decimal;
                text += letra;
            }*/
            //return new String(decbytes);
            return certificateFiel;

        } else {
            return null;
        }

    }


    public  String binaryToText(String binaryText) {

        String[] binaryNumbers = binaryText.split(" ");
        String text = "";


        for (String currentBinary : binaryNumbers) {

            int decimal = binaryToDecimal(currentBinary);

            char letra = (char) decimal;
            text += letra;
        }
        return text;
    }

    public static int binaryToDecimal(String binary) {

        int decimal = 0;
        int position = 0;

        for (int x = binary.length() - 1; x >= 0; x--) {

            short digit = 1;
            if (binary.charAt(x) == '0') {
                digit = 0;
            }

            double multiplier = Math.pow(2, position);
            decimal += digit * multiplier;
            position++;
        }
        return decimal;
    }
}
