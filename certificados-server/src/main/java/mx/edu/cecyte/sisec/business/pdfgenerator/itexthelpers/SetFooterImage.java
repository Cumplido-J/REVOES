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

//https://kb.itextpdf.com/home/it7kb/faq/how-can-i-add-an-image-to-all-pages-of-my-pdf
public class SetFooterImage implements IEventHandler {
    protected final Image img;

    public SetFooterImage(Image img) {
        this.img = img;
    }

    @Override
    public void handleEvent(Event event) {
        float height = PdfFunctions.cmToPoints(0.9f);

        PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
        PdfDocument pdfDoc = docEvent.getDocument();
        PdfPage page = docEvent.getPage();
        PdfCanvas aboveCanvas = new PdfCanvas(page.newContentStreamAfter(), page.getResources(), pdfDoc);
        Rectangle rectangle = page.getPageSize().clone();
        rectangle.setHeight(height);
        new Canvas(aboveCanvas, pdfDoc, rectangle).add(img);
    }
}