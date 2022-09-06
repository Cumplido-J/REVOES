package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;

import java.util.List;

public class Page4 extends EndingCertificateShared {
    private final EndingPdfData pdfData;
    private final SetFooterImage setFooterImage;

    public Page4(PdfResources pdfResources, EndingPdfData pdfData, Document document, SetFooterImage setFooterImage) {
        super(pdfResources, document);
        this.pdfData = pdfData;
        this.setFooterImage = setFooterImage;
    }

    public void generate() {
        document.add(getCecyteHeader(pdfData.getFolioNumber()));
        getContentParagraph();
        getStampParagraph();
        getSinemsLogo();
        document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
    }

    private void getStampParagraph() {
        String separatorString = "\n\n";
        Text separatorText = new Text(separatorString);
        Paragraph stampContainer = getStampContainer(pdfData).add(separatorText);
        setFooterParagraph(stampContainer);
        document.add(stampContainer);
    }

    private void getContentParagraph() {
        String titleString = "\nPerfil específico ";
        if (pdfData.isCecyte()) titleString += "del Bachillerato Tecnológico";
        if (pdfData.isEmsad()) titleString += "de la Educación Media Superior a Distancia";
        titleString += " del Estado de " + pdfData.getState();
        String subtitle1String = "\n\nCompetencias disciplinares extendidas.";
        String content1String = "\nConforme a las asignaturas acreditadas";
        if (pdfData.isCecyte()) content1String += " del área " + pdfData.getStudyArea();
        content1String += " del campo disciplinar de " + pdfData.getDisciplinaryField() + ".";

        String subtitle2String = "\n\n\nCompetencias profesionales básicas.";
        String content2String = "\nConforme a los módulos acreditados de ";
        if (pdfData.isCecyte()) content2String += "la carrera técnica";
        if (pdfData.isEmsad()) content2String += "formación elemental para el trabajo";
        content2String += " en: " + pdfData.getCareerName() + ".\n\n";

        Text titleText = newTextMontserrat(titleString, 12f);
        Text subtitle1Text = newTextMontserratBold(subtitle1String, 8f);
        Text content1Text = newTextMontserrat(content1String, 8f);
        Text subtitle2Text = newTextMontserratBold(subtitle2String, 8f);
        Text content2Text = newTextMontserrat(content2String, 8f);

        Paragraph titleContainer = PdfFunctions.createParagraph().add(titleText).setTextAlignment(TextAlignment.CENTER);
        Paragraph contentContainer = PdfFunctions.createParagraph()
                .add(subtitle1Text)
                .add(content1Text)
                .add(subtitle2Text)
                .add(content2Text);

        Table competencesTable = new Table(UnitValue.createPercentArray(new float[]{3, 97}));
        List<String> competences = pdfData.getCompetences();
        for (int i = 0; i < competences.size(); i++) {
            String number = PdfFunctions.romanLetter[i];
            if (pdfData.isEmsad()) number = PdfFunctions.number[i];

            Text numberText = newTextMontserrat(number, 8f);
            Text nameText = newTextMontserrat(competences.get(i), 8f);

            Paragraph numberContainer = PdfFunctions.createParagraph().add(numberText).setMarginTop(5f);
            Paragraph nameContainer = PdfFunctions.createParagraph().add(nameText).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(5f);

            Cell numberCell = PdfFunctions.createCell().add(numberContainer);
            Cell nameCell = PdfFunctions.createCell().add(nameContainer);

            competencesTable.addCell(numberCell).addCell(nameCell);
        }
        document.add(titleContainer)
                .add(contentContainer)
                .add(competencesTable);
    }

    private void getSinemsLogo() {
        String separatorString = "\n\n\n\n\n\n\n";
        Text separatorText = new Text(separatorString);
        Paragraph separatorParagraph = PdfFunctions.createParagraph().add(separatorText);
        Paragraph sinemsLogoContainer = getSinemsLogoContainerWithText(pdfData.getSinemsDate());
        document.add(separatorParagraph).add(sinemsLogoContainer);
    }
}
