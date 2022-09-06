package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.FitTextInCell;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.RoundBorderCell;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;

public class Page2 extends PartialCertificateShared {
    private final PartialPdfData pdfData;
    private final SetFooterImage setFooterImage;

    public Page2(PdfResources pdfResources, PartialPdfData pdfData, Document document, SetFooterImage setFooterImage) {
        super(pdfResources, document);
        this.pdfData = pdfData;
        this.setFooterImage = setFooterImage;
    }

    public void generate() {
        document.add(getCecyteHeader(pdfData.getFolioNumber()));
        getUacsParagraph();
        getStampParagraph();
        document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
    }

    private void getUacsParagraph() {

        String headerCctString = "CCT Plantel";
        String headerUacTypeString = "Tipo UAC";
        String headerUacNameString = "Nombre de la Unidad de Aprendizaje Curricular (UAC)";
        String headerScoreString = "Calif.";
        String headerHoursString = "Total de Hrs.";
        String headerCreditsString = "Créditos";
        String headerSchoolPeriodString = "Periodo escolar";

        Text headerCctText = newTextMontserrat(headerCctString, 7f);
        Text headerUacTypeText = newTextMontserrat(headerUacTypeString, 7f);
        Text headerUacNameText = newTextMontserrat(headerUacNameString, 7f);
        Text headerScoreText = newTextMontserrat(headerScoreString, 7f);
        Text headerHoursText = newTextMontserrat(headerHoursString, 7f);
        Text headerCreditsText = newTextMontserrat(headerCreditsString, 7f);
        Text headerSchoolPeriodText = newTextMontserrat(headerSchoolPeriodString, 7f);

        Paragraph headerCctContainer = PdfFunctions.createParagraph().add(headerCctText).setPaddingTop(5f);
        Paragraph headerUacTypeContainer = PdfFunctions.createParagraph().add(headerUacTypeText).setPaddingTop(5f).setPaddingLeft(12f);
        Paragraph headerUacNameContainer = PdfFunctions.createParagraph().add(headerUacNameText).setPaddingTop(5f);
        Paragraph headerScoreContainer = PdfFunctions.createParagraph().add(headerScoreText).setTextAlignment(TextAlignment.CENTER).setPaddingTop(5f);
        Paragraph headerHoursContainer = PdfFunctions.createParagraph().add(headerHoursText).setTextAlignment(TextAlignment.CENTER).setPaddingTop(5f);
        Paragraph headerCreditsContainer = PdfFunctions.createParagraph().add(headerCreditsText).setTextAlignment(TextAlignment.CENTER).setPaddingTop(5f);
        Paragraph headerSchoolPeriodContainer = PdfFunctions.createParagraph().add(headerSchoolPeriodText).setTextAlignment(TextAlignment.CENTER).setPaddingTop(5f);

        Cell headerCctCell = PdfFunctions.createCell().add(headerCctContainer);
        Cell headerUacTypeCell = PdfFunctions.createCell().add(headerUacTypeContainer);
        Cell headerUacNameCell = PdfFunctions.createCell().add(headerUacNameContainer);
        Cell headerEmptyCell = PdfFunctions.createCell();
        Cell headerScoreCell = PdfFunctions.createCell().add(headerScoreContainer);
        Cell headerHoursCell = PdfFunctions.createCell().add(headerHoursContainer);
        Cell headerCreditsCell = PdfFunctions.createCell().add(headerCreditsContainer);
        Cell headerSchoolPeriodCellCell = PdfFunctions.createCell().add(headerSchoolPeriodContainer);

        Table headersTable = new Table(UnitValue.createPercentArray(new float[]{120, 195, 620, 85, 80, 120, 100, 150}))
                .useAllAvailableWidth()
                .addCell(headerCctCell)
                .addCell(headerUacTypeCell)
                .addCell(headerUacNameCell)
                .addCell(headerEmptyCell)
                .addCell(headerScoreCell)
                .addCell(headerHoursCell)
                .addCell(headerCreditsCell)
                .addCell(headerSchoolPeriodCellCell);

        Table uacTable = new Table(UnitValue.createPercentArray(new float[]{120, 195, 620, 85, 80, 120, 100, 150}))
                .useAllAvailableWidth();

        for (PdfSemester semester : pdfData.getSemesters()) {
            Text ordinalText = newTextMontserratBold(semester.getName(), 6f);
            Paragraph ordinalContainer = PdfFunctions.createParagraph().add(ordinalText).setMarginBottom(2f).setMarginTop(4f);
            Cell ordinalCell = PdfFunctions.createCell(6).add(ordinalContainer);
            uacTable.addCell(PdfFunctions.createCell(2))
                    .addCell(ordinalCell);

            for (PdfUac pdfUac : semester.getUacList()) {
                Text cctText = newTextMontserrat(pdfUac.getCct(), 6f);
                Text uacTypeText = newTextMontserrat(pdfUac.getType(), 6f);
                Text nameText = newTextMontserrat(pdfUac.getName(), 6f);
                Text scoreText = newTextMontserrat(pdfUac.getScore(), 6f);
                Text hoursText = newTextMontserrat(pdfUac.getHours(), 6f);
                Text creditsText = newTextMontserrat(pdfUac.getCredits(), 6f);
                Text schoolPeriodText = newTextMontserrat(pdfUac.getSchoolPeriod(), 6f);

                Paragraph cctContainer = PdfFunctions.createParagraph().add(cctText).setMarginBottom(1f);
                Paragraph uacTypeContainer = PdfFunctions.createParagraph().add(uacTypeText).setMarginBottom(1f);
                Paragraph nameContainer = PdfFunctions.createParagraph().add(nameText).setTextAlignment(TextAlignment.JUSTIFIED).setMarginBottom(1f);
                Paragraph scoreContainer = PdfFunctions.createParagraph().add(scoreText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(1f);
                Paragraph hoursContainer = PdfFunctions.createParagraph().add(hoursText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(1f);
                Paragraph creditsContainer = PdfFunctions.createParagraph().add(creditsText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(1f);
                Paragraph schoolPeriodContainer = PdfFunctions.createParagraph().add(schoolPeriodText).setTextAlignment(TextAlignment.CENTER).setMarginBottom(1f);

                Cell cctCell = PdfFunctions.createCell().add(cctContainer);
                Cell uacTypeCell = PdfFunctions.createCell().add(uacTypeContainer);
                Cell nameCell = PdfFunctions.createCell().add(nameContainer);
                Cell scoreCell = PdfFunctions.createCell().add(scoreContainer);
                Cell hoursCell = PdfFunctions.createCell().add(hoursContainer);
                Cell creditsCell = PdfFunctions.createCell().add(creditsContainer);
                Cell schoolPeriodCell = PdfFunctions.createCell().add(schoolPeriodContainer);

                uacTable.addCell(cctCell)
                        .addCell(uacTypeCell)
                        .addCell(nameCell)
                        .addCell(PdfFunctions.createCell())
                        .addCell(scoreCell)
                        .addCell(hoursCell)
                        .addCell(creditsCell)
                        .addCell(schoolPeriodCell);
            }
        }

        String bottom1String = "........................................Concluye registro de UAC........................................";
        String bottom2String = "NI= No Inscrito, NP= No Presentó evaluación y de 5.0 a 5.9 o NA= No Acreditó, no se considera para el promedio de aprovechamiento.\n";
        if (pdfData.isBlank()) bottom1String = "";

        Text bottom1Text = newTextMontserrat(bottom1String, 6f);
        Text bottom2Text = newTextMontserrat(bottom2String, 6f);

        Paragraph bottom1Container = PdfFunctions.createParagraph().add(bottom1Text).setMarginTop(2f);
        Cell bottom1Cell = PdfFunctions.createCell(6).add(bottom1Container);

        uacTable.addCell(PdfFunctions.createCell(2))
                .addCell(bottom1Cell);
        float height = PdfFunctions.inchesToPoints(8.5f) - PdfFunctions.getHeight(document, uacTable) - 163f;

        Paragraph bottom2Container = PdfFunctions.createParagraph().add(bottom2Text).setHeight(height).setVerticalAlignment(VerticalAlignment.BOTTOM);// .setMarginTop(90f);
        Cell bottom2Cell = PdfFunctions.createCell(8).add(bottom2Container);
        uacTable.addCell(bottom2Cell);

        Paragraph headersTableContainer = PdfFunctions.createParagraph().add(headersTable).setPadding(5f);
        Paragraph uacTableContainer = PdfFunctions.createParagraph().add(uacTable).setPadding(5f);

        Cell headersTableCell = PdfFunctions.createCell().add(headersTableContainer).setBorderBottom(new SolidBorder(1.2f));
        Cell uacTableCell = PdfFunctions.createCell().add(uacTableContainer);

        Table containerTable = new Table(1).useAllAvailableWidth();
        containerTable.addCell(headersTableCell).addCell(uacTableCell);

        Cell containerTableCell = PdfFunctions.createCell().add(containerTable);
        containerTableCell.setNextRenderer(new RoundBorderCell(containerTableCell));

        Table tableBordered = new Table(1).useAllAvailableWidth().addCell(containerTableCell).setMarginTop(5f);
        document.add(tableBordered);
    }

    private void getStampParagraph() {
        String separatorString = "\n";
        Text separatorText = new Text(separatorString);
        Paragraph separatorContainer = PdfFunctions.createParagraph().add(separatorText);

        Paragraph stampContainer = getStampContainer(pdfData).add("\n\n");
        Paragraph sinemsContainer = getSinemsLogoContainer(pdfData.getSinemsDate()).add(separatorContainer);

        float stampContainerHeight = PdfFunctions.getHeight(document, stampContainer) + 18f;
        Cell stampCell = PdfFunctions.createCell()
                .setHeight(stampContainerHeight)
                .setVerticalAlignment(VerticalAlignment.TOP);
        stampCell.setNextRenderer(new FitTextInCell(stampCell, stampContainer));

        Cell sinemsCell = PdfFunctions.createCell().add(sinemsContainer);

        Table footerTable = new Table(1)
                .useAllAvailableWidth()
                .addCell(stampCell)
                .addCell(sinemsCell);

        Paragraph footerContainer = PdfFunctions.createParagraph()
                .add(footerTable);

        setFooterParagraph(footerContainer);
        document.add(footerContainer);
    }
}
