package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;
import mx.edu.cecyte.sisec.shared.AppFunctions;

import java.util.Locale;

public class Page2 extends DegreeShared{
    private final DegreePdfData degreePdfData;
    private final SetFooterImage setFooterImage;

    public Page2(DegreePdfResources pdfResources, DegreePdfData pdfData, Document document, SetFooterImage setFooterImage) {
        super(pdfResources, document);
        this.degreePdfData = pdfData;
        this.setFooterImage = setFooterImage;
    }

    public void generate () {
        document.add(getLogoCecyte());
        getHeaderStudent();
        getStudentParagraph();
        footerFolio();
        //document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
    }

    public void  getHeaderStudent() {
        String title1 = "Se tomó nota del Presente Título con Folio " + degreePdfData.folioNumber + "\n";
        String title2 = "El Registro respectivo del Departamento\n" +
                "de Servicios Escolares\n";
        String title3 = degreePdfData.getCityName()+", "+degreePdfData.getState()+" "+degreePdfData.getSupportDate();

        Text textTitle1 = newTextMontserrat(title1, 9f);
        Text textTitle2 = newTextMontserrat(title2, 9f);
        Text textTitle3 = newTextMontserrat(title3, 9f);

        Paragraph paragraphText1 = PdfFunctions.createParagraph().add(textTitle1).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(3.2222f));
        Paragraph paragraphText2 = PdfFunctions.createParagraph().add(textTitle2).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.3f));
        Paragraph paragraphText3 = PdfFunctions.createParagraph().add(textTitle3).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.3f));

        document.add(paragraphText1)
                .add(paragraphText2)
                .add(paragraphText3);
    }

    public void getStudentParagraph() {

        String title1 = "CERTIFICACIÓN DE ANTECEDENTES ACADÉMICOS";
        String content_a = "A continuación se certifican los estudios de:\n" +
                "Nombre: " + degreePdfData.getNameStudent() + "\n" +
                "Título: " + AppFunctions.splitTextOnLines(degreePdfData.getTechnicalDegree(), 1)  + "\n" +
                "CURP: " + degreePdfData.getCurp();

        String title2 = "Estudios de Secundaria:\n";
        String content_b = "Institución: "+degreePdfData.getSchoolOrigin().toUpperCase(Locale.ROOT)+"\n" +
                "Entidad Federativa: "+degreePdfData.getStateOrigin();
        String content_c = "Periodo: "+degreePdfData.getPeriodOrigin();

        String title3 = "Estudios Profesionales:\n";
        String content_d = "Institución: "+degreePdfData.getGraduationSchool()+"\n" +
                "Entidad Federativa: "+degreePdfData.getGraduationState();
        String content_e = "Periodo: "+degreePdfData.getGraduationPeriod();

        String content_f = "Examen Profesional: " + degreePdfData.getExaminationDate();

        String content_g = "Cumplió con el Servicio Social, conforme al artículo 55 de la Ley Reglamentaria del Artículo 5°\n" +
                "Constitucional, relativo al ejercicio de las profesiones en el Distrito Federal y al Artículo 85 del\n" +
                "Reglamento de la Ley Reglamentaria del Artículo 5° Constitucional.";
        String content_h = degreePdfData.getCityName()+", "+degreePdfData.getState()+" "+degreePdfData.getSupportDate()+".";
        String content_i = "Colegio de Estudios Científicos\n" +
                "y Tecnológicos del Estado de " + degreePdfData.getState();
        String content_j = degreePdfData.getAcademicDirector();
        String content_k = "Dirección Académica";
        if (degreePdfData.getGenderAcademic().equals("M")) content_k = "Directora Académica";
        else if (degreePdfData.getGenderAcademic().equals("H")) content_k = "Director Académico";

        Text contentTitle1 = newTextMontserratBold(title1, 9f);
        Text contentText_a = newTextMontserrat(content_a, 9f);

        Text contentTitle2 = newTextMontserratBold(title2, 9f);
        Text contentText_b = newTextMontserrat(content_b, 9f);
        Text contentText_c = newTextMontserrat(content_c, 9f);

        Text contentTitle3 = newTextMontserratBold(title3, 9f);
        Text contentText_d = newTextMontserrat(content_d, 9f);
        Text contentText_e = newTextMontserrat(content_e, 9f);

        Text contentText_f = newTextMontserrat(content_f, 9f);

        Text contentText_g = newTextMontserrat(content_g, 9f);

        Text contentText_h = newTextMontserrat(content_h, 9f);
        Text contentText_i = newTextMontserrat(content_i, 9f);
        Text contentText_j = newTextMontserrat(content_j, 9f);
        Text contentText_k = newTextMontserratBold(content_k, 9f);

        Paragraph paragraph1 = PdfFunctions.createParagraph().add(contentTitle1).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(1.3595f)).setPageNumber(2);
        Paragraph paragraph2 = PdfFunctions.createParagraph().add(contentText_a).setMarginLeft(PdfFunctions.cmToPoints(1.5f));

        Paragraph paragraph3 = PdfFunctions.createParagraph().add(contentTitle2).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.9909f));
        Paragraph paragraph4 = PdfFunctions.createParagraph().add(contentText_b).setMarginLeft(PdfFunctions.cmToPoints(1.5f));
        Paragraph paragraph5 = PdfFunctions.createParagraph().add(contentText_c).setFixedPosition(PdfFunctions.cmToPoints(14f), PdfFunctions.cmToPoints(16.266f), PdfFunctions.cmToPoints(12f));

        Paragraph paragraph6 = PdfFunctions.createParagraph().add(contentTitle3).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.9909f));
        Paragraph paragraph7 = PdfFunctions.createParagraph().add(contentText_d).setMarginLeft(PdfFunctions.cmToPoints(1.5f));
        Paragraph paragraph8 = PdfFunctions.createParagraph().add(contentText_e).setFixedPosition(PdfFunctions.cmToPoints(14f), PdfFunctions.cmToPoints(14.155f), PdfFunctions.cmToPoints(12f));

        Paragraph paragraph9 = PdfFunctions.createParagraph().add(contentText_f).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.6987f));

        Paragraph paragraph10 = PdfFunctions.createParagraph().add(contentText_g).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.9452f));

        Paragraph paragraph11 = PdfFunctions.createParagraph().add(contentText_h).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.9452f));

        Paragraph paragraph12 = PdfFunctions.createParagraph().add(contentText_i).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(0.8531f));

        Paragraph paragraph13 = PdfFunctions.createParagraph().add(contentText_j).setMarginLeft(PdfFunctions.cmToPoints(1.5f)).setMarginTop(PdfFunctions.cmToPoints(2.3146f));
        Paragraph paragraph14 = PdfFunctions.createParagraph().add(contentText_k).setMarginLeft(PdfFunctions.cmToPoints(1.5f));

        document.add(paragraph1).add(paragraph2)
                .add(paragraph3).add(paragraph4)
                .add(paragraph5).add(paragraph6)
                .add(paragraph7).add(paragraph8)
                .add(paragraph9).add(paragraph10)
                .add(paragraph11).add(paragraph12)
                .add(paragraph13).add(paragraph14);
    }

    public void footerFolio() {
        String folio = "Folio  "+degreePdfData.folioNumber;

        Text textFolio = newTextMontserrat(folio, 6f);

        Paragraph paragraphContainer = PdfFunctions.createParagraph().add(textFolio).setFixedPosition(PdfFunctions.cmToPoints(1.0804f),PdfFunctions.cmToPoints(1.333f), PdfFunctions.cmToPoints(9f));

        document.add(paragraphContainer);
    }
}
