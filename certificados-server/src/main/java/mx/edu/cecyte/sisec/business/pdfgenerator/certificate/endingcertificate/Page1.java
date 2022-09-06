package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.FitTextInCell;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;
import mx.edu.cecyte.sisec.shared.AppFunctions;

public class Page1 extends EndingCertificateShared {
    private final EndingPdfData pdfData;
    private final SetFooterImage setFooterImage;

    public Page1(PdfResources pdfResources, EndingPdfData pdfData, Document document, SetFooterImage setFooterImage) {
        super(pdfResources, document);
        this.pdfData = pdfData;
        this.setFooterImage = setFooterImage;
    }

    public void generate() {
        document.add(getEducationLogoParagraph());
        getHeadersParagraph();
        getStudentParagraph();
        document.add(getScoreParagraph(pdfData));
        getModuleParagraph();
        getStampParagraph();

        document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
    }

    private void getHeadersParagraph() {
        String title1 = "SISTEMA EDUCATIVO NACIONAL\n";
        String title2 = "Subsecretaría de Educación Media Superior\n";
        String title3 = "Dirección General del Colegio de Estudios Científicos y Tecnológicos del Estado de " + pdfData.getState();
        String title4 = "Organismo Descentralizado Estatal\n";
        String title5 = pdfData.getCertificateTypeId() + "\n";
        String title6 = pdfData.getEducationalOption() + "\n";
        title3 = AppFunctions.splitTextOnLines(title3, 2) + "\n";

        Text text1 = newTextMontserratBold(title1, 10f);
        Text text2 = newTextMontserratBold(title2, 8f);
        Text text3 = newTextMontserratBold(title3, 7f);
        Text text4 = newTextMontserratBold(title4 + title5 + title6, 6f);

        Paragraph text1Container = PdfFunctions.createParagraph().add(text1).setTextAlignment(TextAlignment.CENTER).setMarginTop(2f);
        Paragraph text2Container = PdfFunctions.createParagraph().add(text2).setTextAlignment(TextAlignment.CENTER);
        Paragraph text3Container = PdfFunctions.createParagraph().add(text3).setTextAlignment(TextAlignment.CENTER);
        Paragraph text4Container = PdfFunctions.createParagraph().add(text4).setTextAlignment(TextAlignment.CENTER);

        document.add(text1Container)
                .add(text2Container)
                .add(text3Container)
                .add(text4Container);
    }

    private void getStudentParagraph() {
        String schoolInfoString = "El Colegio de Estudios Científicos y Tecnológicos ";
        if (pdfData.isEmsad()) schoolInfoString = "El Centro de Educación Media Superior a Distancia ";
        schoolInfoString += pdfData.getSchoolName() + " ubicado en " + pdfData.getMunicipality() + ", " + pdfData.getState() + ", con Clave de Centro de Trabajo " + pdfData.getCct() + ", certifica que";
        schoolInfoString = AppFunctions.splitTextOnLines(schoolInfoString, 2);

        String studentNameString = AppFunctions.fullName(pdfData.getStudentName(), pdfData.getStudentFirstLastName(), pdfData.getStudentSecondLastName());
        String studentInfoString = "con Clave Única de Registro de Población " + pdfData.getCurp() + " y número de control " + pdfData.getEnrollmentKey() + ", acreditó totalmente el plan de estudios del bachillerato ";
        if (pdfData.isPortabilty())
            studentInfoString += "tecnológico";
        else if (pdfData.isCecyte())
            studentInfoString += "tecnológico con la carrera Técnica en " + pdfData.getCareerName() + ", clave " + pdfData.getCareerKey();
        else if (pdfData.isEmsad())
            studentInfoString += "general, con la formación elemental para el trabajo en " + pdfData.getCareerName();
        studentInfoString += ", en el periodo del " + pdfData.getEnrollmentStartDate() + " al " + pdfData.getEnrollmentEndDate() + ", con " + pdfData.getObtainedCredits() + " créditos, de un total de " + pdfData.getTotalCredits() + ".\n";

        Text schoolInfoText = newTextMontserrat(schoolInfoString, 9.5f);
        Text studentNameText = newTextMontserratBold(studentNameString, 14f);
        Text studentInfoText = newTextMontserrat(studentInfoString, 9.5f);

        Paragraph schoolInfoContainer = PdfFunctions.createParagraph().add(schoolInfoText).setTextAlignment(TextAlignment.CENTER).setMarginTop(15f).setMarginBottom(15f);
        Paragraph studentNameContainer = PdfFunctions.createParagraph().add(studentNameText).setTextAlignment(TextAlignment.CENTER);
        Paragraph studentInfoContainer = PdfFunctions.createParagraph().add(studentInfoText).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(15f).setMarginBottom(15f);

        document.add(schoolInfoContainer)
                .add(studentNameContainer)
                .add(studentInfoContainer);
    }

    private void getModuleParagraph() {
        String moduleString = "\nMódulos acreditados de formación profesional básica y extendida:";
        if (pdfData.isEmsad())
            moduleString = "\nSubmódulos acreditados de formación profesional básica:";
        String scoreHeaderString = "Calif.";
        String hourseHeaderString = "Total de Hrs.";
        String creditsHeaderString = "Créditos";

        Text moduleText = newTextMontserrat(moduleString, 8f);
        Text scoreHeaderText = newTextMontserrat(scoreHeaderString, 8f);
        Text hoursHeaderText = newTextMontserrat(hourseHeaderString, 8f);
        Text creditsHeaderText = newTextMontserrat(creditsHeaderString, 8f);

        Paragraph moduleContainer = PdfFunctions.createParagraph().add(moduleText).setTextAlignment(TextAlignment.JUSTIFIED);

        Paragraph emptyContainer = PdfFunctions.createParagraph().setMarginBottom(5f).setMarginTop(5f);
        Paragraph scoreHeaderContainer = PdfFunctions.createParagraph().add(scoreHeaderText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(5f).setMarginTop(5f);
        Paragraph hoursHeaderContainer = PdfFunctions.createParagraph().add(hoursHeaderText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(5f).setMarginTop(5f);
        Paragraph creditsHeaderContainer = PdfFunctions.createParagraph().add(creditsHeaderText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(5f).setMarginTop(5f);

        Cell numberHeaderCell = PdfFunctions.createCell().add(emptyContainer);
        Cell nameHeaderCell = PdfFunctions.createCell().add(emptyContainer);
        Cell emptyHeaderCell = PdfFunctions.createCell().add(emptyContainer);
        Cell scoreHeaderCell = PdfFunctions.createCell().add(scoreHeaderContainer);
        Cell hoursHeaderCell = PdfFunctions.createCell().add(hoursHeaderContainer);
        Cell creditsHeaderCell = PdfFunctions.createCell().add(creditsHeaderContainer);

        Table modulesTable = new Table(UnitValue.createPercentArray(new float[]{1, 23, 2, 3, 4, 1})).useAllAvailableWidth();
        modulesTable.addCell(numberHeaderCell)
                .addCell(nameHeaderCell)
                .addCell(emptyHeaderCell)
                .addCell(scoreHeaderCell)
                .addCell(hoursHeaderCell)
                .addCell(creditsHeaderCell);

        for (int i = 0; i < pdfData.getModules().size(); i++) {
            PdfModule module = pdfData.getModules().get(i);
            String number = PdfFunctions.romanLetter[i];
            if (pdfData.isEmsad())
                number = PdfFunctions.number[i];
            Text numberText = newTextMontserrat(number, 8f);
            Text nameText = newTextMontserrat(module.getName(), 8f);
            Text scoreText = newTextMontserrat(module.getScore(), 8f);
            Text hoursText = newTextMontserrat(module.getHours(), 8f);
            Text creditsText = newTextMontserrat(module.getCredits(), 8f);

            Paragraph numberContainer = PdfFunctions.createParagraph().add(numberText).setMarginTop(3f);
            Paragraph nameContainer = PdfFunctions.createParagraph().add(nameText).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(3f);
            Paragraph scoreContainer = PdfFunctions.createParagraph().add(scoreText).setTextAlignment(TextAlignment.CENTER).setMarginTop(3f);
            Paragraph hoursContainer = PdfFunctions.createParagraph().add(hoursText).setTextAlignment(TextAlignment.CENTER).setMarginTop(3f);
            Paragraph creditsContainer = PdfFunctions.createParagraph().add(creditsText).setTextAlignment(TextAlignment.CENTER).setMarginTop(3f);

            Cell numberCell = PdfFunctions.createCell().add(numberContainer);
            Cell nameCell = PdfFunctions.createCell().add(nameContainer);
            Cell emptyCell = PdfFunctions.createCell();
            Cell scoreCell = PdfFunctions.createCell().add(scoreContainer);
            Cell hoursCell = PdfFunctions.createCell().add(hoursContainer);
            Cell creditsCell = PdfFunctions.createCell().add(creditsContainer);

            modulesTable.addCell(numberCell)
                    .addCell(nameCell)
                    .addCell(emptyCell)
                    .addCell(scoreCell)
                    .addCell(hoursCell)
                    .addCell(creditsCell);
        }
        document.add(moduleContainer);
        document.add(modulesTable);
    }

    private void getStampParagraph() {
        Image qrImage = PdfFunctions.generateQr(pdfData.getFolioNumber());

        String informationString = "\n\nEl presente documento electrónico ha sido firmado mediante el uso de la firma electrónica avanzada por el servidor público competente, amparada por un certificado digital vigente a la fecha de su elaboración, y es válido de conformidad con lo dispuesto en los artículos 1, 2, fracciones IV, V, XIII y XIV, 3, fracciones I y II, 7, 8, 9, 13, 14, 16 y 25 de la Ley de Firma Electrónica Avanzada; 7 y 12 del Reglamento de la Ley de Firma Electrónica Avanzada; su integridad y autoría se podrá comprobar en: " +
                "https://certificados.cecyte.edu.mx/Folio/" +
                " o por medio del código QR.\n\nCon fundamento en lo dispuesto en el artículo 141 de la Ley General de Educación, los certificados de estudios expedidos por instituciones del Sistema Educativo Nacional, tienen validez en la República Mexicana sin necesidad de trámites adicionales de autenticación o legalización, lo cual permite el tránsito del estudiante por el Sistema Educativo Nacional.\n\n\n\n\n\n";
        String printString = "\nEl presente documento se imprime en " + pdfData.getMunicipality() + ", " + pdfData.getState() + ", " + pdfData.getPrintDate() + ".\n\n";

        Text informationText = newTextMontserrat(informationString, 8f);
        Text printText = newTextMontserrat(printString, 8f);

        Paragraph qrContainer = PdfFunctions.createParagraph().add(qrImage);
        Paragraph stampContainer = getStampContainer(pdfData).add(informationText).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph folioContainer = getFolioContainer(pdfData.getFolioNumber());
        Paragraph printContainer = PdfFunctions.createParagraph().add(printText);

        Cell qrCell = PdfFunctions.createCell().add(qrContainer);
        float stampContainerHeight = PdfFunctions.getHeight(document, stampContainer);

        Cell stampCell = PdfFunctions.createCell()
                .setHeight(stampContainerHeight)
                .setVerticalAlignment(VerticalAlignment.TOP);
        stampCell.setNextRenderer(new FitTextInCell(stampCell, stampContainer));

        Cell folioCell = PdfFunctions.createCell(2).add(folioContainer);
        Cell printCell = PdfFunctions.createCell(2).add(printContainer);

        Table footerTable = new Table(UnitValue.createPercentArray(new float[]{14, 76}))
                .useAllAvailableWidth()
                .addCell(qrCell)
                .addCell(stampCell)
                .addCell(folioCell)
                .addCell(printCell);

        Paragraph footerContainer = PdfFunctions.createParagraph().add(footerTable);
        setFooterParagraph(footerContainer);

        document.add(footerContainer);
    }
}

