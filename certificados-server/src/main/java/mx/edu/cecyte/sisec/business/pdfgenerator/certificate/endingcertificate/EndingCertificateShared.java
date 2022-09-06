package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.CertificateShared;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;

public class EndingCertificateShared extends CertificateShared {

    public EndingCertificateShared(PdfResources pdfResources, Document document) {
        super(pdfResources, document);
    }

    protected Paragraph getSinemsLogoContainerWithText(String sinemsDate) {
        String infoString = "\nEl perfil de competencias en la EMS, aplica a partir del ciclo escolar 2009-2010.";
        Text infoText = newTextMontserrat(infoString, 7f);

        return getSinemsLogoContainer(sinemsDate).add(infoText);

    }

    protected  Paragraph getSinemsLogoContainerWithTextTemporary(String sinemsDate) {
        return getSinemsLogoContainerTemporary(sinemsDate);
    }
}
