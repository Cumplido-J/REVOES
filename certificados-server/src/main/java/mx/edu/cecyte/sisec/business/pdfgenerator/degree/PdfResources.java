package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.element.Image;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PdfResources {
    private Image educationLogo;
    private Image cecyteLogo;
    private Image sinemsLogo;
    private Image backgroundCecyte;
    private Image degreeOvalo;
    private Image eagleFooter;
    private PdfFont montserrat;
    private PdfFont montserratBold;
}
