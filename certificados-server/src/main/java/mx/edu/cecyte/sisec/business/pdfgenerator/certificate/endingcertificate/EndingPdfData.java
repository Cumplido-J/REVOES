package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.dectermino.Dec;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfData;
import mx.edu.cecyte.sisec.dto.catalogs.ConfigPeriodData;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.shared.AppFunctions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class EndingPdfData extends PdfData {
    protected String disciplinaryField;
    protected String studyArea;
    private boolean portabilty;
    private List<PdfModule> modules;
    private List<String> competences;
    private String numberDecree;
    private String dateDecree;
    private String dateSepString;

    private String periodStart;
    private String periodEnding;

    public EndingPdfData(Dec endingDec, Date sinemsDate, boolean portability, DecreeSelect decree, ConfigPeriodData periodData) {
        super();

        String enrollmentStartDate = AppFunctions.xmlDateToLetterDate(endingDec.getAcreditacion().getPeriodoInicio());
        String enrollmentEndDate = AppFunctions.xmlDateToLetterDate(endingDec.getAcreditacion().getPeriodoTermino());
        String printDate = AppFunctions.xmlDateToPrintDate(endingDec.getSep().getFechaSep());
        String sepDate = AppFunctions.xmlDateToSepDate(endingDec.getSep().getFechaSep());
        String dateSep = AppFunctions.dateParseStringAll(endingDec.getSep().getFechaSep());

        this.state = endingDec.getPlantelOServicioEducativo().getEntidadFederativa();
        this.educationalOption = endingDec.getIems().getOpcionEducativa();
        this.municipality = endingDec.getPlantelOServicioEducativo().getMunicipio();
        this.cct = endingDec.getPlantelOServicioEducativo().getCct();
        this.curp = endingDec.getAlumno().getCurp();
        this.enrollmentKey = endingDec.getAlumno().getNumeroControl();
        this.careerName = endingDec.getAcreditacion().getNombreTipoPerfilLaboralEMS();
        this.careerKey = endingDec.getAcreditacion().getClavePlanEstudios();
        this.enrollmentStartDate = enrollmentStartDate;
        this.enrollmentEndDate = enrollmentEndDate;
        this.obtainedCredits = endingDec.getAcreditacion().getCreditosObtenidos();
        this.totalCredits = endingDec.getAcreditacion().getTotalCreditos();
        this.studentName = endingDec.getAlumno().getNombre();
        this.studentFirstLastName = endingDec.getAlumno().getPrimerApellido();
        this.studentSecondLastName = endingDec.getAlumno().getSegundoApellido();
        this.finalScore = endingDec.getAcreditacion().getPromedioAprovechamiento();
        this.letterScore = endingDec.getAcreditacion().getPromedioAprovechamientoTexto();
        this.schoolName = endingDec.getPlantelOServicioEducativo().getNombreNumeroPlantel();
        this.modules = new ArrayList<>();
        this.competences = new ArrayList<>();
        this.directorName = endingDec.getFirmaResponsable().getNombre();
        this.directorFirstLastName = endingDec.getFirmaResponsable().getPrimerApellido();
        this.directorSecondLastName = endingDec.getFirmaResponsable().getSegundoApellido();
        this.certificateNumber = endingDec.getFirmaResponsable().getNoCertificadoResponsable();
        this.digitalStamp = endingDec.getFirmaResponsable().getSello();
        this.sepStamp = endingDec.getSep().getSelloSep();
        this.folioNumber = endingDec.getSep().getFolioDigital();
        this.printDate = printDate;
        this.sepDate = sepDate;
        this.directorPosition = endingDec.getFirmaResponsable().getCargo();
        this.certificateTypeId = "Certificado de Terminación de Estudios";
        this.disciplinaryField = endingDec.getPerfilEgresoEspecifico().getCampoDisciplinar();
        this.sinemsDate = AppFunctions.dateToLetterDate(sinemsDate);
        this.schoolType = endingDec.getPlantelOServicioEducativo().getIdTipoPlantel();
        this.studyArea = endingDec.getPerfilEgresoEspecifico().getTrayecto();
        this.portabilty = portability;
        this.blank = false;
        this.numberDecree = decree.getDecreeNumber();
        this.dateDecree = decree.getDecreeDate();
        this.dateSepString = dateSep;
        this.periodStart = periodData.getDateStart().toString();
        this.periodEnding = periodData.getDateOne().toString();
        System.out.println("E=>: "+periodEnding);
        System.out.println("S=>: "+periodStart);

        for (Dec.UacsdeFt.UacdeFt uacdeFt : endingDec.getUacsdeFt().getUacdeFt()) {
            String name = uacdeFt.getNombre();
            if (name.charAt(name.length() - 1) != '.') name += ".";
            String score = uacdeFt.getCalificacion();
            String hours = uacdeFt.getTotalHorasUAC();
            String credits = uacdeFt.getCreditos();
            PdfModule module = new PdfModule(name, score, hours, credits);
            modules.add(module);
        }

        for (Dec.PerfilEgresoEspecifico.CompetenciasEspecificas competenciasEspecifica : endingDec.getPerfilEgresoEspecifico().getCompetenciasEspecificas()) {
            String name = competenciasEspecifica.getNombreCompetenciasLaborales();
            if (name.charAt(name.length() - 1) != '.') name += ".";
            competences.add(name);
        }
    }

    public void blankPdfData() {
        this.blank = true;
        this.directorName = "\t\t\t\t\t\t\t";
        this.directorFirstLastName = "\t\t\t\t\t\t\t";
        this.directorSecondLastName = "\t\t\t\t\t\t\t";
        this.directorPosition = "\t\t\t\t\t\t\t";
        if (isCecyte()) this.schoolName = "Plantel No. \t,\t\t\t\t";
        if (isEmsad()) this.schoolName = "No. \t,\t\t";
        this.municipality = "\t\t\t\t\t\t";
        this.cct = "\t\t\t\t\t\t";
        this.studentName = "\t\t\t\t\t\t";
        this.studentFirstLastName = "\t\t\t\t\t\t";
        this.studentSecondLastName = "\t\t\t\t\t\t";
        this.curp = "\t\t\t\t\t\t";
        this.enrollmentKey = "\t\t\t\t\t\t";
        this.careerName = "\t\t\t\t\t\t";
        this.careerKey = "\t\t\t\t\t\t";
        this.obtainedCredits = "\t\t";
        this.totalCredits = "\t\t";
        this.disciplinaryField = "\t\t\t\t\t\t";
        this.studyArea = "\t\t\t\t\t\t";
        this.certificateNumber = "\t\t\t\t\t\t";
        this.digitalStamp = String.join("", Collections.nCopies(1000, "\t"));
        this.sepStamp = String.join("", Collections.nCopies(1000, "\t"));
        this.folioNumber = "\t\t\t\t\t\t";
        this.educationalOption = "\t\t\t\t\t";
        this.sinemsDate = "\t\t\t\t\t\t\t\t";
        this.enrollmentStartDate = String.format("%s de %s de %s", "\t\t\t\t", "\t\t\t\t", "\t\t\t\t");
        this.enrollmentEndDate = String.format("%s de %s de %s", "\t\t\t\t", "\t\t\t\t", "\t\t\t\t");
        this.printDate = String.format("a los %s días del mes de %s de %s", "\t\t\t\t", "\t\t\t\t", "\t\t\t\t");
        this.sepDate = "";
        this.finalScore = "\t\t\t\t";
        this.letterScore = "\t\t\t\t\t\t\t\t";

        List<PdfModule> newModules = new ArrayList<>();
        List<String> newCompetences = new ArrayList<>();
        for (int i = 0; i < modules.size(); i++) {
            String credits = "\t\t";
            String hours = "\t\t";
            String score = "\t\t";
            String name = "\t\t\t\t\t";
            PdfModule module = new PdfModule(name, score, hours, credits);
            newModules.add(module);
        }
        for (int i = 0; i < competences.size(); i++) {
            newCompetences.add("\t\t\t\t\t");
        }

        this.modules = newModules;
        this.competences = newCompetences;
    }

}
