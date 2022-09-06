package mx.edu.cecyte.sisec.devfunctions;

import mx.edu.cecyte.decparcial.Dec;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate.PartialCertificatePdfService;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate.PartialPdfData;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import mx.edu.cecyte.sisec.webservice.PartialDecParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class DevPartialCertificateService {
    @Autowired private PartialCertificatePdfService partialCertificatePdfService;

    public void generateCecytePartialPdf() {
        Path pathXml = Paths.get("D:", "dev", "PartialCecyte.xml");
        Path pathPdf = Paths.get("D:", "dev", "NewPdf", "PartialCecyte.pdf");
        Path pathPdfBlank = Paths.get("D:", "dev", "NewPdf", "PartialCecyteBlank.pdf");
        generatePdf(pathXml, pathPdf, false);
        generatePdf(pathXml, pathPdfBlank, true);
    }

    public void generateEmsadPartialPdf() {
        Path pathXml = Paths.get("D:", "dev", "PartialEmsad.xml");
        Path pathPdf = Paths.get("D:", "dev", "NewPdf", "PartialEmsad.pdf");
        Path pathPdfBlank = Paths.get("D:", "dev", "NewPdf", "PartialEmsadBlank.pdf");
        generatePdf(pathXml, pathPdf, false);
        generatePdf(pathXml, pathPdfBlank, true);
    }

    private void generatePdf(Path pathXml, Path pathPdf, boolean blank) {
        try {
            byte[] bytesXmlTest = Files.readAllBytes(pathXml);
            Files.createDirectories(pathPdf.getParent());

            Dec partialDec = PartialDecParser.xmlToClass(bytesXmlTest);
            Date sinemsDate = new SimpleDateFormat("dd/MM/yyyy").parse("06/06/2016");
            DecreeSelect decree = null;

            PartialPdfData pdfData = new PartialPdfData(partialDec, sinemsDate, "asxsx", decree);
            if (blank) pdfData.blankPdfData();
            byte[] bytesPdf = partialCertificatePdfService.generatePdf(pdfData);
            Files.write(pathPdf, bytesPdf);
        } catch (ParseException | IOException e) {
            throw new AppException(Messages.dev_cantReadFile);
        }
    }

}
