package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;

public class DegreeShared {
    protected final DegreePdfResources pdfResources;
    protected final Document document;

    public DegreeShared(DegreePdfResources pdfResources, Document document) {
        this.pdfResources = pdfResources;
        this.document = document;
    }

    protected Paragraph getFolioContainer(String folioNumber){
        String folioString = "Folio ";
        Text folioStringText = newTextMontserratBold(folioString, 9f);
        Text folioText = newTextMontserrat(folioNumber, 9f);
        return PdfFunctions.createParagraph().add(folioStringText).add(folioText);
    }

    protected void setFooterParagraph(Paragraph paragraph) {
        paragraph.setFixedPosition(
                document.getLeftMargin(),
                document.getBottomMargin(),
                document.getPdfDocument().getDefaultPageSize().getWidth() - document.getLeftMargin() - document.getRightMargin()
        );
    }

    protected Paragraph getEducationLogoParagraph() {
        Image educationLogo = pdfResources.getEducationLogo();
        return PdfFunctions.createParagraph()
                .add(educationLogo);
    }

    protected Paragraph getLogoCecyte() {
        Image logoCecyte = pdfResources.getCecyteLogo();
        return PdfFunctions.createParagraph()
                .add(logoCecyte)
                .setTextAlignment(TextAlignment.CENTER);
    }

    protected Paragraph getBackgroundCecyteParagraph() {
        Image backgroundCecyte = pdfResources.getBackgroundCecyte();
        return PdfFunctions.createParagraph();
    }

    protected Paragraph getDegreeOvalo(Integer val) {
        Image degreeOvalo = val == 1 ? pdfResources.getDegreeOvalo() : pdfResources.getDegreeOval7x5();
        return PdfFunctions.createParagraph()
                .add(degreeOvalo);
    }

    protected Paragraph getLogoState(Image FileName) {
        Image logoState = FileName;
        return PdfFunctions.createParagraph()
                .add(logoState);
    }

    protected Text newTextMontserrat(String string, float fontSize) {
        return PdfFunctions.createText(string, fontSize).setFont(pdfResources.getMontserrat());
    }

    protected Text newTextMontserratBold(String string, float fontSize) {
        return PdfFunctions.createText(string, fontSize).setFont(pdfResources.getMontserratBold());
    }

}
