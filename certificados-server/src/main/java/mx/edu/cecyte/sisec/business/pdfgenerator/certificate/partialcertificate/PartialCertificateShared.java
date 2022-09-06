package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.CertificateShared;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;

public class PartialCertificateShared extends CertificateShared {

    public PartialCertificateShared(PdfResources pdfResources, Document document) {
        super(pdfResources, document);
    }

    protected Paragraph getSinemsLogoContainerWithTextTemporary(String sinemsDate) {
        Paragraph paragraph =  PdfFunctions.createParagraph().setTextAlignment(TextAlignment.RIGHT);
        return paragraph.add(getSinemsLogoContainerTemporary(sinemsDate));

    }
}
