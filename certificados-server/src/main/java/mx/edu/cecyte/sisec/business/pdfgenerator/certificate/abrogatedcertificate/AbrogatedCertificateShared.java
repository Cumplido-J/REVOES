package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.abrogatedcertificate;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.CertificateShared;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;

public class AbrogatedCertificateShared  extends CertificateShared {

    public AbrogatedCertificateShared(PdfResources pdfResources, Document document) {
        super(pdfResources, document);
    }

    protected Paragraph getSinemsLogoContainerWithText(String sinemsDate) {
        String infoString = "\nEl perfil de competencias en la EMS, aplica a partir del ciclo escolar 2009-2010.";
        Text infoText = newTextMontserrat(infoString, 7f);

        return getSinemsLogoContainer(sinemsDate).add(infoText);

    }
}
