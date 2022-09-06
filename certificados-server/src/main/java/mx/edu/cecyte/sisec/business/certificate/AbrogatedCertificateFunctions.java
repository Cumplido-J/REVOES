package mx.edu.cecyte.sisec.business.certificate;

import mx.edu.cecyte.decabrogado.Dec;
import mx.edu.cecyte.sisec.business.CryptographyFunctions;
import mx.edu.cecyte.sisec.business.MecFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.abrogatedcertificate.AbrogatedPdfData;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.classes.certificate.AdminDecData;
import mx.edu.cecyte.sisec.classes.certificate.CertificateFolio;
import mx.edu.cecyte.sisec.classes.certificate.StudentAbrogatedDecData;
import mx.edu.cecyte.sisec.classes.certificate.StudentAbrogatedDecDataModule;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.model.siged.SigedFolioData;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.CustomFileExtension;
import mx.edu.cecyte.sisec.webservice.AbrogatedDecParser;

import java.nio.charset.StandardCharsets;
import java.util.Date;

public class AbrogatedCertificateFunctions {

    public static SigedFolioData getFolioDataFromXmlBytes(byte[] xmlBytes, String status) {
        Dec dec = AbrogatedDecParser.xmlToClass(xmlBytes);
        Integer certificadoId = null;
        String folio = dec.getSep().getFolioDigital();
        String curp = dec.getAlumno().getCurp().toUpperCase();
        String nombres = dec.getAlumno().getNombre().toUpperCase();
        String primerApellido = dec.getAlumno().getPrimerApellido().toUpperCase();
        String segundoApellido = dec.getAlumno().getSegundoApellido() != null ? dec.getAlumno().getSegundoApellido().toUpperCase() : "";

        String institucion = "DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE " + dec.getPlantelOServicioEducativo().getEntidadFederativa().toUpperCase();
        String fechaCertificado = AppFunctions.xmlDateToSepDate(dec.getSep().getFechaSep());
        String estatus = status.toUpperCase();
        String tipoCertificado = "TERMINACIÓN";
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

    public static CustomFile generateXmlFile(StudentAbrogatedDecData studentData, AdminDecData adminDecData, Fiel fielBytes) {
        String folioControl = AppFunctions.createCertificateFolio(studentData.getCurp());
        String xml = generateXml(studentData, adminDecData, fielBytes, folioControl);
        byte[] xmlBytes = xml.getBytes(StandardCharsets.UTF_8);
        return new CustomFile(xmlBytes, folioControl, CustomFileExtension.XML);
    }

    public static String generateXml(StudentAbrogatedDecData studentData, AdminDecData adminDecData, Fiel fielBytes, String folioControl) {
        Dec dec = new Dec();
        dec.setVersion("3.0");
        dec.setFolioControl(folioControl);

        /*Por regla de negocio, se mantiene el valor 1 en tipo de certificado aunque sea abrogado*/
        dec.setTipoCertificado(AppCatalogs.CERTIFICATETYPE_ENDING);

        Dec.FirmaResponsable firmaResponsable = new Dec.FirmaResponsable();
        firmaResponsable.setNombre(adminDecData.getName());
        firmaResponsable.setPrimerApellido(adminDecData.getFirstLastName());
        if (adminDecData.getSecondLastName() != null)
            firmaResponsable.setSegundoApellido(adminDecData.getSecondLastName());
        firmaResponsable.setCurp(adminDecData.getCurp());
        firmaResponsable.setIdCargo(adminDecData.getPositionId());
        dec.setFirmaResponsable(firmaResponsable);

        Dec.PlantelOServicioEducativo decPlantel = new Dec.PlantelOServicioEducativo();
        String schoolName = "";
        if (studentData.getPdfName() != null && studentData.getPdfName().equals(studentData.getPdfNumber())) {
            schoolName = studentData.getPdfName();
        } else {
            schoolName = AppFunctions.getSchoolName(studentData.getPdfFinalName(), studentData.getPdfName(), studentData.getPdfNumber(), studentData.getSchoolTypeId());
        }
        decPlantel.setNombreNumeroPlantel(schoolName);
        decPlantel.setCct(studentData.getCct());
        decPlantel.setIdTipoPlantel(studentData.getSchoolTypeId());
        decPlantel.setIdEntidadFederativa(studentData.getStateIdString());
        decPlantel.setIdMunicipio(studentData.getLocalityId());
        if (studentData.getPdfName() != null && studentData.getPdfName().equals(studentData.getPdfNumber())) {
            decPlantel.setIdGeneroPlantel(studentData.getGender());
        } else {
            decPlantel.setIdGeneroPlantel(AppCatalogs.GENERO_EL);
        }
        decPlantel.setIdSostenimiento(AppCatalogs.SOSTENIMIENTO_PUBLICO);
        dec.setPlantelOServicioEducativo(decPlantel);

        Dec.Iems iems = new Dec.Iems();
        iems.setNombreSEN(AppCatalogs.nombreSEN);
        iems.setNombreDependencia(AppCatalogs.nombreDependencia);
        iems.setIdIEMS(studentData.getIemsId());
        iems.setIdTipoIEMS(AppCatalogs.TIPOIEMS_DESCENTRALIZADO);
        iems.setNombreIEMSparticular(null);
        iems.setInstitucionRVOE(null);
        iems.setIdOpcionEducativa(studentData.getEducationalOptionId());
        dec.setIems(iems);

        Dec.Acreditacion acreditacion = new Dec.Acreditacion();
        acreditacion.setIdNivelEstudios(AppCatalogs.NIVELESTUDIOS_BACHILLERATO);
        acreditacion.setIdTipoEstudiosIEMS(studentData.getStudyTypeId());
        acreditacion.setTipoPerfilLaboralEMS(studentData.getProfileType());
        acreditacion.setNombreTipoPerfilLaboralEMS(AppFunctions.firstLetterUpperCase(studentData.getCareerName()));
        if (studentData.getSchoolTypeId().equals(AppCatalogs.SCHOOLTYPE_CECYTE) && !studentData.getIsPortability()) {
            acreditacion.setClavePlanEstudios(studentData.getCareerKey());
        }
        try {
            acreditacion.setPeriodoInicio(AppFunctions.parseDateToDecStringDate(studentData.getEnrollmentStartDate()));
            acreditacion.setPeriodoTermino(AppFunctions.parseDateToDecStringDate(studentData.getEnrollmentEndDate()));
            acreditacion.setCreditosObtenidos(studentData.getCredits().toString());
            acreditacion.setTotalCreditos(studentData.getCredits().toString());
        } catch (Exception ex) {
            throw new AppException("Los datos del alumno " + adminDecData.getCurp() + " están incorrectos.");
        }

        acreditacion.setPromedioAprovechamiento(AppFunctions.scoreTo1Decimal(studentData.getFinalScore()));
        acreditacion.setPromedioAprovechamientoTexto(AppFunctions.scoreToLetter(studentData.getFinalScore()));
        dec.setAcreditacion(acreditacion);

        Dec.Alumno alumno = new Dec.Alumno();
        alumno.setNombre(studentData.getName());
        alumno.setPrimerApellido(studentData.getFirstLastName());
        alumno.setSegundoApellido(studentData.getSecondLastName());
        alumno.setCurp(studentData.getCurp());
        alumno.setNumeroControl(studentData.getEnrollmentKey());
        dec.setAlumno(alumno);

        Dec.PerfilEgresoEspecifico perfilEgresoEspecifico = new Dec.PerfilEgresoEspecifico();
        perfilEgresoEspecifico.setTrayecto(studentData.getStudyArea());
        perfilEgresoEspecifico.setIdCampoDisciplinar(studentData.getDisciplinarFieldId());
        perfilEgresoEspecifico.setCampoDisciplinar(studentData.getDisciplinarField());
        perfilEgresoEspecifico.setTipoPerfilLaboralEMS(studentData.getProfileType());
        perfilEgresoEspecifico.setNombrePerfilLaboralEMS(AppFunctions.firstLetterUpperCase(studentData.getCareerName()));

        Dec.UacsdeFt uacsdeFt = new Dec.UacsdeFt();

        for (StudentAbrogatedDecDataModule module : studentData.getModules()) {
            Dec.UacsdeFt.UacdeFt uacdeFt = new Dec.UacsdeFt.UacdeFt();
            uacdeFt.setNombre(module.getModule());
            uacdeFt.setCalificacion(AppFunctions.scoreTo1Decimal(module.getScore()));
            if (module.getHours().toString().equals("0")) {
                uacdeFt.setTotalHorasUAC("***");
            }else {
                uacdeFt.setTotalHorasUAC(module.getHours().toString());
            }
            uacdeFt.setCreditos(module.getCredits().toString());

            Dec.PerfilEgresoEspecifico.CompetenciasEspecificas specifCompetencesEspecificas = new Dec.PerfilEgresoEspecifico.CompetenciasEspecificas();
            if (studentData.getSchoolTypeId().equals(AppCatalogs.SCHOOLTYPE_CECYTE))
                specifCompetencesEspecificas.setNombreCompetenciasLaborales(module.getModule());
            else
                specifCompetencesEspecificas.setNombreCompetenciasLaborales(module.getEmsadCompetence());

            uacsdeFt.getUacdeFt().add(uacdeFt);
            perfilEgresoEspecifico.getCompetenciasEspecificas().add(specifCompetencesEspecificas);
        }
        dec.setPerfilEgresoEspecifico(perfilEgresoEspecifico);
        dec.setUacsdeFt(uacsdeFt);

        String originalString = generateOriginalString(dec);
        String fielCertificateString = fielBytes.getCer64();
        String noCertificado = CryptographyFunctions.getCertificateNumber(fielBytes.getCer());
        String sello = CryptographyFunctions.signWithKey(fielBytes, originalString);

        dec.getFirmaResponsable().setCertificadoResponsable(fielCertificateString);
        dec.getFirmaResponsable().setNoCertificadoResponsable(noCertificado);
        dec.getFirmaResponsable().setSello(sello);

        String xmlString = AbrogatedDecParser.classToXml(dec);
        xmlString = xmlString.replace("\"https://www.siged.sep.gob.mx/certificados/\"",
                "\"https://www.siged.sep.gob.mx/certificados/\" " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                        "xsi:schemaLocation=\"https://www.siged.sep.gob.mx/certificados/IEMSCertificadoTerminacion3_0.xsd\"");
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

        if (dec.getUacsdeFt() != null) {
            for (Dec.UacsdeFt.UacdeFt uacdeFt : dec.getUacsdeFt().getUacdeFt()) {
                sb.append(MecFunctions.concatToOriginalString(uacdeFt.getNombre()));
                sb.append(MecFunctions.concatToOriginalString(uacdeFt.getCalificacion()));
                sb.append(MecFunctions.concatToOriginalString(uacdeFt.getTotalHorasUAC()));
            }
        }

        if (dec.getPerfilEgresoEspecifico() == null) {
            return "||||";
        } else {
            sb.append(MecFunctions.concatToOriginalString(dec.getPerfilEgresoEspecifico().getTrayecto()));
            sb.append(MecFunctions.concatToOriginalString(dec.getPerfilEgresoEspecifico().getCampoDisciplinar()));
            sb.append(MecFunctions.concatToOriginalString(dec.getPerfilEgresoEspecifico().getTipoPerfilLaboralEMS()));
            sb.append(MecFunctions.concatToOriginalString(dec.getPerfilEgresoEspecifico().getNombrePerfilLaboralEMS()));
        }
        sb.append("|");
        return sb.toString();
    }

    public static AbrogatedPdfData generatePdfData(byte[] xmlBytes, Date sinemsDate, boolean isPortability, DecreeSelect decree) {
        Dec dec = AbrogatedDecParser.xmlToClass(xmlBytes);
        return new AbrogatedPdfData(dec, sinemsDate, isPortability, decree);
    }

    public static CertificateFolio getFolioFromXmlBytes(byte[] xmlBytes) {
        Dec dec = AbrogatedDecParser.xmlToClass(xmlBytes);
        return new CertificateFolio(dec.getSep().getFolioDigital(), dec.getAlumno().getCurp(), dec.getSep().getFechaSep().toString());
    }
}