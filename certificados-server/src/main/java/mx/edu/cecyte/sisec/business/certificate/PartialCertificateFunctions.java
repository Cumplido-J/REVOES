package mx.edu.cecyte.sisec.business.certificate;

import mx.edu.cecyte.decparcial.Dec;
import mx.edu.cecyte.sisec.business.CryptographyFunctions;
import mx.edu.cecyte.sisec.business.MecFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate.PartialPdfData;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.classes.certificate.AdminDecData;
import mx.edu.cecyte.sisec.classes.certificate.CertificateFolio;
import mx.edu.cecyte.sisec.classes.certificate.StudentPartialDecData;
import mx.edu.cecyte.sisec.classes.certificate.StudentPartialDecDataUac;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.model.siged.SigedFolioData;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.CustomFileExtension;
import mx.edu.cecyte.sisec.webservice.PartialDecParser;

import java.nio.charset.StandardCharsets;
import java.util.Date;

public class PartialCertificateFunctions {

    public static SigedFolioData getFolioDataFromXmlBytes(byte[] xmlBytes, String status) {
        Dec dec = PartialDecParser.xmlToClass(xmlBytes);
        Integer certificadoId = null;
        String folio = dec.getSep().getFolioDigital();
        String curp = dec.getAlumno().getCurp().toUpperCase();
        String nombres = dec.getAlumno().getNombre().toUpperCase();
        String primerApellido = dec.getAlumno().getPrimerApellido().toUpperCase();
        String segundoApellido = dec.getAlumno().getSegundoApellido() != null ? dec.getAlumno().getSegundoApellido().toUpperCase() : "";

        String institucion = "DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE " + dec.getPlantelOServicioEducativo().getEntidadFederativa().toUpperCase();
        String fechaCertificado = AppFunctions.xmlDateToSepDate(dec.getSep().getFechaSep());
        String estatus = status.toUpperCase();
        String tipoCertificado = "PARCIAL";
        String promedio = dec.getAcreditacion().getPromedioAprovechamiento();
        String promedioTexto = dec.getAcreditacion().getPromedioAprovechamientoTexto().toUpperCase();
        String carrera = dec.getAcreditacion().getNombreTipoPerfilLaboralEMS().toUpperCase();
        String tipo = "IEMS";
        String idEntidadFederativa = dec.getPlantelOServicioEducativo().getIdEntidadFederativa();
        String entidadFederativa = dec.getPlantelOServicioEducativo().getEntidadFederativa().toUpperCase();
        String fechaEmision = AppFunctions.xmlDateToSepDate(dec.getSep().getFechaSep());

        return SigedFolioData.builder()
                .certificadoId(null)
                .certificadoId(certificadoId)
                .folio(folio)
                .curp(curp)
                .nombres(nombres)
                .primerApellido(primerApellido)
                .segundoApellido(segundoApellido)
                .institucion(institucion)
                .fechaCertificado(fechaCertificado)
                .estatus(estatus)
                .tipoCertificado(tipoCertificado)
                .promedio(promedio)
                .promedioTexto(promedioTexto)
                .carrera(carrera)
                .tipo(tipo)
                .idEntidadFederativa(idEntidadFederativa)
                .entidadFederativa(entidadFederativa)
                .fechaEmision(fechaEmision)
                .build();
    }

    public static CustomFile generateXmlFile(StudentPartialDecData studentData, AdminDecData adminDecData, Fiel fielBytes) {
        String folioControl = AppFunctions.createCertificateFolio(studentData.getCurp());
        String xml = generateXml(studentData, adminDecData, fielBytes, folioControl);
        byte[] xmlBytes = xml.getBytes(StandardCharsets.UTF_8);
        return new CustomFile(xmlBytes, folioControl, CustomFileExtension.XML);
    }

    public static String generateXml(StudentPartialDecData studentData, AdminDecData adminDecData, Fiel fielBytes, String folioControl) {
        Dec dec = new Dec();
        dec.setVersion("2.0");
        dec.setFolioControl(folioControl);
        dec.setTipoCertificado(AppCatalogs.CERTIFICATETYPE_PARTIAL);

        Dec.FirmaResponsable firmaResponsable = new Dec.FirmaResponsable();
        firmaResponsable.setNombre(adminDecData.getName());
        firmaResponsable.setPrimerApellido(adminDecData.getFirstLastName());
        if (adminDecData.getSecondLastName() != null)
            firmaResponsable.setSegundoApellido(adminDecData.getSecondLastName());
        firmaResponsable.setCurp(adminDecData.getCurp());
        firmaResponsable.setIdCargo(adminDecData.getPositionId());
        dec.setFirmaResponsable(firmaResponsable);


        Dec.Iems iems = new Dec.Iems();
        iems.setNombreSEN(AppCatalogs.nombreSEN);
        iems.setNombreDependencia(AppCatalogs.nombreDependencia);
        iems.setIdIEMS(studentData.getIemsId());
        iems.setIdTipoIEMS(AppCatalogs.TIPOIEMS_DESCENTRALIZADO);
        iems.setIdOpcionEducativa(studentData.getEducationalOptionId());
        dec.setIems(iems);

        Dec.PlantelOServicioEducativo decPlantel = new Dec.PlantelOServicioEducativo();
        String schoolName = AppFunctions.getSchoolName(studentData.getPdfFinalName(), studentData.getPdfName(), studentData.getPdfNumber(), studentData.getSchoolTypeId());
        decPlantel.setNombreNumeroPlantel(schoolName);
        decPlantel.setCct(studentData.getCct());
        decPlantel.setIdTipoPlantel(studentData.getSchoolTypeId());
        decPlantel.setIdEntidadFederativa(studentData.getStateIdString());
        decPlantel.setIdMunicipio(studentData.getLocalityId());
        decPlantel.setIdGeneroPlantel(AppCatalogs.GENERO_EL);
        decPlantel.setIdSostenimiento(AppCatalogs.SOSTENIMIENTO_PUBLICO);
        dec.setPlantelOServicioEducativo(decPlantel);

        Dec.Alumno alumno = new Dec.Alumno();
        alumno.setNombre(studentData.getName());
        alumno.setPrimerApellido(studentData.getFirstLastName());
        alumno.setSegundoApellido(studentData.getSecondLastName());
        alumno.setCurp(studentData.getCurp());
        alumno.setNumeroControl(studentData.getEnrollmentKey());
        dec.setAlumno(alumno);

        Dec.Acreditacion acreditacion = new Dec.Acreditacion();
        acreditacion.setIdNivelEstudios(AppCatalogs.NIVELESTUDIOS_BACHILLERATO);
        acreditacion.setIdTipoEstudiosIEMS(studentData.getStudyTypeId());
        acreditacion.setTipoPerfilLaboralEMS(studentData.getProfileType());
        if ( !studentData.getCareerKey().equals(AppCatalogs.firstSemesterCareerKey)){
            acreditacion.setNombreTipoPerfilLaboralEMS(AppFunctions.firstLetterUpperCase(studentData.getCareerName()));
        }
        try {
            acreditacion.setPeriodoInicio(AppFunctions.parseDateToDecStringDate(studentData.getEnrollmentStartDate()));
            acreditacion.setPeriodoTermino(AppFunctions.parseDateToDecStringDate(studentData.getEnrollmentEndDate()));
            acreditacion.setCreditosObtenidos(studentData.getObtainedCredits().toString());
            acreditacion.setTotalCreditos(studentData.getTotalCredits().toString());
        } catch (Exception ex) {
            throw new AppException("Los datos del alumno " + studentData.getCurp() + " están incorrectos.");
        }
        acreditacion.setPromedioAprovechamiento(AppFunctions.scoreTo1Decimal(studentData.getFinalScore()));
        acreditacion.setPromedioAprovechamientoTexto(AppFunctions.scoreToLetter(studentData.getFinalScore()));
        dec.setAcreditacion(acreditacion);

        Dec.Uacs uacs = new Dec.Uacs();
        uacs.setIdTipoPeriodo(AppCatalogs.TIPOPERIODO_SEMESTRAL);
        uacs.setNombreTipoPeriodo("Semestral");
        for (StudentPartialDecDataUac uacData : studentData.getUacs()) {
            String score = AppFunctions.tryParseDouble(uacData.getCalificacionUAC());
            Dec.Uacs.Uac uac = new Dec.Uacs.Uac();
            uac.setCct(uacData.getCct());
            uac.setIdTipoUAC(uacData.getIdTipoUAC());
            uac.setNombreUAC(uacData.getNombreUAC());
            uac.setCalificacionUAC(score);
            uac.setTotalHorasUAC(uacData.getTotalHorasUAC());
            uac.setCreditosUAC(uacData.getCreditosUAC());
            uac.setPeriodoEscolarUAC(uacData.getPeriodoEscolarUAC());
            uac.setNumeroPeriodoUAC(uacData.getNumeroPeriodoUAC().toString());
            if (uacData.getIdTipoUAC() == 1) uac.setTipoUAC("Disciplinar básica");
            else if (uacData.getIdTipoUAC() == 2) uac.setTipoUAC("Disciplinar extendida");
            else if (uacData.getIdTipoUAC() == 3) uac.setTipoUAC("Profesional básica");
            else if (uacData.getIdTipoUAC() == 4) uac.setTipoUAC("Profesional extendida");
            else uac.setTipoUAC("***");
            uacs.getUac().add(uac);
        }
        dec.setUacs(uacs);
        String originalString = generateOriginalString(dec);
        String fielCertificateString = fielBytes.getCer64();
        String noCertificado = CryptographyFunctions.getCertificateNumber(fielBytes.getCer());
        String sello = CryptographyFunctions.signWithKey(fielBytes, originalString);

        dec.getFirmaResponsable().setCertificadoResponsable(fielCertificateString);
        dec.getFirmaResponsable().setNoCertificadoResponsable(noCertificado);
        dec.getFirmaResponsable().setSello(sello);

        String xmlString = PartialDecParser.classToXml(dec);
        xmlString = xmlString.replace("\"https://www.siged.sep.gob.mx/certificados/\"",
                "\"https://www.siged.sep.gob.mx/certificados/\" " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                        "xsi:schemaLocation=\"https://www.siged.sep.gob.mx/certificados/IEMSCertificadoParcial2_0.xsd\"");
        return xmlString;
    }

    private static String generateOriginalString(Dec dec) {
        StringBuilder sb = new StringBuilder();
        sb.append("||");
        sb.append(MecFunctions.concatToOriginalString(dec.getVersion()));
        sb.append(MecFunctions.concatToOriginalString(dec.getTipoCertificado()));

        sb.append(MecFunctions.concatToOriginalString(dec.getFirmaResponsable().getCurp()));
        sb.append(MecFunctions.concatToOriginalString(dec.getFirmaResponsable().getIdCargo()));

        sb.append(MecFunctions.concatToOriginalString(dec.getIems().getNombreDependencia()));
        sb.append(MecFunctions.concatToOriginalString(dec.getIems().getIdIEMS()));
        sb.append(MecFunctions.concatToOriginalString(dec.getIems().getIdOpcionEducativa()));

        sb.append(MecFunctions.concatToOriginalString(dec.getPlantelOServicioEducativo().getIdTipoPlantel()));
        sb.append(MecFunctions.concatToOriginalString(dec.getPlantelOServicioEducativo().getIdMunicipio()));
        sb.append(MecFunctions.concatToOriginalString(dec.getPlantelOServicioEducativo().getIdEntidadFederativa()));
        sb.append(MecFunctions.concatToOriginalString(dec.getPlantelOServicioEducativo().getCct()));
        sb.append(MecFunctions.concatToOriginalString(dec.getPlantelOServicioEducativo().getClaveRvoe()));
        sb.append(MecFunctions.concatToOriginalString(dec.getPlantelOServicioEducativo().getFechaInicioRvoe()));

        sb.append(MecFunctions.concatToOriginalString(dec.getAlumno().getCurp()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAlumno().getNombre()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAlumno().getPrimerApellido()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAlumno().getSegundoApellido()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAlumno().getNumeroControl()));

        sb.append(MecFunctions.concatToOriginalString(dec.getAcreditacion().getIdTipoEstudiosIEMS()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAcreditacion().getPeriodoInicio()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAcreditacion().getPeriodoTermino()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAcreditacion().getCreditosObtenidos()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAcreditacion().getTotalCreditos()));
        sb.append(MecFunctions.concatToOriginalString(dec.getAcreditacion().getPromedioAprovechamiento()));

        if (dec.getUacs() != null) {
            sb.append(MecFunctions.concatToOriginalString(dec.getUacs().getIdTipoPeriodo()));
            for (Dec.Uacs.Uac uac : dec.getUacs().getUac()) {
                sb.append(MecFunctions.concatToOriginalString(uac.getCct()));
                sb.append(MecFunctions.concatToOriginalString(uac.getNombreUAC()));
                sb.append(MecFunctions.concatToOriginalString(uac.getCalificacionUAC()));
                sb.append(MecFunctions.concatToOriginalString(uac.getPeriodoEscolarUAC()));
                sb.append(MecFunctions.concatToOriginalString(uac.getNumeroPeriodoUAC()));
            }
        }
        sb.append("|");
        System.out.println(sb.toString());
        return sb.toString();
    }

    public static PartialPdfData generatePdfData(byte[] xmlBytes, Date sinemsDate, String careerKey, DecreeSelect decree) {
        Dec dec = PartialDecParser.xmlToClass(xmlBytes);
        return new PartialPdfData(dec, sinemsDate, careerKey, decree);
    }

    public static CertificateFolio getFolioFromXmlBytes(byte[] xmlBytes) {
        Dec dec = PartialDecParser.xmlToClass(xmlBytes);
        return new CertificateFolio(dec.getSep().getFolioDigital(), dec.getAlumno().getCurp(), dec.getSep().getFechaSep().toString());
    }

}
