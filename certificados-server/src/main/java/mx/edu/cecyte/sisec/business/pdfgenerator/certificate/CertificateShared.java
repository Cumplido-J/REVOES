package mx.edu.cecyte.sisec.business.pdfgenerator.certificate;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.VerticalAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.shared.AppFunctions;

public class CertificateShared {
    protected final PdfResources pdfResources;
    protected final Document document;

    public CertificateShared(PdfResources pdfResources, Document document) {
        this.pdfResources = pdfResources;
        this.document = document;
    }

    protected Paragraph getFolioContainer(String folioNumber) {
        String folioString = "Folio ";
        Text folioStringText = newTextMontserratBold(folioString, 9f);
        Text folioText = newTextMontserrat(folioNumber, 9f);
        return PdfFunctions.createParagraph()
                .add(folioStringText)
                .add(folioText);
    }

    protected Paragraph getStampContainer(PdfData pdfData) {
        String directorString = "Autoridad educativa: ";
        String directorNameString = AppFunctions.fullName(pdfData.getDirectorName(), pdfData.getDirectorFirstLastName(), pdfData.getDirectorSecondLastName()) + " - " + pdfData.getDirectorPosition() + ".";
        String certificateNumberString = "\nNo. certificado autoridad educativa: ";
        String digitalStampString = "\nSello digital autoridad educativa:\n";
        String stampDateString = "\n\nFecha y hora de timbrado: ";
        String sepStampString = "\nSello digital SEP:\n";
        if (pdfData.isBlank()) {
            stampDateString = "\n\n" + stampDateString;
            sepStampString = sepStampString + "\n\n";
            directorNameString = "";
        }
        Text directorText = newTextMontserratBold(directorString, 8f);
        Text directorNameText = newTextMontserrat(directorNameString, 8f);
        Text certificateNumberStringText = newTextMontserratBold(certificateNumberString, 8f);
        Text certificateNumberText = newTextMontserrat(pdfData.getCertificateNumber(), 8f);
        Text digitalStampStringText = newTextMontserratBold(digitalStampString, 8f);
        Text digitalStampText = newTextMontserrat(pdfData.getDigitalStamp(), 8f);
        Text stampDateStringText = newTextMontserratBold(stampDateString, 8f);
        Text stampDateText = newTextMontserrat(pdfData.getSepDate(), 8f);
        Text sepStampStringText = newTextMontserratBold(sepStampString, 8f);
        Text sepStampText = newTextMontserrat(pdfData.getSepStamp(), 8f);

        return PdfFunctions.createParagraph()
                .add(directorText)
                .add(directorNameText)
                .add(certificateNumberStringText)
                .add(certificateNumberText)
                .add(digitalStampStringText)
                .add(digitalStampText)
                .add(stampDateStringText)
                .add(stampDateText)
                .add(sepStampStringText)
                .add(sepStampText)
                .setTextAlignment(TextAlignment.JUSTIFIED);
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
                .add(educationLogo)
                .setTextAlignment(TextAlignment.CENTER);

    }

    protected Paragraph getCecyteLogoParagraph() {
        Image cecyteLogo = pdfResources.getCecyteLogo();
        return PdfFunctions.createParagraph().add(cecyteLogo);

    }

    protected Paragraph getScoreParagraph(PdfData pdfData) {
        String scoreString = "Promedio de Aprovechamiento:";
        Text scoreText = newTextMontserratBold(scoreString, 9f);
        Text scoreNumberText = newTextMontserrat(pdfData.getFinalScore(), 9f);
        Text scoreLetterText = newTextMontserrat(pdfData.getLetterScore(), 9f);

        Paragraph scoreContainer = PdfFunctions.createParagraph().add(scoreText).setTextAlignment(TextAlignment.CENTER);
        Paragraph scoreNumberContainer = PdfFunctions.createParagraph().add(scoreNumberText)
                .setTextAlignment(TextAlignment.CENTER)
                .setPaddings(3f, 20f, 3f, 15f)
                .setBorder(new SolidBorder(1))
                .setMarginLeft(PdfFunctions.cmToPoints(1f));

        Paragraph scoreLetterContainer = PdfFunctions.createParagraph().add(scoreLetterText)
                .setTextAlignment(TextAlignment.CENTER)
                .setPaddings(3f, 20f, 3f, 15f)
                .setBorder(new SolidBorder(1))
                .setMarginLeft(PdfFunctions.cmToPoints(1f));
        if (pdfData.isBlank()) {
            scoreNumberContainer.setPaddings(9f, 20f, 9f, 20f);
            scoreLetterContainer.setPaddings(9f, 50f, 9f, 50f);
        }
        return PdfFunctions.createParagraph()
                .add(scoreContainer)
                .add(scoreNumberContainer)
                .add(scoreLetterContainer)
                .setMarginBottom(5f)
                .setTextAlignment(TextAlignment.CENTER);
    }

    protected Paragraph getCecyteHeader(String folioNumber) {
        Paragraph cecyteLogoContainer = getCecyteLogoParagraph();
        Paragraph folioContainer = getFolioContainer(folioNumber);
        if (folioNumber.trim().length() == 0) {
            folioContainer.setMarginRight(170f);
        }

        Cell cecyteLogoCell = PdfFunctions.createCell().add(cecyteLogoContainer);
        Cell folioCell = PdfFunctions.createCell().add(folioContainer).setTextAlignment(TextAlignment.RIGHT).setVerticalAlignment(VerticalAlignment.MIDDLE);

        Table headerTable = new Table(2).useAllAvailableWidth().addCell(cecyteLogoCell).addCell(folioCell);

        return PdfFunctions.createParagraph().add(headerTable);
    }

    protected Paragraph getSinemsLogoContainer(String sinemsDate) {
        String registerString = "\nFecha de registro: " + sinemsDate + ".";

        Image sinemsLogo = pdfResources.getSinemsLogo();
        Text registerText = newTextMontserrat(registerString, 7f);
        Paragraph paragraph = PdfFunctions.createParagraph()
                .setTextAlignment(TextAlignment.RIGHT);

        if (sinemsDate != null) paragraph.add(sinemsLogo).add(registerText);
        return paragraph;
    }
    protected Paragraph getSinemsLogoContainerTemporary(String sinemsDate) {
        String registerString = "\n\nFecha de registro: " + sinemsDate + ".";

        Image sinemsLogo = pdfResources.getSinemsLogo().setWidth(PdfFunctions.cmToPoints(4.5f));
        Text registerText = newTextMontserrat(registerString, 6f);
        Paragraph paragraph = PdfFunctions.createParagraph()
                .setTextAlignment(TextAlignment.RIGHT);

        if (sinemsDate != null) paragraph.add(sinemsLogo).add(registerText);
        return paragraph;
    }

    protected Text newTextMontserrat(String string, float fontSize) {
        return PdfFunctions.createText(string, fontSize).setFont(pdfResources.getMontserrat());
    }

    protected Text newTextMontserratBold(String string, float fontSize) {
        return PdfFunctions.createText(string, fontSize).setFont(pdfResources.getMontserratBold());
    }

    /*protected Paragraph getStampContainerAbrogated(PdfData pdfData) {
        String directorString = "Autoridad educativa: ";
        String directorNameString = AppFunctions.fullName(pdfData.getDirectorName(), pdfData.getDirectorFirstLastName(), pdfData.getDirectorSecondLastName()) + " - " + pdfData.getDirectorPosition() + ".";
        String certificateNumberString = "\nNo. certificado autoridad educativa: ";
        String digitalStampString = "\nSello digital autoridad educativa:\n";
        String stampDateString = "\n\nFecha y hora de timbrado: ";
        String sepStampString = "\nSello digital SEP:\n";
        if (pdfData.isBlank()) {
            stampDateString = "\n\n" + stampDateString;
            sepStampString = sepStampString + "\n\n";
            directorNameString = "";
        }
        Text directorText = newTextMontserratBold(directorString, 8f);
        Text directorNameText = newTextMontserrat(directorNameString, 8f);
        Text certificateNumberStringText = newTextMontserratBold(certificateNumberString, 8f);
        Text certificateNumberText = newTextMontserrat(pdfData.getCertificateNumber(), 8f);
        Text digitalStampStringText = newTextMontserratBold(digitalStampString, 8f);
        Text digitalStampText = newTextMontserrat(pdfData.getDigitalStamp(), 8f);
        Text stampDateStringText = newTextMontserratBold(stampDateString, 8f);
        Text stampDateText = newTextMontserrat(pdfData.getSepDate(), 8f);
        Text sepStampStringText = newTextMontserratBold(sepStampString, 8f);
        Text sepStampText = newTextMontserrat(pdfData.getSepStamp(), 8f);


        return PdfFunctions.createParagraphAbrogated()
                .add(directorText)
                .add(directorNameText)
                .add(certificateNumberStringText)
                .add(certificateNumberText)
                .add(digitalStampStringText)
                .add(digitalStampText)
                .add(stampDateStringText)
                .add(stampDateText)
                .add(sepStampStringText)
                .add(sepStampText)
                .setTextAlignment(TextAlignment.JUSTIFIED);
    }*/

    protected Paragraph getStampContainerAbrogated(PdfData pdfData) {
        String directorString = "Autoridad educativa: ";
        String directorNameString = AppFunctions.fullName(pdfData.getDirectorName(), pdfData.getDirectorFirstLastName(), pdfData.getDirectorSecondLastName()) + " - " + pdfData.getDirectorPosition() + ".";
        String certificateNumberString = "\nNo. certificado autoridad educativa: ";
        String digitalStampString = "\nSello digital autoridad educativa:\n";
        String stampDateString = "\n\nFecha y hora de timbrado: ";
        String sepStampString = "\nSello digital SEP:\n";
        if (pdfData.isBlank()) {
            stampDateString = "\n\n" + stampDateString;
            sepStampString = sepStampString + "\n\n";
            directorNameString = "";
        }
        Text directorText = newTextMontserratBold(directorString, 8f);
        Text directorNameText = newTextMontserrat(directorNameString, 8f);
        Text certificateNumberStringText = newTextMontserratBold(certificateNumberString, 8f);
        Text certificateNumberText = newTextMontserrat(pdfData.getCertificateNumber(), 8f);
        Text digitalStampStringText = newTextMontserratBold(digitalStampString, 8f);
        Text digitalStampText = newTextMontserrat(pdfData.getDigitalStamp(), 8f);
        Text stampDateStringText = newTextMontserratBold(stampDateString, 8f);
        Text stampDateText = newTextMontserrat(pdfData.getSepDate(), 8f);
        Text sepStampStringText = newTextMontserratBold(sepStampString, 8f);
        Text sepStampText = newTextMontserrat(pdfData.getSepStamp(), 8f);

        return PdfFunctions.createParagraphAbrogated()
                .add(directorText)
                .add(directorNameText)
                .add(certificateNumberStringText)
                .add(certificateNumberText)
                .add(digitalStampStringText)
                .add(digitalStampText)
                .add(stampDateStringText)
                .add(stampDateText)
                .add(sepStampStringText)
                .add(sepStampText)
                .setTextAlignment(TextAlignment.JUSTIFIED);
    }

    protected Paragraph getScoreParagraphAbrogated(PdfData pdfData) {
        String scoreString = "Promedio de Aprovechamiento:";
        Text scoreText = newTextMontserratBold(scoreString, 9f);
        Text scoreNumberText = newTextMontserrat(pdfData.getFinalScore(), 9f);
        Text scoreLetterText = newTextMontserrat(pdfData.getLetterScore(), 9f);

        Paragraph scoreContainer = PdfFunctions.createParagraph().add(scoreText).setMarginLeft(85f);
        Paragraph scoreNumberContainer = PdfFunctions.createParagraph().add(scoreNumberText)
                .setTextAlignment(TextAlignment.CENTER)
                .setPaddings(3f, 20f, 3f, 15f)
                .setBorder(new SolidBorder(1))
                .setMarginLeft(37f);

        Paragraph scoreLetterContainer = PdfFunctions.createParagraph().add(scoreLetterText)

                .setPaddings(3f, 23.7f, 3f, 23.7f)
                .setBorder(new SolidBorder(1))
                .setMarginLeft(47f);

        if (pdfData.isBlank()) {
            scoreNumberContainer.setPaddings(9f, 20f, 9f, 20f);
            scoreLetterContainer.setPaddings(9f, 50f, 9f, 50f);
        }
        return PdfFunctions.createParagraph()
                .add(scoreContainer)
                .add(scoreNumberContainer)
                .add(scoreLetterContainer)
                .setMarginBottom(10.1f)
                ;
    }

    protected Paragraph getLogoEducacionTemporaryParagraph() {
        Image temporaryLogo = pdfResources.getLogoEducacionTemporary();
        return PdfFunctions.createParagraph()
                .add(temporaryLogo)
                .setTextAlignment(TextAlignment.CENTER);
    }

    protected Paragraph getLogoEducationHeadTempParagraph() {
        Image temporaryLogo = pdfResources.getLogoEducationHeadTemp();
        return PdfFunctions.createParagraph()
                .add(temporaryLogo)
                .setTextAlignment(TextAlignment.CENTER);
    }

    protected Paragraph getMarcoTemporary() {
        Image degreeOvalo = pdfResources.getMarcoTemporary();
        return PdfFunctions.createParagraph()
                .add(degreeOvalo);
    }

    protected Paragraph getEscudoTemporary() {
        Image escudotemporary = pdfResources.getEscudoTemporary();
        return PdfFunctions.createParagraph()
                .add(escudotemporary);
    }

    protected Paragraph getFolioContainerTemporary(String folioNumber) {
        String folioString = "Folio ";
        Text folioStringText = newTextMontserratBold(folioString, 8f);
        Text folioText = newTextMontserrat(folioNumber, 8f);
        return PdfFunctions.createParagraph()
                .add(folioStringText)
                .add(folioText);
    }


    protected Paragraph getStampContainerTempory(PdfData pdfData) {
        String directorString = "Autoridad educativa: ";
        String directorNameString = AppFunctions.fullName(pdfData.getDirectorName(), pdfData.getDirectorFirstLastName(), pdfData.getDirectorSecondLastName()) + " - " + pdfData.getDirectorPosition() + ".";
        String certificateNumberString = "\nNo. certificado autoridad educativa: ";
        String digitalStampString = "\nSello digital autoridad educativa:\n";
        String stampDateString = "\n\nFecha y hora de timbrado: ";
        String sepStampString = "\nSello digital SEP:\n";
        if (pdfData.isBlank()) {
            stampDateString = "\n\n" + stampDateString;
            sepStampString = sepStampString + "\n\n";
            directorNameString = "";
        }
        Text directorText = newTextMontserratBold(directorString, 7f);
        Text directorNameText = newTextMontserrat(directorNameString, 7f);
        Text certificateNumberStringText = newTextMontserratBold(certificateNumberString, 7f);
        Text certificateNumberText = newTextMontserrat(pdfData.getCertificateNumber(), 7f);
        Text digitalStampStringText = newTextMontserratBold(digitalStampString, 7f);
        Text digitalStampText = newTextMontserrat(pdfData.getDigitalStamp(), 7f);
        Text stampDateStringText = newTextMontserratBold(stampDateString, 7f);
        Text stampDateText = newTextMontserrat(pdfData.getSepDate(), 7f);
        Text sepStampStringText = newTextMontserratBold(sepStampString, 7f);
        Text sepStampText = newTextMontserrat(pdfData.getSepStamp(), 7f);

        return PdfFunctions.createParagraph()
                .add(directorText)
                .add(directorNameText)
                .add(certificateNumberStringText)
                .add(certificateNumberText)
                .add(digitalStampStringText).setFontSize(7f)
                .add(digitalStampText)
                .add(stampDateStringText)
                .add(stampDateText)
                .add(sepStampStringText)
                .add(sepStampText)
                .setTextAlignment(TextAlignment.JUSTIFIED);
    }

    protected Paragraph getCecyteHeaderTemporary(String folioNumber) {
        Paragraph cecyteLogoContainer = getCecyteLogoParagraph();
        Paragraph folioContainer = getFolioContainerTemporary(folioNumber);
        if (folioNumber.trim().length() == 0) {
            folioContainer.setMarginRight(170f);
        }

        Cell cecyteLogoCell = PdfFunctions.createCell().add(cecyteLogoContainer).setTextAlignment(TextAlignment.LEFT);
        Cell folioCell = PdfFunctions.createCell().add(folioContainer).setTextAlignment(TextAlignment.RIGHT);/*.setVerticalAlignment(VerticalAlignment.MIDDLE)*/
        ;

        Cell logoCecyte = new Cell();
        Cell folioString = new Cell();

        logoCecyte.add(cecyteLogoContainer).setBorder(Border.NO_BORDER);
        folioString.add(folioContainer).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);

        Table headerTable = new Table(new float[]{PdfFunctions.cmToPoints(9.795f), PdfFunctions.cmToPoints(9.795f)});///.useAllAvailableWidth().addCell(cecyteLogoCell).addCell(folioCell);
        headerTable.setWidth(PdfFunctions.cmToPoints(19.59f));//.setMarginLeft(PdfFunctions.cmToPoints(1f));

        headerTable.addCell(logoCecyte).addCell(folioString);

        return PdfFunctions.createParagraph().add(headerTable);
    }
}
