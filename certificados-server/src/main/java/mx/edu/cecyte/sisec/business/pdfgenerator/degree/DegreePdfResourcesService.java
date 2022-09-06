package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Paths;

@Service
public class DegreePdfResourcesService {
    @Autowired
    private PropertiesService propertiesService;

    private String getResourcePath(String fileName) {
        return Paths.get(propertiesService.getPdfResourceDirectory(), fileName).toString();
    }

    public Image getLogoEducacion() {
        try {
            String imagePath = getResourcePath(propertiesService.getLogoEducacion());

            float height = PdfFunctions.cmToPoints(1.5f);

            Image logoEducacion = new Image(ImageDataFactory.create(imagePath));
            logoEducacion.setHeight(height);
            logoEducacion.setMarginLeft(PdfFunctions.cmToPoints(2f));

            return logoEducacion;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getLogoCecyte() {
        try {
            String imagePath = getResourcePath(propertiesService.getLogoCecyte());
            float height = PdfFunctions.cmToPoints(1.3f);

            Image logoCecyte = new Image(ImageDataFactory.create(imagePath));
            logoCecyte.setHeight(height);
            logoCecyte.setFixedPosition(PdfFunctions.cmToPoints(9.0438f), PdfFunctions.cmToPoints(25.888f));
            logoCecyte.setPageNumber(2);
            return logoCecyte;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getBarraAguilas() {
        try {
            String imagePath = getResourcePath(propertiesService.getBarraAguilas());
            float height = PdfFunctions.cmToPoints(1f);

            Image barraAguilas = new Image(ImageDataFactory.create(imagePath));
            barraAguilas.setHeight(height);
            barraAguilas.setMargins(0f, 0f, 0f, 0f);

            return barraAguilas;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getBackgroundCecyte() {
        try {
            String imagePath = getResourcePath(propertiesService.getBackgroundCecyte());

            Image backgroundCecyte = new Image(ImageDataFactory.create(imagePath));
            backgroundCecyte.scaleAbsolute(PdfFunctions.cmToPoints(17f),PdfFunctions.cmToPoints(19f));
            backgroundCecyte.setFixedPosition(PdfFunctions.cmToPoints(1.55f), PdfFunctions.cmToPoints(1f));
            backgroundCecyte.setMarginTop(PdfFunctions.cmToPoints(0.2666f));
            backgroundCecyte.setPageNumber(1);
            return backgroundCecyte;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getDegreeOvalo(Integer val) {
        try {
            String imagePath = getResourcePath(propertiesService.getDegreeOvalo());

            Image degreeOvalo = new Image(ImageDataFactory.create(imagePath));
            if (val == 1) {
                degreeOvalo.setFixedPosition(PdfFunctions.cmToPoints(2.0175f), PdfFunctions.cmToPoints(9.6682f));
                degreeOvalo.setHeight(PdfFunctions.cmToPoints(8.8f));
                degreeOvalo.setWidth(PdfFunctions.cmToPoints(5.8f));
            }
            if (val == 2) {
                degreeOvalo.setFixedPosition(PdfFunctions.cmToPoints(2.5f), PdfFunctions.cmToPoints(11f));
                degreeOvalo.setHeight(PdfFunctions.cmToPoints(6.8f));
                degreeOvalo.setWidth(PdfFunctions.cmToPoints(4.8f));
            }
            return degreeOvalo;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getLogoState(String FileName) {
        try {
            String imagePath = getResourcePath(FileName);
            float height = PdfFunctions.cmToPoints(1.5f);

            Image logotate = new Image(ImageDataFactory.create(imagePath));
            logotate.setHeight(height);
            return logotate;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }

    }

    public PdfFont getMontserrat() {
        try {
            String fontPath = getResourcePath(propertiesService.getMontserrat());
            return PdfFontFactory.createFont(fontPath, true);
        } catch (IOException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public PdfFont getMontserratBold() {
        try {
            String fontPath = getResourcePath(propertiesService.getMontserratBold());
            return PdfFontFactory.createFont(fontPath, true);
        } catch (IOException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }
}
