package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.business.pdfgenerator.itexthelpers.SetFooterImage;

public class Page2 extends EndingCertificateShared {
    private final EndingPdfData pdfData;
    private final SetFooterImage setFooterImage;

    public Page2(PdfResources pdfResources, EndingPdfData pdfData, Document document, SetFooterImage setFooterImage) {
        super(pdfResources, document);
        this.pdfData = pdfData;
        this.setFooterImage = setFooterImage;
    }

    public void generate() {
        document.add(getCecyteHeader(pdfData.getFolioNumber()));
        getTextParagraph();
        getSinemsLogo();
        getStampParagraph();
        document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
    }

    private void getTextParagraph() {
        String titleString = "\nReferentes normativos del perfil de egreso";
        String contentString = "\nEn los acuerdos secretariales publicados en el Diario Oficial de la Federación: ";
        if (pdfData.isCecyte()) contentString += "Acuerdo 653 el 4 de septiembre de 2012, ";
        contentString += "Acuerdo 444 el 21 de octubre de 2008, Acuerdo 486 el 30 de abril de 2009, Acuerdo 488 el 23 de junio de 2009 y Acuerdo 656 el 20 de noviembre de 2012, se indica que se deben articular las competencias genéricas, disciplinares y profesionales del Marco Curricular Común, para la formación integral de los alumnos, mediante los elementos y actores del proceso educativo, de acuerdo con el perfil de egreso de cada subsistema de Educación Media Superior. El desarrollo de las competencias del alumno se avala con la acreditación del plan de estudios.";

        String subtitle1String = "\nCompetencias genéricas. ";
        String subtitle2String = "\nCompetencias disciplinares básicas. ";
        String subtitle3String = "\nCompetencias disciplinares extendidas. ";
        String subtitle4String = "\nCompetencias profesionales básicas. ";
        String subtitle5String = "\nCompetencias profesionales extendidas. ";

        String description1String = "Conforme a los artículos 2, 3 y 4 del Acuerdo 444, son el fundamento del perfil del egresado de EMS, porque son conocimientos, destrezas, habilidades, actitudes y valores que le permiten comprender el mundo e influir en él, lo capacitan para continuar aprendiendo de forma autónoma a lo largo de su vida, para desarrollar relaciones armónicas con quienes lo rodean, y para participar eficazmente en los ámbitos escolar, social, laboral y político.";
        String description2String = "Conforme a los artículos 5, 6 y 7 del Acuerdo 444 y al artículo primero del Acuerdo 656, son el fundamento del perfil del egresado de bachillerato, junto con las genéricas, porque expresan conocimientos, destrezas, habilidades, actitudes y valores que se consideran los mínimos necesarios en cada campo disciplinar para que se desarrolle de manera eficaz en diferentes contextos y situaciones a lo largo de la vida, al tiempo que fortalecen su formación en las competencias genéricas.";
        String description3String = "Conforme a los artículos 8 y 9 del Acuerdo 444, al Acuerdo 486 y al Acuerdo 656, enriquecen el perfil del egresado de ";
        if (pdfData.isCecyte()) description3String += "bachillerato tecnológico";
        if (pdfData.isEmsad()) description3String += "la Educación Media Superior a Distancia";
        description3String += ", con conocimientos, destrezas, habilidades, actitudes y valores que amplían y profundizan los alcances de las competencias disciplinares básicas y mejoran su formación en las competencias genéricas.";
        String description4String = "Conforme a los artículos 10 y 11 del Acuerdo 444, son los conocimientos, destrezas, habilidades, actitudes y valores que integran el perfil de formación elemental para el trabajo del egresado de ";
        if (pdfData.isCecyte()) description4String += "bachillerato tecnológico";
        if (pdfData.isEmsad()) description4String += "la Educación Media Superior a Distancia";
        description4String += ", porque lo preparan para desempeñarse en su vida laboral con mayores probabilidades de éxito, a la vez que fortalecen los efectos de las competencias genéricas.";
        String description5String = "Conforme a los artículos 10 y 11 del Acuerdo 444, son los conocimientos, destrezas, habilidades, actitudes y valores que definen el perfil profesional específico del egresado de bachillerato tecnológico, porque le proporcionan la preparación técnica necesaria para incorporarse al ejercicio profesional, y consolidan lo efectos de las competencias genéricas en su formación.";

        Text titleText = newTextMontserrat(titleString, 12f);
        Text contentText = newTextMontserrat(contentString, 8f);

        Text subtitle1Text = newTextMontserratBold(subtitle1String, 8f);
        Text subtitle2Text = newTextMontserratBold(subtitle2String, 8f);
        Text subtitle3Text = newTextMontserratBold(subtitle3String, 8f);
        Text subtitle4Text = newTextMontserratBold(subtitle4String, 8f);
        Text subtitle5Text = newTextMontserratBold(subtitle5String, 8f);

        Text description1Text = newTextMontserrat(description1String, 8f);
        Text description2Text = newTextMontserrat(description2String, 8f);
        Text description3Text = newTextMontserrat(description3String, 8f);
        Text description4Text = newTextMontserrat(description4String, 8f);
        Text description5Text = newTextMontserrat(description5String, 8f);

        Paragraph titleContainer = PdfFunctions.createParagraph().add(titleText).setTextAlignment(TextAlignment.CENTER);
        Paragraph contentContainer = PdfFunctions.createParagraph().add(contentText).setTextAlignment(TextAlignment.JUSTIFIED);

        Paragraph subtitle1Container = PdfFunctions.createParagraph().add(subtitle1Text).add(description1Text).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph subtitle2Container = PdfFunctions.createParagraph().add(subtitle2Text).add(description2Text).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph subtitle3Container = PdfFunctions.createParagraph().add(subtitle3Text).add(description3Text).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph subtitle4Container = PdfFunctions.createParagraph().add(subtitle4Text).add(description4Text).setTextAlignment(TextAlignment.JUSTIFIED);
        Paragraph subtitle5Container = PdfFunctions.createParagraph().add(subtitle5Text).add(description5Text).setTextAlignment(TextAlignment.JUSTIFIED);

        document.add(titleContainer)
                .add(contentContainer)
                .add(subtitle1Container)
                .add(subtitle2Container)
                .add(subtitle3Container)
                .add(subtitle4Container);
        if (pdfData.isCecyte()) document.add(subtitle5Container);
    }

    private void getStampParagraph() {
        String separatorString = "\n\n";
        Text separatorText = new Text(separatorString);
        Paragraph stampContainer = getStampContainer(pdfData).add(separatorText);
        setFooterParagraph(stampContainer);
        document.add(stampContainer);
    }

    private void getSinemsLogo() {
        String separatorString = "\n\n\n\n\n";
        Text separatorText = new Text(separatorString);
        Paragraph separatorParagraph = PdfFunctions.createParagraph().add(separatorText);
        Paragraph sinemsLogoContainer = getSinemsLogoContainerWithText(pdfData.getSinemsDate());
        document.add(separatorParagraph).add(sinemsLogoContainer);
    }
}
