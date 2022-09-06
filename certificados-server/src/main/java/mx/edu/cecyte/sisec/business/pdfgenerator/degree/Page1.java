package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetBackgroundImage;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;
import mx.edu.cecyte.sisec.shared.AppFunctions;

import java.net.MalformedURLException;
import java.util.Locale;

public class Page1 extends DegreeShared {
    private final DegreePdfData degreePdfData;
    private final SetFooterImage setFooterImage;
    private final SetBackgroundImage setBackgroundImage;

    public Page1(DegreePdfResources pdfResources, DegreePdfData pdfData, Document document, SetFooterImage setFooterImage, SetBackgroundImage setBackgroundImage) {
        super(pdfResources, document);
        this.degreePdfData = pdfData;
        this.setFooterImage = setFooterImage;
        this.setBackgroundImage = setBackgroundImage;
    }

    public void generate() {
        document.add(getEducationLogoParagraph());
        document.add((degreePdfData.getStateId() == 17 ||
                degreePdfData.getStateId() == 22 ||
                degreePdfData.getStateId() == 1) ? getDegreeOvalo(2) : getDegreeOvalo(1));
        document.add(getStampParagraph(degreePdfData.nameLogoState));
        getHeaderStart();
        if (degreePdfData.getNameLogoState().equals("Tamaulipas.png")) getOptional();
        getHeadersParagraph();
        getStudentParagraph();
        getComplete();
        document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setBackgroundImage);
        document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
    }

    public void getHeaderStart() {
        String title1 = "El Colegio de Estudios Científicos y Tecnológicos\n" + "del Estado de " + degreePdfData.getState();
        Text text1 = newTextMontserrat(title1, 13.32f);
        Paragraph text1Container = PdfFunctions.createParagraph().add(text1).setTextAlignment(TextAlignment.CENTER).setMarginTop(PdfFunctions.cmToPoints(1.4321f));
        document.add(text1Container);
    }

    public void getOptional() {
        String optional = "Instituto Tamaulipeco de Capacitación para el Empleo";
        Text optionalText = newTextMontserrat(optional, 9.92f);
        Paragraph paragraphText = PdfFunctions.createParagraph().add(optionalText).setFixedPosition(PdfFunctions.cmToPoints(1.0804f), PdfFunctions.cmToPoints(22.3333f), PdfFunctions.cmToPoints(20f)).setTextAlignment(TextAlignment.CENTER);
        document.add(paragraphText);
    }

    public void getHeadersParagraph() {
        String title2 = "Organismo Público Descentralizado del Estado de "+degreePdfData.getState()+",\n" + "creado mediante Decreto No. "+degreePdfData.getDecreeNumber()+" de fecha "+degreePdfData.getDecreeDate();

        Text text2 = newTextMontserrat(title2, 9.92f);

        Paragraph text2Container = PdfFunctions.createParagraph().add(text2).setTextAlignment(TextAlignment.CENTER).setMarginTop(PdfFunctions.cmToPoints(0.9408f));

        document.add(text2Container);
    }

    public void getStudentParagraph() {
        String title3 = "Otorga a\n";
        String title4 = degreePdfData.getNameStudent() + "\n";
        String title5 = "El título de\n";
        String title6 = degreePdfData.getTechnicalDegree()+ "\n";
        //String nameFinalSchool = "Plantel "+degreePdfData.getNameSchool();
        String schoolNameString = degreePdfData.getNameSchool();
        if (schoolNameString.contains("Plantel")) schoolNameString = schoolNameString;
        else schoolNameString = "Plantel " + degreePdfData.getNameSchool();

        //if (degreePdfData.getNameSchool().indexOf("Plantel") > 0) nameFinalSchool = degreePdfData.getNameSchool();
        String title7 = "en atención a que cursó y aprobó en el \n" + degreePdfData.getGraduationSchool();
        String title8 =  "los estudios requeridos conforme a los Planes y Programas\n" +
                "autorizados por la Secretaría de Educación Pública y haber\n" +
                "presentado el Examen Profesional " + degreePdfData.getExaminationDate();
        String title9 = "Expedido en la Ciudad de "+degreePdfData.getCityName()+",\n" +
                degreePdfData.getState()+" "+degreePdfData.getSupportDate();
        String tecnica = AppFunctions.splitTextOnLines(title6, 1);
        Text text3 = newTextMontserrat(title3, 10f);
        Text text4 = newTextMontserratBold(title4, 14f);
        Text text5 = newTextMontserrat(title5, 10f);
        Text text6 = newTextMontserratBold(tecnica, 16f);
        Text text7 = newTextMontserrat(title7, 9.92f);
        Text text8 = newTextMontserrat(title8, 9.92f);
        Text text9 = newTextMontserrat(title9, 10f);

        Paragraph text3Container = PdfFunctions.createParagraph().add(text3).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(6f)).setMarginTop(PdfFunctions.cmToPoints(1.2661f));
        Paragraph text4Container = PdfFunctions.createParagraph().add(text4).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(6f)).setMarginTop(PdfFunctions.cmToPoints(1.4555f));
        Paragraph text5Container = PdfFunctions.createParagraph().add(text5).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(6f)).setMarginTop(PdfFunctions.cmToPoints(1.0075f));
        Paragraph text6Container = PdfFunctions.createParagraph().add(text6).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(7.4f)).setMarginTop(PdfFunctions.cmToPoints(1.1555f)).setWidth(PdfFunctions.cmToPoints(12f));
        Paragraph text7Container = PdfFunctions.createParagraph().add(text7).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(6f)).setMarginTop(PdfFunctions.cmToPoints(0.9622f));
        Paragraph text8Container = PdfFunctions.createParagraph().add(text8).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(6f)).setMarginTop(PdfFunctions.cmToPoints(0.591f));
        Paragraph text9Container = PdfFunctions.createParagraph().add(text9).setTextAlignment(TextAlignment.CENTER).setMarginLeft(PdfFunctions.cmToPoints(6f)).setMarginTop(PdfFunctions.cmToPoints(0.9642f));

        document.add(text3Container)
                .add(text4Container)
                .add(text5Container)
                .add(text6Container)
                .add(text7Container)
                .add(text8Container)
                .add(text9Container);
    }

    public void getComplete() {
        String title10 = "";
        if (degreePdfData.getGender().equals("M")) title10 = "Directora General del CECyTE "+degreePdfData.getState()+"\n";
        else title10 = "Director General del CECyTE "+degreePdfData.getState()+"\n";
        String title11 = degreePdfData.getManagingDirector();
        String title12 = "Folio  "+degreePdfData.getFolioNumber();

        Text text10 = newTextMontserrat(title10, 9.92f);
        Text text11 = newTextMontserratBold(title11, 10f);
        Text text12 = newTextMontserrat(title12, 6f);

        Paragraph text10Container = PdfFunctions.createParagraph().add(text10).setFixedPosition(PdfFunctions.cmToPoints(1.0804f), PdfFunctions.cmToPoints(5f), PdfFunctions.cmToPoints(18f)).setTextAlignment(TextAlignment.CENTER);//.setMarginTop(PdfFunctions.cmToPoints(2.1733f));
        Paragraph text11Container = PdfFunctions.createParagraph().add(text11).setFixedPosition(PdfFunctions.cmToPoints(1.0804f), PdfFunctions.cmToPoints(3f), PdfFunctions.cmToPoints(18f)).setTextAlignment(TextAlignment.CENTER);//.setMarginTop(PdfFunctions.cmToPoints(2.3577f));
        Paragraph text12Container = PdfFunctions.createParagraph().add(text12).setFixedPosition(PdfFunctions.cmToPoints(1.0804f), PdfFunctions.cmToPoints(1.333f), PdfFunctions.cmToPoints(9f));

        document.add(text10Container)
                .add(text11Container)
                .add(text12Container);
    }

    public Image getStampParagraph(String fileName) {
        ImageData imageData = null;
        try {
            imageData = ImageDataFactory.create("/home/sisec/Recursos/"+fileName);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        Image logoState = new Image(imageData);

        if (degreePdfData.getStateId() == 9 || degreePdfData.getStateId() == 32) {
            logoState.setHeight(PdfFunctions.cmToPoints(0.9999f));
            logoState.setWidth(PdfFunctions.cmToPoints(3.5f));
        } else {
            logoState.setHeight(PdfFunctions.cmToPoints(1.5f));
        }
        logoState.setFixedPosition(PdfFunctions.cmToPoints(15.5555f), PdfFunctions.cmToPoints(25.555f));
        logoState.setPageNumber(1);
        return logoState;
    }




}
