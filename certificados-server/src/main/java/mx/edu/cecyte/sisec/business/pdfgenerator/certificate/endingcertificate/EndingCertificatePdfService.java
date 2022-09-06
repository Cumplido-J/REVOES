package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

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
public class EndingCertificatePdfService {
    @Autowired private PdfResourcesService pdfResourcesService;

    public byte[] generatePdf(EndingPdfData pdfData ) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfResources pdfResources = getPdfResources();
        Document document = configurePdf(baos);
        System.out.println("Fecha: "+pdfData.getSepDate());

        if(AppFunctions.setDateTimbrado(pdfData.getSepDate(), pdfData.getPeriodEnding())) {
            System.out.println("Condition: "+AppFunctions.setDateTimbrado(pdfData.getSepDate(), pdfData.getPeriodEnding()));

            Page1Temporary page1Temporary = new Page1Temporary(pdfResources, pdfData, document);
            Page2Temporary page2 = new Page2Temporary(pdfResources, pdfData, document);
            Page3Temporary page3 = new Page3Temporary(pdfResources, pdfData, document);
            Page4Temporary page4 = new Page4Temporary(pdfResources, pdfData, document);
            page1Temporary.generate();
            page2.generate();
            page3.generate();
            page4.generate();
        }else {
            System.out.println("Condition: "+AppFunctions.setDateTimbrado(pdfData.getSepDate(), pdfData.getPeriodEnding()));
            SetFooterImage setFooterImage = new SetFooterImage(pdfResources.getEagleFooter());

            Page1 page1 = new Page1(pdfResources, pdfData, document, setFooterImage);
            Page2 page2 = new Page2(pdfResources, pdfData, document, setFooterImage);
            Page3 page3 = new Page3(pdfResources, pdfData, document, setFooterImage);
            Page4 page4 = new Page4(pdfResources, pdfData, document, setFooterImage);
            page1.generate();
            page2.generate();
            page3.generate();
            page4.generate();
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
                .logoEducationHeadTemp(pdfResourcesService.getLogoEducationHeadTemp())
                .build();
    }

}
