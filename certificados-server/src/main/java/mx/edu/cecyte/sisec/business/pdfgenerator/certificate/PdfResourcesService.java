package mx.edu.cecyte.sisec.business.pdfgenerator.certificate;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.layout.element.Image;
import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Paths;

@Service
public class PdfResourcesService {
    @Autowired private PropertiesService propertiesService;

    private String getResourcePath(String fileName) {
        return Paths.get(propertiesService.getPdfResourceDirectory(), fileName).toString();
    }

    public Image getLogoEducacion() {
        try {
            String imagePath = getResourcePath(propertiesService.getLogoEducacion());

            float height = PdfFunctions.cmToPoints(1.5f);

            Image logoEducacion = new Image(ImageDataFactory.create(imagePath));
            logoEducacion.setHeight(height);
            logoEducacion.setMargins(0f, 0f, 0f, 0f);

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
            logoCecyte.setMargins(0f, 0f, 0f, 0f);

            return logoCecyte;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getLogoSinems() {
        try {
            String imagePath = getResourcePath(propertiesService.getLogoSinems());
            float height = PdfFunctions.cmToPoints(1.3f);

            Image logoSinems = new Image(ImageDataFactory.create(imagePath));
            logoSinems.setHeight(height);
            logoSinems.setMargins(0f, 0f, 0f, 0f);

            return logoSinems;
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

    public Image getlogoEducacionTemporary() {
        try {
            String imagePath = getResourcePath(propertiesService.getLogoEducacionTemporary());
            float height = PdfFunctions.cmToPoints(1.135f);
            Image logoTemporary = new Image(ImageDataFactory.create(imagePath));
            logoTemporary.setFixedPosition(PdfFunctions.cmToPoints(2.295f), PdfFunctions.cmToPoints(23.90f));
            logoTemporary.setHeight(height);
            logoTemporary.setWidth(PdfFunctions.cmToPoints(17f));
            logoTemporary.setMargins(5f, 0f, 0f, 0f);

            return logoTemporary;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getLogoEducationHeadTemp() {
        try {
            String imagePath = getResourcePath(propertiesService.getLogoEducationHeadTemp());
            float height = PdfFunctions.cmToPoints(1.135f);
            Image logoEducacion = new Image(ImageDataFactory.create(imagePath));
            logoEducacion.setHeight(height);
            logoEducacion.setWidth(PdfFunctions.cmToPoints(17f));
            logoEducacion.setMargins(0f, 0f, 0f, 0f);

            return logoEducacion;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getMarcoTemporary() {
        try {
            String imagePath = getResourcePath(propertiesService.getMarcoTemporary());
            Image marcoTemporary = new Image(ImageDataFactory.create(imagePath));
            marcoTemporary.setFixedPosition(PdfFunctions.cmToPoints(0f), PdfFunctions.cmToPoints(0f));
            marcoTemporary.setHeight(PdfFunctions.cmToPoints(27.90f));
            marcoTemporary.setWidth(PdfFunctions.cmToPoints(21.59f));
            return marcoTemporary;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }

    public Image getEscudoTemporary() {
        try {
            String imagePath = getResourcePath(propertiesService.getEscudoTemporary());
            Image escudoTemporary = new Image(ImageDataFactory.create(imagePath));
            escudoTemporary.setFixedPosition(PdfFunctions.cmToPoints(5.295f), PdfFunctions.cmToPoints(9.3f));
            escudoTemporary.setHeight(PdfFunctions.cmToPoints(10.7f));
            escudoTemporary.setWidth(PdfFunctions.cmToPoints(11f));
            return escudoTemporary;
        } catch (MalformedURLException e) {
            throw new AppException(Messages.pdfResource_fileNotFound);
        }
    }
}
