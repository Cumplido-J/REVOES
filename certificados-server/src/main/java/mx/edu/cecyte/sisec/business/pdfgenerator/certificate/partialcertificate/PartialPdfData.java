package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.decparcial.Dec;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfData;
import mx.edu.cecyte.sisec.business.pdfgenerator.PdfFunctions;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.shared.AppFunctions;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
public class PartialPdfData extends PdfData {
    private List<PdfSemester> semesters;
    private String numberDecree;
    private String dateDecree;
    private String genderSchool;
    private String dateSepString;

    public PartialPdfData(Dec partialDec, Date sinemsDate, String careerKey, DecreeSelect decree) {
        super();

        String enrollmentStartDate = AppFunctions.xmlDateToLetterDate(partialDec.getAcreditacion().getPeriodoInicio());
        String enrollmentEndDate = AppFunctions.xmlDateToLetterDate(partialDec.getAcreditacion().getPeriodoTermino());
        String printDate = AppFunctions.xmlDateToPrintDate(partialDec.getSep().getFechaSep());
        String sepDate = AppFunctions.xmlDateToSepDate(partialDec.getSep().getFechaSep());
        String dateSep = AppFunctions.dateParseStringAll(partialDec.getSep().getFechaSep());

        this.state = partialDec.getPlantelOServicioEducativo().getEntidadFederativa();
        this.educationalOption = partialDec.getIems().getOpcionEducativa();
        this.municipality = partialDec.getPlantelOServicioEducativo().getMunicipio();
        this.cct = partialDec.getPlantelOServicioEducativo().getCct();
        this.curp = partialDec.getAlumno().getCurp();
        this.enrollmentKey = partialDec.getAlumno().getNumeroControl();
        this.careerName = partialDec.getAcreditacion().getNombreTipoPerfilLaboralEMS();
        this.careerKey = careerKey;
        this.enrollmentStartDate = enrollmentStartDate;
        this.enrollmentEndDate = enrollmentEndDate;
        this.obtainedCredits = partialDec.getAcreditacion().getCreditosObtenidos();
        this.totalCredits = partialDec.getAcreditacion().getTotalCreditos();
        this.studentName = partialDec.getAlumno().getNombre();
        this.studentFirstLastName = partialDec.getAlumno().getPrimerApellido();
        this.studentSecondLastName = partialDec.getAlumno().getSegundoApellido();
        this.finalScore = partialDec.getAcreditacion().getPromedioAprovechamiento();
        this.letterScore = partialDec.getAcreditacion().getPromedioAprovechamientoTexto();
        this.schoolName = partialDec.getPlantelOServicioEducativo().getNombreNumeroPlantel();
        this.directorName = partialDec.getFirmaResponsable().getNombre();
        this.directorFirstLastName = partialDec.getFirmaResponsable().getPrimerApellido();
        this.directorSecondLastName = partialDec.getFirmaResponsable().getSegundoApellido();
        this.certificateNumber = partialDec.getFirmaResponsable().getNoCertificadoResponsable();
        this.digitalStamp = partialDec.getFirmaResponsable().getSello();
        this.sepStamp = partialDec.getSep().getSelloSep();
        this.folioNumber = partialDec.getSep().getFolioDigital();
        this.printDate = printDate;
        this.sepDate = sepDate;
        this.directorPosition = partialDec.getFirmaResponsable().getCargo();
        this.certificateTypeId = "Certificado Parcial de Estudios";
        this.sinemsDate = AppFunctions.dateToLetterDate(sinemsDate);
        this.schoolType = partialDec.getPlantelOServicioEducativo().getIdTipoPlantel();
        this.blank = false;
        this.numberDecree = decree.getDecreeNumber();
        this.dateDecree = decree.getDecreeDate();
        this.genderSchool = partialDec.getPlantelOServicioEducativo().getGeneroPlantel();
        this.dateSepString = dateSep;

        this.semesters = new ArrayList<>();

        for (int i = 1; i <= 6; i++) {
            String tempSemester = Integer.toString(i);

            List<Dec.Uacs.Uac> semesterUacs = partialDec.getUacs()
                    .getUac()
                    .stream()
                    .filter(uac -> uac.getNumeroPeriodoUAC().equals(tempSemester))
                    .collect(Collectors.toList());
            List<PdfUac> uacs = new ArrayList<>();
            for (Dec.Uacs.Uac decUac : semesterUacs) {
                String creditos = decUac.getCreditosUAC();
                String periodoEscolar = decUac.getPeriodoEscolarUAC();
                System.out.println("--: "+decUac.getCalificacionUAC());
                //if (creditos.equals("NI")) creditos = "***";
                //if (periodoEscolar.equals("NI")) periodoEscolar = "***";
                PdfUac pdfUac = new PdfUac(decUac.getCct(), decUac.getNombreUAC(), decUac.getCalificacionUAC(), decUac.getTotalHorasUAC(), creditos, periodoEscolar, decUac.getIdTipoUAC());
                uacs.add(pdfUac);
            }
            uacs.sort(Comparator.comparing(PdfUac::getType));
            PdfSemester pdfSemester = new PdfSemester(PdfFunctions.numberToSemesterString(i), uacs);
            this.semesters.add(pdfSemester);
        }
    }

    public void blankPdfData() {

        this.blank = true;
        this.directorName = String.join("", Collections.nCopies(this.directorName.length(), " "));
        this.directorFirstLastName = String.join("", Collections.nCopies(this.directorFirstLastName.length(), " "));
        this.directorSecondLastName = String.join("", Collections.nCopies(this.directorSecondLastName.length(), " "));
        this.directorPosition = String.join("", Collections.nCopies(this.directorPosition.length(), " "));
        StringBuilder schoolName = new StringBuilder();
        if (isCecyte()) schoolName.append("Plantel ");
        schoolName.append("No.");
        schoolName.append(String.join("", Collections.nCopies(100, " ")));
        schoolName.append(",");
        schoolName.append(String.join("", Collections.nCopies(100, " ")));
        this.schoolName = schoolName.toString();

        this.state = String.join("", Collections.nCopies(this.state.length() * 2, " "));
        this.municipality = String.join("", Collections.nCopies(this.municipality.length() * 2, " "));
        this.cct = String.join("", Collections.nCopies(this.cct.length(), " "));
        this.studentName = String.join("", Collections.nCopies(this.studentName.length(), " "));
        this.studentFirstLastName = String.join("", Collections.nCopies(this.studentFirstLastName.length(), " "));
        this.studentSecondLastName = String.join("", Collections.nCopies(this.studentSecondLastName.length(), " "));
        this.curp = String.join("", Collections.nCopies(this.curp.length() * 2, " "));
        this.enrollmentKey = String.join("", Collections.nCopies(this.enrollmentKey.length() * 2, " "));
        this.careerName = String.join("", Collections.nCopies(this.careerName.length(), " "));
        this.obtainedCredits = String.join("", Collections.nCopies(this.obtainedCredits.length() * 3, " "));
        this.totalCredits = String.join("", Collections.nCopies(this.totalCredits.length() * 3, " "));
        this.certificateNumber = String.join("", Collections.nCopies(this.certificateNumber.length(), " "));
        this.digitalStamp = String.join("", Collections.nCopies(this.digitalStamp.length() * 2, " "));
        this.sepStamp = String.join("", Collections.nCopies(this.sepStamp.length() * 2, " "));
        this.folioNumber = String.join("", Collections.nCopies(this.folioNumber.length() * 2, " "));
        this.sinemsDate = String.join("", Collections.nCopies(this.sinemsDate.length() * 2, " "));
        this.enrollmentStartDate = String.format("%s de %s de %s", "        ", "                        ", "            ");
        this.enrollmentEndDate = String.format("%s de %s de %s", "        ", "                        ", "            ");
        this.printDate = String.format("a los %s días del mes de %s de %s", "        ", "                        ", "            ");
        this.sepDate = "";
        this.finalScore = "                        ";
        this.letterScore = "                                                ";
        for (PdfSemester semester : semesters) {
            semester.setName("      ");
            for (PdfUac pdfUac : semester.getUacList()) {
                pdfUac.setCct("      ");
                pdfUac.setCredits("      ");
                pdfUac.setHours("      ");
                pdfUac.setName("      ");
                pdfUac.setSchoolPeriod("      ");
                pdfUac.setScore("      ");
                pdfUac.setType("      ");
            }
        }

    }

}
