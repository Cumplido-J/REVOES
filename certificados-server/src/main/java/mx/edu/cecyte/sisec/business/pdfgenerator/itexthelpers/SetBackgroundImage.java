package mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.element.Image;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;

public class SetBackgroundImage implements IEventHandler {
    protected final Image img;

    public SetBackgroundImage(Image img) {
        this.img = img;
    }

    @Override
    public void handleEvent(Event event) {
        PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
        PdfDocument pdfDoc = docEvent.getDocument();
        PdfPage page = docEvent.getPage();
        PdfCanvas canvas = new PdfCanvas(page.newContentStreamBefore(), page.getResources(), pdfDoc);

        ImageData imageData = null;
        try {
            File imageFile = new File("/home/sisec/Recursos/backgroundCecyte.png");
            java.awt.Image image = ImageIO.read(imageFile);
            imageData = ImageDataFactory.create(image, null);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Rectangle rectangle = new Rectangle(cmToPoints(17f),cmToPoints(19f));
        rectangle.moveRight(cmToPoints(1.644f));
        rectangle.moveDown(cmToPoints(-1.266f));
        canvas.addImage(imageData, rectangle, true);
        canvas.fillStroke();


    }

    public static float cmToPoints(float cm) {
        return 72f * cmToInches(cm);
    }

    public static float cmToInches(float cm) {
        return cm / 2.54f;
    }
}
