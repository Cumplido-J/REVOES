package mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers;

import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.layout.LayoutArea;
import com.itextpdf.layout.layout.LayoutContext;
import com.itextpdf.layout.layout.LayoutResult;
import com.itextpdf.layout.renderer.CellRenderer;
import com.itextpdf.layout.renderer.DrawContext;
import com.itextpdf.layout.renderer.IRenderer;

//https://kb.itextpdf.com/home/it7kb/examples/fit-text-in-cell
public class FitTextInCell extends CellRenderer {
    private final Paragraph content;

    public FitTextInCell(Cell modelElement, Paragraph content) {
        super(modelElement);
        this.content = content;
    }

    @Override
    public IRenderer getNextRenderer() {
        return new FitTextInCell((Cell) modelElement, content);
    }

    @Override
    public void draw(DrawContext drawContext) {

        IRenderer pr = content.createRendererSubTree().setParent(this);
        LayoutResult textArea = pr.layout(new LayoutContext(
                new LayoutArea(0, new Rectangle(getOccupiedAreaBBox().getWidth(), 1000))));
        float spaceNeeded = textArea.getOccupiedArea().getBBox().getHeight();
        float offset = (getOccupiedAreaBBox().getHeight() - textArea.getOccupiedArea().getBBox().getHeight());

        PdfFormXObject xObject = new PdfFormXObject(new Rectangle(getOccupiedAreaBBox().getWidth(),
                getOccupiedAreaBBox().getHeight()));
        Canvas layoutCanvas = new Canvas(new PdfCanvas(xObject, drawContext.getDocument()), drawContext.getDocument(),
                new Rectangle(0, offset, getOccupiedAreaBBox().getWidth(), spaceNeeded));
        layoutCanvas.add(content);

        drawContext.getCanvas().addXObject(xObject, occupiedArea.getBBox().getLeft(), occupiedArea.getBBox().getBottom());
    }
}

