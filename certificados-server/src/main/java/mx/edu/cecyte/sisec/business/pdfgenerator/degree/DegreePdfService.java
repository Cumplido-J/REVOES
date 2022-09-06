package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetBackgroundImage;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class DegreePdfService {
    @Autowired private DegreePdfResourcesService pdfDegreeResourcesService;

    public byte[] generatePdf(DegreePdfData pdfData) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        DegreePdfResources pdfResources = getPdfResources();
        Document document = configurePdf(baos);
        SetBackgroundImage setBackgroundImage = new SetBackgroundImage(pdfResources.getBackgroundCecyte());
        SetFooterImage setFooterImage = new SetFooterImage(pdfResources.getEagleFooter());

        Page1 page1 = new Page1(pdfResources, pdfData, document, setFooterImage, setBackgroundImage);
        Page2 page2 = new Page2(pdfResources, pdfData, document, setFooterImage);

        page1.generate();
        page2.generate();
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

    private DegreePdfResources getPdfResources() {
        return DegreePdfResources.builder()
                .cecyteLogo(pdfDegreeResourcesService.getLogoCecyte())
                .eagleFooter(pdfDegreeResourcesService.getBarraAguilas())
                .educationLogo(pdfDegreeResourcesService.getLogoEducacion())
                .backgroundCecyte(pdfDegreeResourcesService.getBackgroundCecyte())
                .degreeOvalo(pdfDegreeResourcesService.getDegreeOvalo(1))
                .montserrat(pdfDegreeResourcesService.getMontserrat())
                .montserratBold(pdfDegreeResourcesService.getMontserratBold())
                .degreeOval7x5(pdfDegreeResourcesService.getDegreeOvalo(2))
                .build();
    }
}
