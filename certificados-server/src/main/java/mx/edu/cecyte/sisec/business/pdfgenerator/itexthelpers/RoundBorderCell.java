package mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers;

import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.renderer.CellRenderer;
import com.itextpdf.layout.renderer.DrawContext;

//    https://kb.itextpdf.com/home/it7kb/faq/how-to-create-a-table-with-rounded-corners
public class RoundBorderCell extends CellRenderer {
    public RoundBorderCell(Cell modelElement) {
        super(modelElement);
    }

    @Override
    public void draw(DrawContext drawContext) {
        drawContext.getCanvas().roundRectangle(getOccupiedAreaBBox().getX(), getOccupiedAreaBBox().getY(),
                getOccupiedAreaBBox().getWidth(), getOccupiedAreaBBox().getHeight(), 4);
        drawContext.getCanvas().stroke();
        super.draw(drawContext);
    }
}
