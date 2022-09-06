package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

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
import org.springframework.util.StringUtils;

public class Page1 extends PartialCertificateShared {
    private final PartialPdfData pdfData;
    private final SetFooterImage setFooterImage;

    public Page1(PdfResources pdfResources, PartialPdfData pdfData, Document document, SetFooterImage setFooterImage) {
        super(pdfResources, document);
        this.pdfData = pdfData;
        this.setFooterImage = setFooterImage;
    }

    public void generate() {
        document.add(getEducationLogoParagraph());
        getHeadersParagraph();
        getStudentParagraph();
        document.add(getScoreParagraph(pdfData));
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
        schoolInfoString += pdfData.getSchoolName() + ", ubicado en " + pdfData.getMunicipality() + ", " + pdfData.getState() + ", con Clave de Centro de Trabajo " + pdfData.getCct() + ", certifica que";
        schoolInfoString = AppFunctions.splitTextOnLines(schoolInfoString, 2);

//        String schoolInfoString = "El Colegio de Estudios Científicos y Tecnológicos ";
//        if (pdfData.isEmsad()) schoolInfoString = "El Centro de Educación Media Superior ";
//        schoolInfoString += pdfData.getSchoolName() + ",\n";
//        schoolInfoString += "ubicado en " + pdfData.getMunicipality() + ", " + pdfData.getState() + ", con Clave de Centro de Trabajo " + pdfData.getCct() + ", certifica que";

        if (pdfData.isBlank()) {
            if (pdfData.isCecyte())
                schoolInfoString = "El Colegio de Estudios Científicos y Tecnológicos Plantel No.       ,                     ,\n";
            if (pdfData.isEmsad())
                schoolInfoString = "El Centro de Educación Media Superior a Distancia Plantel No.       ,                         ,\n";
            schoolInfoString += "ubicado en " + pdfData.getMunicipality() + ", " + pdfData.getState() + ", con Clave de Centro de Trabajo                  , certifica que";
        }

        String studentNameString = AppFunctions.fullName(pdfData.getStudentName(), pdfData.getStudentFirstLastName(), pdfData.getStudentSecondLastName());
        String studentInfoString = "con Clave Única de Registro de Población " + pdfData.getCurp() + " y número de control " + pdfData.getEnrollmentKey() + ", acreditó parcialmente el plan de estudios del bachillerato ";
        if (pdfData.isCecyte()) {
            studentInfoString += "tecnológico";
            if (!StringUtils.isEmpty(pdfData.getCareerName())) {
                studentInfoString += " con la carrera Técnica en " + pdfData.getCareerName();
                if (!StringUtils.isEmpty(pdfData.getCareerKey())){
                    studentInfoString += ", clave " + pdfData.getCareerKey();
                }
            }
        } else if (pdfData.isEmsad()) {
            studentInfoString += "general, con la formación elemental para el trabajo en " + pdfData.getCareerName();
        }

        studentInfoString += ", en el periodo del " + pdfData.getEnrollmentStartDate() + " al " + pdfData.getEnrollmentEndDate() + ", con " + pdfData.getObtainedCredits() + " créditos, de un total de " + pdfData.getTotalCredits() + ".\n";

        Text schoolInfoText = newTextMontserrat(schoolInfoString, 9.5f);
        Text studentNameText = newTextMontserratBold(studentNameString, 14f);
        Text studentInfoText = newTextMontserrat(studentInfoString, 9.5f);

        Paragraph schoolInfoContainer = PdfFunctions.createParagraph().add(schoolInfoText).setTextAlignment(TextAlignment.CENTER).setMarginTop(15f).setMarginBottom(15f);
        Paragraph studentNameContainer = PdfFunctions.createParagraph().add(studentNameText).setTextAlignment(TextAlignment.CENTER);
        Paragraph studentInfoContainer = PdfFunctions.createParagraph().add(studentInfoText).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(15f).setMarginBottom(20f);

        if (pdfData.isBlank()) studentNameContainer.setMarginTop(14f);
        document.add(schoolInfoContainer)
                .add(studentNameContainer)
                .add(studentInfoContainer);
    }

    private void getStampParagraph() {
        Image qrImage = PdfFunctions.generateQr(pdfData.getFolioNumber());

        String informationString = "\n\nEl presente documento electrónico ha sido firmado mediante el uso de la firma electrónica avanzada por el servidor público competente, amparada por un certificado digital vigente a la fecha de su elaboración, y es válido de conformidad con lo dispuesto en los artículos 1, 2, fracciones IV, V, XIII y XIV, 3, fracciones I y II, 7, 8, 9, 13, 14, 16 y 25 de la Ley de Firma Electrónica Avanzada; 7 y 12 del Reglamento de la Ley de Firma Electrónica Avanzada; su integridad y autoría se podrá comprobar en: " +
                "https://certificados.cecyte.edu.mx/Folio/" +
                " o por medio del código QR.\n\nCon fundamento en lo dispuesto en el artículo 141 de la Ley General de Educación, los certificados de estudios expedidos por instituciones del Sistema Educativo Nacional, tienen validez en la República Mexicana sin necesidad de trámites adicionales de autenticación o legalización, lo cual permite el tránsito del estudiante por el Sistema Educativo Nacional.\n\n\n\n\n\n\n";
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

