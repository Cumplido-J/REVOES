package mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers;

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

public class SetFooterImageAbrogated implements IEventHandler {
    protected final Image img;

    public SetFooterImageAbrogated(Image img) {
        this.img = img;
    }

    @Override
    public void handleEvent( Event event) {
        float height = PdfFunctions.cmToPoints(1.05f);

        PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
        PdfDocument pdfDoc = docEvent.getDocument();
        PdfPage page = docEvent.getPage();
        PdfCanvas aboveCanvas = new PdfCanvas(page.newContentStreamAfter(), page.getResources(), pdfDoc);
        Rectangle rectangle = page.getPageSize().clone();
        rectangle.setHeight(height);
        new Canvas(aboveCanvas, pdfDoc, rectangle).add(img);
    }
}
