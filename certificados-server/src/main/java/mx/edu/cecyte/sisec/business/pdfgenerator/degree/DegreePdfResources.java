package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.element.Image;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DegreePdfResources {
    private Image educationLogo;
    private Image cecyteLogo;
    private Image sinemsLogo;
    private Image eagleFooter;
    private Image backgroundCecyte;
    private Image degreeOvalo;
    private PdfFont montserrat;
    private PdfFont montserratBold;
    private Image degreeOval7x5;
}
