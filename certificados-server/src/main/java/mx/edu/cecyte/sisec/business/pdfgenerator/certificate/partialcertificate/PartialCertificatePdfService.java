package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResourcesService;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PartialCertificatePdfService {
    @Autowired private PdfResourcesService pdfResourcesService;

    public byte[] generatePdf(PartialPdfData pdfData) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfResources pdfResources = getPdfResources();
        Document document = configurePdf(baos);
        System.out.println(pdfData.getSepDate() +"---> "+AppFunctions.setDateTimbrado(pdfData.getSepDate(), "2022-09-12"));
        if (AppFunctions.setDateTimbrado(pdfData.getSepDate(), "2022-09-12")) {
            Page1Temporary page1Temporary = new Page1Temporary(pdfResources, pdfData, document);
            Page2Temporary page2Temporary = new Page2Temporary(pdfResources, pdfData, document);
            page1Temporary.generate();
            page2Temporary.generate();
        } else {
            SetFooterImage setFooterImage = new SetFooterImage(pdfResources.getEagleFooter());
            Page1 page1 = new Page1(pdfResources, pdfData, document, setFooterImage);
            Page2 page2 = new Page2(pdfResources, pdfData, document, setFooterImage);
            page1.generate();
            page2.generate();
        }

        document.close();
        document.getPdfDocument().close();

        return baos.toByteArray();
    }

    private Document configurePdf(ByteArrayOutputStream baos) {
        PdfDocument pdfDoc = new PdfDocument(new PdfWriter(baos));
        Document document = new Document(pdfDoc, PageSize.LETTER);
        document.setMargins(PdfFunctions.cmToPoints(1f), PdfFunctions.cmToPoints(1f), PdfFunctions.cmToPoints(1f), PdfFunctions.cmToPoints(1f));
        return document;
    }

    private PdfResources getPdfResources() {
        return PdfResources.builder()
                .cecyteLogo(pdfResourcesService.getLogoCecyte())
                .eagleFooter(pdfResourcesService.getBarraAguilas())
                .educationLogo(pdfResourcesService.getLogoEducacion())
                .montserrat(pdfResourcesService.getMontserrat())
                .montserratBold(pdfResourcesService.getMontserratBold())
                .sinemsLogo(pdfResourcesService.getLogoSinems())
                .logoEducacionTemporary(pdfResourcesService.getlogoEducacionTemporary())
                .marcoTemporary(pdfResourcesService.getMarcoTemporary())
                .escudoTemporary(pdfResourcesService.getEscudoTemporary())
                .build();
    }

}
