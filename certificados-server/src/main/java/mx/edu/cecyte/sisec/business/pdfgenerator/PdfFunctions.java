package mx.edu.cecyte.sisec.business.pdfgenerator;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.layout.LayoutArea;
import com.itextpdf.layout.layout.LayoutContext;
import com.itextpdf.layout.layout.LayoutResult;
import com.itextpdf.layout.renderer.IRenderer;
import mx.edu.cecyte.sisec.shared.AppFunctions;

public class PdfFunctions {
    public static float cmToPoints(float cm) {
        return 72f * cmToInches(cm);
    }

    public static float cmToInches(float cm) {
        return cm / 2.54f;
    }

    public static float inchesToPoints(float inches) {
        return 72f * inches;
    }

    public static Image generateQr(String folioNumber) {
        String url = "https://certificados.cecyte.edu.mx/folio/" + folioNumber;
        byte[] bytesQr = AppFunctions.generateQr(url);
        float height = PdfFunctions.cmToPoints(2.75f);
        Image qr = new Image(ImageDataFactory.create(bytesQr));
        qr.setHeight(height);
        qr.setMargins(0f, 0f, 0f, 0f);
        return qr;
    }

    public static Paragraph createParagraph() {
        return new Paragraph().setMargin(0f).setMultipliedLeading(0.85f);
    }

    public static Cell createCell() {
        return new Cell().setBorder(Border.NO_BORDER).setMargin(0f).setPadding(0f);
    }

    public static Cell createCell(Integer colspan) {
        return new Cell(1, colspan).setBorder(Border.NO_BORDER).setMargin(0f).setMargin(0f).setPadding(0f);
    }

    public static float getHeight(Document document, IElement paragraph) {
        float f = inchesToPoints(8.5f) - 2 * cmToInches(1f);
        IRenderer paragraphRenderer = paragraph.createRendererSubTree();
        LayoutResult result = paragraphRenderer.setParent(document.getRenderer()).
                layout(new LayoutContext(new LayoutArea(1, new Rectangle(f, 1000))));
        return result.getOccupiedArea().getBBox().getHeight();
    }

    public static final String[] romanLetter = {"I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII.", "IX.", "X."};

    public static final String[] abrogatedNumber = {"1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.","11.","12.","13.","14.","15.","16.","17.","18.","19.","20."};

    public static final String[] number = {"1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10."};

    public static Text createText(String string, float fontSize) {
        return new Text(string).setFontSize(fontSize);
    }

    public static String numberToSemesterString(int i) {
        return AppFunctions.ORDINALS[i - 1] + " semestre";
    }

    public static float getHeightAbrogated(Document document, IElement paragraph) {
        float f = inchesToPoints(8.3f) - 2 * cmToInches(1f);
        IRenderer paragraphRenderer = paragraph.createRendererSubTree();
        LayoutResult result = paragraphRenderer.setParent(document.getRenderer()).
                layout(new LayoutContext(new LayoutArea(1, new Rectangle(f, 1000))));
        return result.getOccupiedArea().getBBox().getHeight();
    }

    public static Paragraph createParagraphAbrogated() {
        return new Paragraph().setMargin(0f).setMultipliedLeading(0.75f);
    }

}
