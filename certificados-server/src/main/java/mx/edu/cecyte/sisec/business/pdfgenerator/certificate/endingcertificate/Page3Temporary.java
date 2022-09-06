package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.AreaBreakType;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfResources;
import mx.edu.cecyte.sisec.shared.AppFunctions;

public class Page3Temporary extends EndingCertificateShared {
    private final EndingPdfData pdfData;

    public Page3Temporary(PdfResources pdfResources, EndingPdfData pdfData, Document document) {
        super(pdfResources, document);
        this.pdfData = pdfData;
    }

    public void generate() {
        document.add(getLogoEducationHeadTempParagraph());
        document.add(getEscudoTemporary());
        getTextParagraph();
        //document.getPdfDocument().addEventHandler(PdfDocumentEvent.END_PAGE, setFooterImage);
        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
    }

    private void getTextParagraph() {
        String titleString = "Perfil de egreso común del bachillerato\n\n";
        String contentString = "En los acuerdos secretariales publicados en el Diario Oficial de la Federación: ";
        if (pdfData.isCecyte()) contentString += "Acuerdo 653 el 4 de septiembre de 2012, Acuerdo "+ AppFunctions.dateConvertLetter("2021-10-27")+" el "+AppFunctions.dateConvertLetter("2021-10-12")+", ";
        contentString += "Acuerdo 444 el 21 de octubre de 2008, Acuerdo 486 el 30 de abril de 2009, Acuerdo 488 el 23 de junio de 2009 y Acuerdo 656 el 20 de noviembre de 2012, se indica que se deben articular las competencias genéricas, disciplinares y profesionales del Marco Curricular Común, para la formación integral de los alumnos, mediante los elementos y actores del proceso educativo, de acuerdo con el perfil de egreso de cada subsistema de Educación Media Superior. El desarrollo de las competencias del alumno se avala con la acreditación del plan de estudios.";
        String subtitle1String = "\n\nCompetencias genéricas\n\n";

        String left1String = "Se autodetermina y cuida de sí.";
        String left2String = "Se expresa y comunica.";
        String left3String = "Piensa crítica y reflexivamente.";
        String left4String = "Aprende de forma autónoma.";
        String left5String = "Trabaja en forma colaborativa.";
        String left6String = "Participa con responsabilidad en la sociedad.";

        String right1String = "Se conoce y valora a sí mismo y aborda problemas y retos teniendo en cuenta los objetivos que persigue.\n" +
                "Es sensible al arte y participa en la apreciación e interpretación de sus expresiones en distintos géneros.\n" +
                "Elige y practica estilos de vida saludables.";
        String right2String = "Escucha, interpreta y emite mensajes pertinentes en distintos contextos, con los medios, códigos y herramientas apropiados.";
        String right3String = "Desarrolla innovaciones y propone soluciones a problemas a partir de métodos establecidos.\n" +
                "Sustenta una postura personal sobre temas de interés y relevancia general, considerando otros puntos de vista de manera crítica y reflexiva.";
        String right4String = "Aprende por iniciativa e interés propios a lo largo de la vida.";
        String right5String = "Participa y colabora de manera efectiva en equipos diversos.";
        String right6String = "Participa con una conciencia cívica y ética en la vida de su comunidad, región, México y el mundo.\n" +
                "Mantiene una actitud respetuosa hacia la interculturalidad y la diversidad de creencias, valores, ideas y prácticas sociales.\n" +
                "Contribuye al desarrollo sustentable de manera crítica, con acciones responsables.";

        String subtitle2String = "\nCompetencias disciplinares básicas";
        String content2String = "\n\nExpresan los conocimientos, destrezas, habilidades, actitudes y valores que se consideran los mínimos necesarios en cada campo disciplinar, para que los estudiantes se desarrollen de manera eficaz en diferentes contextos y situaciones a lo largo de la vida y, además, dan sustento a su formación en las competencias genéricas.";
        String subtitle3String = "\n\nCampos disciplinares";

        String name1String = "\n\nMatemáticas. ";
        String name2String = "\n\nCiencias experimentales. ";
        String name3String = "\n\nCiencias sociales. ";
        String name4String = "\n\nComunicación. ";
        String name5String = "\n\nHumanidades. ";
        String description1String = "Con las competencias disciplinares de matemáticas se busca propiciar el desarrollo de la creatividad y el pensamiento lógico y crítico entre los alumnos. Un estudiante que cuente con las competencias disciplinares de matemáticas puede argumentar y estructurar mejor sus ideas y razonamientos, y reconocer que a la solución de cada tipo de problema matemático corresponden diferentes conocimientos, destrezas y habilidades, y el despliegue de diferentes valores y actitudes. Por ello, los estudiantes deben poder razonar matemáticamente, y no simplemente resolver ciertos tipos de problemas mediante la repetición de procedimientos establecidos. Esto implica que puedan hacer aplicaciones de esta disciplina más allá del salón de clases.";
        String description2String = "Con las competencias de ciencias experimentales se busca que los estudiantes conozcan y apliquen los métodos y procedimientos de estas ciencias para la resolución de problemas cotidianos y para la comprensión racional de su entorno. Las competencias tienen un enfoque práctico; se refieren a estructuras de pensamiento y procesos aplicables a contextos diversos, que serán útiles para los estudiantes a lo largo de la vida, sin que por ello dejen de sujetarse al rigor que imponen las disciplinas. Su desarrollo favorece acciones responsables y fundadas por parte de los estudiantes hacia el ambiente y hacia sí mismos.";
        String description3String = "Con las competencias de ciencias sociales se busca formar ciudadanos reflexivos y participativos, conscientes de su ubicación en el tiempo y el espacio. Las competencias enfatizan la formación de los estudiantes en espacios ajenos al dogmatismo y al autoritarismo. Su desarrollo implica que puedan interpretar su entorno social y cultural de manera crítica, a la vez que valorar prácticas distintas a las suyas y, de este modo, asumir una actitud responsable hacia los demás.";
        String description4String = "Con las competencias de comunicación se busca desarrollar la capacidad de los estudiantes para comunicarse efectivamente en español y, en lo esencial, en una segunda lengua en diversos contextos, mediante el uso de distintos medios e instrumentos. Los estudiantes que hayan desarrollado estas competencias podrán leer críticamente y comunicar y argumentar ideas de manera efectiva y con claridad, oralmente y por escrito. Además, usarán la tecnología de la información y la comunicación de manera crítica para diversos propósitos comunicativos. Las competencias de comunicación están orientadas, además, a la reflexión sobre la naturaleza del lenguaje, a su uso como herramienta del pensamiento lógico, y a su disfrute.";
        String description5String = "Con las competencias disciplinares de humanidades se busca que el estudiante reconozca y enjuicie la perspectiva con la que entiende y contextualiza su conocimiento del ser humano y del mundo y, además, fortalezca el desarrollo de intuiciones, criterios y valores desde perspectivas distintas a la suya. Con el desarrollo de dichas competencias se pretende extender la experiencia y el pensamiento del estudiante para que genere nuevas formas de percibir y pensar el mundo, y de interrelacionarse en él, de manera que se conduzca razonablemente en situaciones familiares o que le sean ajenas. Este conjunto de competencias aporta mecanismos para explorar elementos nuevos y antiguos, que influyen en la imagen que se tenga del mundo. Asimismo, contribuye a reconocer maneras de sentir, pensar y actuar que favorezcan formas de vida y convivencias armónicas, responsables y justas.\n\n";

        Text titleText = newTextMontserrat(titleString, 12f);
        Text contentText = newTextMontserrat(contentString, 8f);
        Text subtitle1Text = newTextMontserratBold(subtitle1String, 8f);
        Text left1Text = newTextMontserrat(left1String, 8f);
        Text left2Text = newTextMontserrat(left2String, 8f);
        Text left3Text = newTextMontserrat(left3String, 8f);
        Text left4Text = newTextMontserrat(left4String, 8f);
        Text left5Text = newTextMontserrat(left5String, 8f);
        Text left6Text = newTextMontserrat(left6String, 8f);
        Text right1Text = newTextMontserrat(right1String, 8f);
        Text right2Text = newTextMontserrat(right2String, 8f);
        Text right3Text = newTextMontserrat(right3String, 8f);
        Text right4Text = newTextMontserrat(right4String, 8f);
        Text right5Text = newTextMontserrat(right5String, 8f);
        Text right6Text = newTextMontserrat(right6String, 8f);
        Text subtitle2Text = newTextMontserratBold(subtitle2String, 8f);
        Text content2Text = newTextMontserrat(content2String, 8f);
        Text subtitle3Text = newTextMontserratBold(subtitle3String, 8f);
        Text name1Text = newTextMontserratBold(name1String, 8f);
        Text name2Text = newTextMontserratBold(name2String, 8f);
        Text name3Text = newTextMontserratBold(name3String, 8f);
        Text name4Text = newTextMontserratBold(name4String, 8f);
        Text name5Text = newTextMontserratBold(name5String, 8f);
        Text description1Text = newTextMontserrat(description1String, 8f);
        Text description2Text = newTextMontserrat(description2String, 8f);
        Text description3Text = newTextMontserrat(description3String, 8f);
        Text description4Text = newTextMontserrat(description4String, 8f);
        Text description5Text = newTextMontserrat(description5String, 8f);

        Paragraph titleContainer = PdfFunctions.createParagraph().add(titleText).setTextAlignment(TextAlignment.CENTER).setMarginTop(5f);
        Paragraph contentContainer = PdfFunctions.createParagraph().add(contentText).add(subtitle1Text).setTextAlignment(TextAlignment.JUSTIFIED);

        Paragraph left1Container = PdfFunctions.createParagraph().add(left1Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(5f);
        Paragraph left2Container = PdfFunctions.createParagraph().add(left2Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph left3Container = PdfFunctions.createParagraph().add(left3Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph left4Container = PdfFunctions.createParagraph().add(left4Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph left5Container = PdfFunctions.createParagraph().add(left5Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph left6Container = PdfFunctions.createParagraph().add(left6Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        //competencia generica
        Paragraph right1Container = PdfFunctions.createParagraph().add(right1Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(5f);
        Paragraph right2Container = PdfFunctions.createParagraph().add(right2Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph right3Container = PdfFunctions.createParagraph().add(right3Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph right4Container = PdfFunctions.createParagraph().add(right4Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph right5Container = PdfFunctions.createParagraph().add(right5Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);
        Paragraph right6Container = PdfFunctions.createParagraph().add(right6Text).setTextAlignment(TextAlignment.JUSTIFIED).setMarginTop(7f);

        Cell emptyCell = PdfFunctions.createCell();

        Cell left1Cell = PdfFunctions.createCell().add(left1Container);
        Cell left2Cell = PdfFunctions.createCell().add(left2Container);
        Cell left3Cell = PdfFunctions.createCell().add(left3Container);
        Cell left4Cell = PdfFunctions.createCell().add(left4Container);
        Cell left5Cell = PdfFunctions.createCell().add(left5Container);
        Cell left6Cell = PdfFunctions.createCell().add(left6Container);

        Cell right1Cell = PdfFunctions.createCell().add(right1Container);
        Cell right2Cell = PdfFunctions.createCell().add(right2Container);
        Cell right3Cell = PdfFunctions.createCell().add(right3Container);
        Cell right4Cell = PdfFunctions.createCell().add(right4Container);
        Cell right5Cell = PdfFunctions.createCell().add(right5Container);
        Cell right6Cell = PdfFunctions.createCell().add(right6Container);

        Table competencesTable = new Table(UnitValue.createPercentArray(new float[]{23, 2, 75})).useAllAvailableWidth();
        competencesTable.addCell(left1Cell).addCell(emptyCell).addCell(right1Cell)
                .addCell(left2Cell).addCell(emptyCell).addCell(right2Cell)
                .addCell(left3Cell).addCell(emptyCell).addCell(right3Cell)
                .addCell(left4Cell).addCell(emptyCell).addCell(right4Cell)
                .addCell(left5Cell).addCell(emptyCell).addCell(right5Cell)
                .addCell(left6Cell).addCell(emptyCell).addCell(right6Cell);

        Paragraph content2Container = PdfFunctions.createParagraph()
                .add(subtitle2Text)
                .add(content2Text)
                .add(subtitle3Text)
                .add(name1Text)
                .add(description1Text)
                .add(name2Text)
                .add(description2Text)
                .add(name3Text)
                .add(description3Text)
                .add(name4Text)
                .add(description4Text)
                .add(name5Text)
                .add(description5Text)
                .setTextAlignment(TextAlignment.JUSTIFIED);

        Paragraph folioContainer = getFolioContainerTemporary(pdfData.getFolioNumber());

        document.add(titleContainer)
                .add(contentContainer)
                .add(competencesTable)
                .add(content2Container)
                .add(folioContainer);
    }
}
