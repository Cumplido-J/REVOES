package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;

import java.util.List;

public class Page4Temporary extends EndingCertificateShared {
    private final EndingPdfData pdfData;

    public Page4Temporary(PdfResources pdfResources, EndingPdfData pdfData, Document document) {
        super(pdfResources, document);
        this.pdfData = pdfData;
    }

    public void generate() {
        document.add(getCecyteHeaderTemporary(pdfData.getFolioNumber()));
        document.add(getEscudoTemporary());
        getContentParagraph();
        getStampParagraph();
        getSinemsLogoTemporary();
        //document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
    }

    private void getStampParagraph() {
        String separatorString = "\n\n";
        Text separatorText = new Text(separatorString);
        Paragraph stampContainer = getStampContainerTempory(pdfData).add(separatorText);
        setFooterParagraph(stampContainer);
        document.add(stampContainer);
    }

    private void getContentParagraph() {
        String titleString = "\nPerfil específico ";
        if (pdfData.isCecyte()) titleString += "del Bachillerato Tecnológico";
        if (pdfData.isEmsad()) titleString += "de la Educación Media Superior a Distancia";
        titleString += " del Estado de " + pdfData.getState();
        String subtitle1String = "\n\nCompetencias disciplinares extendidas";
        String content1String = "\nConforme a las asignaturas acreditadas";
        if (pdfData.isCecyte()) content1String += " del área " + pdfData.getStudyArea();
        content1String += " del campo disciplinar de " + pdfData.getDisciplinaryField() + ".";

        String subtitle2String = "\n\n\nCompetencias profesionales básicas";
        String content2String = "\nConforme a los módulos acreditados de ";
        if (pdfData.isCecyte()) content2String += "la carrera técnica";
        if (pdfData.isEmsad()) content2String += "formación elemental para el trabajo";
        content2String += " en: " + pdfData.getCareerName() + ".\n\n";

        Text titleText = newTextMontserrat(titleString, 11.5f);
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

    private void getSinemsLogoTemporary() {
        String separatorString = "\n\n\n";
        String infoString = "El perfil de competencias en la EMS, aplica a partir del ciclo escolar 2009-2010.\n\n";
        Text infoText = newTextMontserrat(infoString, 7f);
        Text separatorText = new Text(separatorString);
        Paragraph separatorParagraph = PdfFunctions.createParagraph().add(separatorText);
        Paragraph infoParagraph = PdfFunctions.createParagraph().add(infoText).setTextAlignment(TextAlignment.RIGHT);
        Paragraph sinemsLogoContainer = getSinemsLogoContainerWithTextTemporary(pdfData.getSinemsDate());
        if (pdfData.getSinemsDate() != null) document.add(separatorParagraph).add(infoParagraph).add(sinemsLogoContainer);
        else document.add(separatorParagraph).add(infoParagraph);
    }
}
