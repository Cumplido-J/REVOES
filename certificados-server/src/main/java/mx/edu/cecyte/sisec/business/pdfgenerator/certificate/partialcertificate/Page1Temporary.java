package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.FitTextInCell;
import mx.edu.cecyte.sisec.shared.AppFunctions;

public class Page1Temporary extends PartialCertificateShared {
    private final PartialPdfData pdfData;

    public Page1Temporary(PdfResources pdfResources, PartialPdfData pdfData, Document document) {
        super(pdfResources, document);
        this.pdfData = pdfData;
    }

    public void generate() {

        document.add(getMarcoTemporary());
        document.add(getLogoEducacionTemporaryParagraph());
        document.add(getEscudoTemporary());
        getHeadersParagraph();
        getStudentParagraph();
        getStampParagraph();

        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
    }

    private void getHeadersParagraph() {
        String title1 = "SISTEMA EDUCATIVO NACIONAL\n";
        String title2 = "Subsecretaría de Educación Media Superior\n";
        String title3 = "Dirección General del Colegio de Estudios Científicos y Tecnológicos del Estado de " + pdfData.getState();
        String title4 = " Organismo Público Descentralizado Estatal\n";
        String title5 = pdfData.getEducationalOption()  + "\n";
        String title6 = pdfData.getCertificateTypeId()  + "\n";
        //title3 = AppFunctions.splitTextOnLines(title3, 2) + "\n";

        Text text1 = newTextMontserratBold(title1, 14.5f);
        Text text2 = newTextMontserratBold(title2, 8f);
        Text text3 = newTextMontserratBold(title3, 8f);
        Text text4 = newTextMontserratBold(title4 + title5 , 8f);
        Text text5 = newTextMontserratBold(title6, 11f);

        Paragraph text1Container = PdfFunctions.createParagraph().add(text1).setTextAlignment(TextAlignment.CENTER).setMarginTop((5f));
        Paragraph text2Container = PdfFunctions.createParagraph().add(text2).setTextAlignment(TextAlignment.CENTER);
        Paragraph text3Container = PdfFunctions.createParagraph().add(text3).setTextAlignment(TextAlignment.CENTER);
        Paragraph text4Container = PdfFunctions.createParagraph().add(text4).setTextAlignment(TextAlignment.CENTER);
        Paragraph text5Container = PdfFunctions.createParagraph().add(text5).setTextAlignment(TextAlignment.CENTER);
        Paragraph saltoDeLinea1 = new Paragraph(" ");

        document.add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(saltoDeLinea1)
                .add(text1Container)
                .add(text2Container)
                .add(text3Container)
                .add(text4Container)
                .add(text5Container);
    }



    private void getStudentParagraph() {
        Color headerBg = new DeviceRgb(0xD4, 0xC1, 0x9C);
        Color colorLine = new DeviceRgb(0xD9, 0xD9, 0xD9);

        String presentation = "Se expide a:";
        Text presentationText = newTextMontserratBold(presentation, 10f);
        Paragraph presentationParagraph = PdfFunctions.createParagraph().add(presentationText).setTextAlignment(TextAlignment.JUSTIFIED).setMargins(0f, 0f,0f,PdfFunctions.cmToPoints(0.7f));
        document.add(presentationParagraph);

        String titleData = "Datos del estudiante";
        Text titleDataText = newTextMontserrat(titleData, 7f);
        Paragraph titleDataContainer = PdfFunctions.createParagraph().add(titleDataText).setTextAlignment(TextAlignment.CENTER);
        Cell titleDataCell = PdfFunctions.createCell().add(titleDataContainer);

        Table tableData = new Table(new float[]{PdfFunctions.cmToPoints(18.19f)});
        tableData.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f)).setMarginTop(0.5f);
        tableData.addCell(titleDataCell);
        tableData.setBackgroundColor(headerBg);
        document.add(tableData);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String studentNameString = AppFunctions.fullName(pdfData.getStudentName(), pdfData.getStudentFirstLastName(), pdfData.getStudentSecondLastName());
        Text studentNameStringText = newTextMontserratBold(studentNameString, 10f);
        Paragraph studentNameContainer = PdfFunctions.createParagraph().add(studentNameStringText).setTextAlignment(TextAlignment.CENTER);

        Cell scoreHeaderCell = PdfFunctions.createCell().add(studentNameContainer);
        Table studentNameTable = new Table(new float[]{PdfFunctions.cmToPoints(18.19f)});
        studentNameTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        studentNameTable.addCell(scoreHeaderCell).setBorderBottom(new SolidBorder(colorLine, 0.1f));
        document.add(studentNameTable);

        String studentDataString = "Nombre(s) Primer apellido Segundo apellido";
        Text studentDataStringText = newTextMontserrat(studentDataString, 7f);
        Paragraph studentDataContainer = PdfFunctions.createParagraph().add(studentDataStringText).setTextAlignment(TextAlignment.CENTER);

        Cell studentDataCell = PdfFunctions.createCell().add(studentDataContainer);
        Table studentDataTable = new Table(new float[]{PdfFunctions.cmToPoints(18.19f)});
        studentDataTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        studentDataTable.addCell(studentDataCell);
        document.add(studentDataTable);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String studentCurpString = pdfData.getCurp();
        String studentMatriculaString = pdfData.getEnrollmentKey();
        String leyendaCurpString = "CURP";
        String leyendaMatriculaString = "Número de control o matrícula";

        Text studentCurpStringText = newTextMontserrat(studentCurpString, 9f);
        Text studentMatriculaStringText = newTextMontserrat(studentMatriculaString, 9f);
        Text leyendaCurpStringText = newTextMontserrat(leyendaCurpString, 7f);
        Text leyendaMatriculaText = newTextMontserrat(leyendaMatriculaString, 7f);

        Paragraph studentCurpContainer = PdfFunctions.createParagraph().add(studentCurpStringText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph studentMatriculontainer = PdfFunctions.createParagraph().add(studentMatriculaStringText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph leyendacurpContainer = PdfFunctions.createParagraph().add(leyendaCurpStringText).setTextAlignment(TextAlignment.CENTER);
        Paragraph leyendaMatriculaContainer = PdfFunctions.createParagraph().add(leyendaMatriculaText).setTextAlignment(TextAlignment.CENTER);

        Table tabla = new Table(new float[]{ PdfFunctions.cmToPoints(8.845f), PdfFunctions.cmToPoints(0.5f), PdfFunctions.cmToPoints(8.845f)});
        tabla.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        Cell celda1 = new Cell();
        Cell celda2 = new Cell();
        Cell celda3 = new Cell();
        Cell celda4 = new Cell();
        Cell celda5 = new Cell();
        Cell celda6 = new Cell();

        celda1.add(studentCurpContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));
        celda2.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        celda3.add(studentMatriculontainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));

        celda4.add(leyendacurpContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));
        celda5.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        celda6.add(leyendaMatriculaContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));

        tabla.addCell(celda1);
        tabla.addCell(celda2);
        tabla.addCell(celda3);
        tabla.addCell(celda4);
        tabla.addCell(celda5);
        tabla.addCell(celda6);
        document.add(tabla);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String dividerTitleString = "Datos del plantel o servicio educativo e información académica";
        Text dividerTitleText = newTextMontserrat(dividerTitleString, 7f);
        Paragraph dividerTitleContainer = PdfFunctions.createParagraph().add(dividerTitleText).setTextAlignment(TextAlignment.CENTER);
        Cell dividerTitleCell = PdfFunctions.createCell().add(dividerTitleContainer);

        Table dividerTitleTable = new Table(1);
        dividerTitleTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f)).setMarginTop(0.5f);
        dividerTitleTable.addCell(dividerTitleCell);
        dividerTitleTable.setBackgroundColor(headerBg);
        document.add(dividerTitleTable);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String nameComplete1 = "Colegio de Estudios Científicos y Tecnológicos del Estado de " + pdfData.getState() + " ";
        String nameComplete2 = "Centro de Educación Media Superior a Distancia ";
        String schoolNameString = null;
        if (pdfData.isCecyte()) {
            schoolNameString = nameComplete1 + pdfData.getSchoolName();
        } else if (pdfData.isEmsad()) {
            schoolNameString = nameComplete2 + pdfData.getSchoolName();
        }
        Text schoolNameStringText = newTextMontserrat(schoolNameString, 9f);
        Paragraph schoolNameContainer = PdfFunctions.createParagraph().add(schoolNameStringText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(0.8f);

        Cell schoolNameCell = PdfFunctions.createCell().add(schoolNameContainer);
        Table schoolNameTable = new Table(new float[]{PdfFunctions.cmToPoints(18.19f)});
        schoolNameTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        schoolNameTable.addCell(schoolNameCell).setBorderBottom(new SolidBorder(colorLine, 0.1f));
        document.add(schoolNameTable);

        String schoolDescriptionString = "Tipo, nombre y/o número";
        Text schoolDescriptionText = newTextMontserrat(schoolDescriptionString, 7f);
        Paragraph schoolDescriptionContainer = PdfFunctions.createParagraph().add(schoolDescriptionText).setTextAlignment(TextAlignment.CENTER);

        Cell schoolDescriptionCell = PdfFunctions.createCell().add(schoolDescriptionContainer);
        Table schoolDescriptionTable = new Table(new float[]{PdfFunctions.cmToPoints(18.19f)});
        schoolDescriptionTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        schoolDescriptionTable.addCell(schoolDescriptionCell).setPaddingBottom(PdfFunctions.cmToPoints(0.5f));
        document.add(schoolDescriptionTable);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String claveNumberString = pdfData.getCct();
        String validationNameString = "************************************************"; //"decreto número " + pdfData.getNumberDecree() + ", " + AppFunctions.dateConvertLetter(pdfData.getDateDecree());
        String claveDescriptionString = "Clave de Centro de Trabajo";
        String validationDescriptionString = "Reconocimiento de Validez Oficial de Estudio, acuerdo de incorporación o decreto de creación y fecha";

        Text claveNumberText = newTextMontserrat(claveNumberString, 9f);
        Text validationNameText = newTextMontserrat(validationNameString, 9f);

        Text claveDescriptionText = newTextMontserrat(claveDescriptionString, 7f);
        Text validationDescriptionText = newTextMontserrat(validationDescriptionString, 7f);

        Paragraph claveNumberContainer = PdfFunctions.createParagraph().add(claveNumberText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph validationNameContainer = PdfFunctions.createParagraph().add(validationNameText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph claveDescriptionContainer = PdfFunctions.createParagraph().add(claveDescriptionText).setTextAlignment(TextAlignment.CENTER);
        Paragraph validationDescriptionContainer = PdfFunctions.createParagraph().add(validationDescriptionText).setTextAlignment(TextAlignment.CENTER);

        Table schoolTable = new Table(new float[]{ PdfFunctions.cmToPoints(4.4225f), PdfFunctions.cmToPoints(0.5f), PdfFunctions.cmToPoints(13.2675f)});
        schoolTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));

        Cell claveNumberCell = new Cell();
        Cell emptyNameCell = new Cell();
        Cell validationNameCell = new Cell();

        Cell claveDescriptionCell = new Cell();
        Cell emptyDescriptionCell = new Cell();
        Cell validationDescriptionCell = new Cell();

        claveNumberCell.add(claveNumberContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));
        emptyNameCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        validationNameCell.add(validationNameContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));

        claveDescriptionCell.add(claveDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));
        emptyDescriptionCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        validationDescriptionCell.add(validationDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));

        schoolTable.addCell(claveNumberCell);
        schoolTable.addCell(emptyNameCell);
        schoolTable.addCell(validationNameCell);
        schoolTable.addCell(claveDescriptionCell);
        schoolTable.addCell(emptyDescriptionCell);
        schoolTable.addCell(validationDescriptionCell);
        document.add(schoolTable);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String planNameString = "Bachillerato ";
        if (pdfData.isCecyte())
            planNameString += "tecnológico con la carrera técnica en " + pdfData.getCareerName();
        else if (pdfData.isEmsad())
            planNameString += "general, con la formación elemental para el trabajo en " + pdfData.getCareerName();
        /*else {
            planNameString += "general con formación elemental para el trabajo";
        }*/

        Text planNameText = newTextMontserrat(planNameString, 9f);
        Paragraph planNameContainer = PdfFunctions.createParagraph().add(planNameText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(0.8f);

        Cell planNameCell = PdfFunctions.createCell().add(planNameContainer);

        Table planNameTable = new Table(new float[]{PdfFunctions.cmToPoints(17.59f)});
        planNameTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        planNameTable.addCell(planNameCell).setBorderBottom(new SolidBorder(colorLine, 0.1f));
        document.add(planNameTable);

        String planDescriptionString = "Plan de estudios y/o formación que permite incorporarse al servicio productivo";
        Text planDescriptionText = newTextMontserrat(planDescriptionString, 7f);
        Paragraph planDescriptionContainer = PdfFunctions.createParagraph().add(planDescriptionText).setTextAlignment(TextAlignment.CENTER);

        Cell planDescriptionCell = PdfFunctions.createCell().add(planDescriptionContainer);

        Table planDescriptionTable = new Table(new float[]{PdfFunctions.cmToPoints(18.19f)});
        planDescriptionTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));
        planDescriptionTable.addCell(planDescriptionCell).setPaddingBottom(PdfFunctions.cmToPoints(0.5f));
        document.add(planDescriptionTable);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/
        String claveNameString = "*******************";
        if (pdfData.isCecyte())
            claveNameString = pdfData.getCareerKey();
        else if (pdfData.isEmsad())
            claveNameString = claveNameString;


        String periodoString = "Del " + pdfData.getEnrollmentStartDate() + " al " + pdfData.getEnrollmentEndDate();

        String claveNameDescriptionString = "Clave";
        String periodoDescriptionString = "Periodo";

        Text claveNameText = newTextMontserrat(claveNameString, 9f);
        Text periodoText = newTextMontserrat(periodoString, 9f);

        Text claveNameDescriptionText = newTextMontserrat(claveNameDescriptionString, 7f);
        Text periodoDescriptionText = newTextMontserrat(periodoDescriptionString, 7f);

        Paragraph claveNameContainer = PdfFunctions.createParagraph().add(claveNameText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph periodoContainer = PdfFunctions.createParagraph().add(periodoText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f)).setMarginBottom(0.8f);
        Paragraph claveNameDescriptionContainer = PdfFunctions.createParagraph().add(claveNameDescriptionText).setTextAlignment(TextAlignment.CENTER);
        Paragraph periodoDescriptionContainer = PdfFunctions.createParagraph().add(periodoDescriptionText).setTextAlignment(TextAlignment.CENTER);

        Table periodoTable = new Table(new float[]{ PdfFunctions.cmToPoints(4.2725f), PdfFunctions.cmToPoints(0.5f), PdfFunctions.cmToPoints(12.8175f)});
        periodoTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));

        Cell claveNameCell = new Cell();
        Cell emptyPeriodoCell = new Cell();
        Cell periodoCell = new Cell();

        Cell claveNameDescriptionCell = new Cell();
        Cell emptyPeriodoDescriptionCell = new Cell();
        Cell periodoDescriptionCell = new Cell();

        claveNameCell.add(claveNameContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));
        emptyPeriodoCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        periodoCell.add(periodoContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));

        claveNameDescriptionCell.add(claveNameDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));
        emptyPeriodoDescriptionCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        periodoDescriptionCell.add(periodoDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));

        periodoTable.addCell(claveNameCell);
        periodoTable.addCell(emptyPeriodoCell);
        periodoTable.addCell(periodoCell);

        periodoTable.addCell(claveNameDescriptionCell);
        periodoTable.addCell(emptyPeriodoDescriptionCell);
        periodoTable.addCell(periodoDescriptionCell);
        document.add(periodoTable);

        /********************************************************************/
        document.add(new Paragraph(""));
        /********************************************************************/

        String creditString = pdfData.getObtainedCredits();
        String totalString = pdfData.getTotalCredits();
        String scoreString = pdfData.getFinalScore() + " " + pdfData.getLetterScore();

        String creditDescriptionString = "Créditos obtenidos";
        String totalDescriptionString = "Total créditos";
        String scoreDescriptionString= "Promedio de aprovechamiento";

        Text creditText = newTextMontserrat(creditString, 9f);
        Text totalText = newTextMontserrat(totalString, 9f);
        Text scoreText = newTextMontserrat(scoreString, 9f);

        Text creditDescriptionText = newTextMontserrat(creditDescriptionString, 7f);
        Text totalDescriptionText = newTextMontserrat(totalDescriptionString, 7f);
        Text scoreDescriptionText = newTextMontserrat(scoreDescriptionString, 7f);

        Paragraph creditContainer = PdfFunctions.createParagraph().add(creditText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph totalContainer = PdfFunctions.createParagraph().add(totalText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));
        Paragraph scoreContainer = PdfFunctions.createParagraph().add(scoreText).setTextAlignment(TextAlignment.CENTER).setPadding(PdfFunctions.cmToPoints(0f));

        Paragraph creditDescriptionContainer = PdfFunctions.createParagraph().add(creditDescriptionText).setTextAlignment(TextAlignment.CENTER);
        Paragraph totalDescriptionContainer = PdfFunctions.createParagraph().add(totalDescriptionText).setTextAlignment(TextAlignment.CENTER);
        Paragraph scoreDescriptionContainer = PdfFunctions.createParagraph().add(scoreDescriptionText).setTextAlignment(TextAlignment.CENTER);

        Table scoreTable = new Table(new float[]{ PdfFunctions.cmToPoints(4.5f), PdfFunctions.cmToPoints(0.5f), PdfFunctions.cmToPoints(4.5f), PdfFunctions.cmToPoints(0.5f), PdfFunctions.cmToPoints(8.19f)});
        scoreTable.setWidth(PdfFunctions.cmToPoints(18.19f)).setMarginLeft(PdfFunctions.cmToPoints(0.7f));

        Cell creditCell = new Cell();
        Cell emptyCreditTotalCell = new Cell();
        Cell totalCell = new Cell();
        Cell emptyTotalScoreCell = new Cell();
        Cell scoreCell = new Cell();

        Cell creditDescriptionCell = new Cell();
        Cell emptyCreditTotalDescriptionCell = new Cell();
        Cell totalDescriptionCell = new Cell();
        Cell emptyTotalScoreDescriptionCell = new Cell();
        Cell scoreDescriptionCell = new Cell();

        creditCell.add(creditContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));
        emptyCreditTotalCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        totalCell.add(totalContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));
        emptyTotalScoreCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        scoreCell.add(scoreContainer).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(colorLine, 0.1f)).setPadding(PdfFunctions.cmToPoints(0f));

        creditDescriptionCell.add(creditDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));
        emptyCreditTotalDescriptionCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        totalDescriptionCell.add(totalDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));
        emptyTotalScoreDescriptionCell.add(new Paragraph("")).setBorder(Border.NO_BORDER);
        scoreDescriptionCell.add(scoreDescriptionContainer).setBorder(Border.NO_BORDER).setPadding(PdfFunctions.cmToPoints(0f));

        scoreTable.addCell(creditCell);
        scoreTable.addCell(emptyCreditTotalCell);
        scoreTable.addCell(totalCell);
        scoreTable.addCell(emptyTotalScoreCell);
        scoreTable.addCell(scoreCell);

        scoreTable.addCell(creditDescriptionCell);
        scoreTable.addCell(emptyCreditTotalDescriptionCell);
        scoreTable.addCell(totalDescriptionCell);
        scoreTable.addCell(emptyTotalScoreDescriptionCell);
        scoreTable.addCell(scoreDescriptionCell);
        document.add(scoreTable);

    }

    private void getStampParagraph() {
        Image qrImage = PdfFunctions.generateQr(pdfData.getFolioNumber());

        String informationString = "El presente documento electrónico ha sido firmado mediante el uso de la firma electrónica avanzada del servidor público competente, amparada por un certificado digital vigente a la fecha de su elaboración, y es válido de conformidad con lo dispuesto en los artículos 1, 2, fracciones IV, V, XIII y XIV, 3, fracciones I y II, 7, 8, 9, 13, 14, 16 y 25 de la Ley de Firma Electrónica Avanzada; 7 y 12 del Reglamento de la Ley de Firma Electrónica Avanzada; su integridad y autoría se podrá comprobar por medio del código QR o en: " +
                "https://certificados.cecyte.edu.mx/Folio/" +
                "\n\nCon fundamento en lo dispuesto en el artículo 141 de la Ley General de Educación, los certificados de estudios expedidos por instituciones del Sistema Educativo Nacional, tienen validez en la República Mexicana sin necesidad de trámites adicionales de autenticación o legalización, lo cual permite el tránsito del estudiante por el Sistema Educativo Nacional.\n\n";
        String printString = "El presente documento se imprime en " + pdfData.getMunicipality() + ", " + pdfData.getState() + ", " + pdfData.getDateSepString() + ".";

        Text informationText = newTextMontserrat(informationString, 6f).setTextAlignment(TextAlignment.JUSTIFIED);
        Text printText = newTextMontserrat(printString, 6f).setTextAlignment(TextAlignment.JUSTIFIED);

        Paragraph qrContainer = PdfFunctions.createParagraph().add(qrImage);
        Paragraph container = PdfFunctions.createParagraph().add(informationText).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph stampContainer = getStampContainerTempory(pdfData).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph folioContainer = getFolioContainerTemporary(pdfData.getFolioNumber());
        Paragraph printContainer = PdfFunctions.createParagraph().add(printText);

        Cell qrCell = PdfFunctions.createCell().add(qrContainer);
        float stampContainerHeight = PdfFunctions.getHeight(document, stampContainer);

        Cell stampCell = PdfFunctions.createCell()
                .setHeight(stampContainerHeight)
                .setVerticalAlignment(VerticalAlignment.TOP);
        stampCell.setNextRenderer(new FitTextInCell(stampCell, stampContainer));

        Table footerTable = new Table(UnitValue.createPercentArray(new float[]{14, 76}));
        footerTable.setWidth(PdfFunctions.cmToPoints(18.37f)).setMarginLeft(PdfFunctions.cmToPoints(0.6f));
        Cell colA = new Cell(1,2);
        Cell colB = new Cell();
        Cell colC = new Cell();
        Cell colD = new Cell(1,2);

        colA.add(stampCell).setBorder(Border.NO_BORDER);
        colB.add(qrCell).setBorder(Border.NO_BORDER);
        colC.add(container).add(printContainer).setHeight(PdfFunctions.cmToPoints(2.8f)).setBorder(Border.NO_BORDER);
        colD.add(folioContainer).setBorder(Border.NO_BORDER);

        footerTable.addCell(colA);
        footerTable.addCell(colB);
        footerTable.addCell(colC);
        footerTable.addCell(colD);

        Paragraph footerContainer = PdfFunctions.createParagraph().add(footerTable);
        setFooterParagraph(footerContainer);

        document.add(footerContainer);
    }
}
