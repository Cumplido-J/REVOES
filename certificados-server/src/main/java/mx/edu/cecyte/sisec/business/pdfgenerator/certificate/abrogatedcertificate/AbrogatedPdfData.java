package mx.edu.cecyte.sisec.business.pdfgenerator.certificate.abrogatedcertificate;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.decabrogado.Dec;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.PdfData;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.shared.AppFunctions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class AbrogatedPdfData extends PdfData {

    protected String disciplinaryField;
    protected String studyArea;
    private boolean portabilty;
    private List<PdfModuleAbrogated> modules;
    private List<String> competences;
    private String generoPlantel;
    private String numberDecree;
    private String dateDecree;
    private String dateSepString;

    public AbrogatedPdfData(Dec abrogatedDec, Date sinemsDate, boolean portability, DecreeSelect decree) {
        super();

        String enrollmentStartDate = AppFunctions.xmlDateToLetterDate(abrogatedDec.getAcreditacion().getPeriodoInicio());
        String enrollmentEndDate = AppFunctions.xmlDateToLetterDate(abrogatedDec.getAcreditacion().getPeriodoTermino());
        String printDate = AppFunctions.xmlDateToPrintDate(abrogatedDec.getSep().getFechaSep());
        String sepDate = AppFunctions.xmlDateToSepDate(abrogatedDec.getSep().getFechaSep());
        String dateSep = AppFunctions.dateParseStringAll(abrogatedDec.getSep().getFechaSep());

        this.state = abrogatedDec.getPlantelOServicioEducativo().getEntidadFederativa();
        this.educationalOption = abrogatedDec.getIems().getOpcionEducativa();
        this.municipality = abrogatedDec.getPlantelOServicioEducativo().getMunicipio();
        this.cct = abrogatedDec.getPlantelOServicioEducativo().getCct();
        this.curp = abrogatedDec.getAlumno().getCurp();
        this.enrollmentKey = abrogatedDec.getAlumno().getNumeroControl();
        this.careerName = abrogatedDec.getAcreditacion().getNombreTipoPerfilLaboralEMS();
        this.careerKey = abrogatedDec.getAcreditacion().getClavePlanEstudios();
        this.enrollmentStartDate = enrollmentStartDate;
        this.enrollmentEndDate = enrollmentEndDate;
        this.obtainedCredits = abrogatedDec.getAcreditacion().getCreditosObtenidos();
        this.totalCredits = abrogatedDec.getAcreditacion().getTotalCreditos();
        this.studentName = abrogatedDec.getAlumno().getNombre();
        this.studentFirstLastName = abrogatedDec.getAlumno().getPrimerApellido();
        this.studentSecondLastName = abrogatedDec.getAlumno().getSegundoApellido();
        this.finalScore = abrogatedDec.getAcreditacion().getPromedioAprovechamiento();
        this.letterScore = abrogatedDec.getAcreditacion().getPromedioAprovechamientoTexto();
        this.schoolName = abrogatedDec.getPlantelOServicioEducativo().getNombreNumeroPlantel();
        this.modules = new ArrayList<>();
        this.competences = new ArrayList<>();
        this.directorName = abrogatedDec.getFirmaResponsable().getNombre();
        this.directorFirstLastName = abrogatedDec.getFirmaResponsable().getPrimerApellido();
        this.directorSecondLastName = abrogatedDec.getFirmaResponsable().getSegundoApellido();
        this.certificateNumber = abrogatedDec.getFirmaResponsable().getNoCertificadoResponsable();
        this.digitalStamp = abrogatedDec.getFirmaResponsable().getSello();
        this.sepStamp = abrogatedDec.getSep().getSelloSep();
        this.folioNumber = abrogatedDec.getSep().getFolioDigital();
        this.printDate = printDate;
        this.sepDate = sepDate;
        this.directorPosition = abrogatedDec.getFirmaResponsable().getCargo();
        this.certificateTypeId = "Certificado de Terminación de Estudios";
        this.disciplinaryField = abrogatedDec.getPerfilEgresoEspecifico().getCampoDisciplinar();
        this.sinemsDate = AppFunctions.dateToLetterDate(sinemsDate);
        this.schoolType = abrogatedDec.getPlantelOServicioEducativo().getIdTipoPlantel();
        this.studyArea = abrogatedDec.getPerfilEgresoEspecifico().getTrayecto();
        this.portabilty = portability;
        this.blank = false;
        this.generoPlantel = abrogatedDec.getPlantelOServicioEducativo().getGeneroPlantel();
        this.numberDecree = decree.getDecreeNumber();
        this.dateDecree = decree.getDecreeDate();
        this.dateSepString = dateSep;

        for (mx.edu.cecyte.decabrogado.Dec.UacsdeFt.UacdeFt uacdeFt : abrogatedDec.getUacsdeFt().getUacdeFt()) {
            String name = uacdeFt.getNombre();
            if (name.charAt(name.length() - 1) != '.') name += ".";
            String score = uacdeFt.getCalificacion();
            String hours = uacdeFt.getTotalHorasUAC();
            String credits = uacdeFt.getCreditos();
            PdfModuleAbrogated module = new PdfModuleAbrogated(name, score, hours, credits);
            modules.add(module);
        }

        for (Dec.PerfilEgresoEspecifico.CompetenciasEspecificas competenciasEspecifica : abrogatedDec.getPerfilEgresoEspecifico().getCompetenciasEspecificas()) {
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

        List<PdfModuleAbrogated> newModules = new ArrayList<>();
        List<String> newCompetences = new ArrayList<>();
        for (int i = 0; i < modules.size(); i++) {
            String credits = "\t\t";
            String hours = "\t\t";
            String score = "\t\t";
            String name = "\t\t\t\t\t";
            PdfModuleAbrogated module = new PdfModuleAbrogated(name, score, hours, credits);
            newModules.add(module);
        }
        for (int i = 0; i < competences.size(); i++) {
            newCompetences.add("\t\t\t\t\t");
        }

        this.modules = newModules;
        this.competences = newCompetences;
    }

}
