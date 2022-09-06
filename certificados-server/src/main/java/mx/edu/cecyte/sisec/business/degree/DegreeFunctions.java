package mx.edu.cecyte.sisec.business.degree;

import mx.edu.cecyte.sisec.business.CryptographyFunctions;
import mx.edu.cecyte.sisec.business.MetFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.degree.DegreePdfData;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.degree.StudentDegreeData;
import mx.edu.cecyte.sisec.dto.degree.DegreeComplementDoc;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.CustomFileExtension;
import mx.edu.cecyte.sisec.webservice.DegreeParser;
import mx.edu.cecyte.titulo.TituloElectronico;

import java.nio.charset.StandardCharsets;

public class DegreeFunctions {
    public static CustomFile generateXmlFile(StudentDegreeData studentData, DegreeSigner degreeSigner) {

        String folioControl = AppFunctions.createDegreeFolio(studentData.getCurp());
        String fileName = AppFunctions.createCertificateFolio(studentData.getCurp());

        String xml = generateXml(studentData, degreeSigner, folioControl);
        byte[] xmlBytes = xml.getBytes(StandardCharsets.UTF_8);
        return new CustomFile(xmlBytes, fileName, CustomFileExtension.XML);
    }

    public static String generateXml(StudentDegreeData studentData, DegreeSigner degreeSigner, String folioControl) {
        TituloElectronico tituloElectronico = new TituloElectronico();
        tituloElectronico.setVersion("1.0");
        tituloElectronico.setFolioControl(folioControl);

        TituloElectronico.FirmaResponsables firmaResponsables = new TituloElectronico.FirmaResponsables();
        TituloElectronico.FirmaResponsables.FirmaResponsable firmaResponsable = new TituloElectronico.FirmaResponsables.FirmaResponsable();
        firmaResponsable.setNombre(degreeSigner.getName());
        firmaResponsable.setPrimerApellido(degreeSigner.getFirstLastName());
        if (degreeSigner.getSecondLastName() != null)
            firmaResponsable.setSegundoApellido(degreeSigner.getSecondLastName());
        firmaResponsable.setCurp(degreeSigner.getCurp());
        firmaResponsable.setIdCargo(degreeSigner.getPositionId());
        firmaResponsable.setCargo(degreeSigner.getPosition());
        firmaResponsables.getFirmaResponsable().add(firmaResponsable);
        tituloElectronico.setFirmaResponsables(firmaResponsables);

        TituloElectronico.Institucion institucion = new TituloElectronico.Institucion();
        institucion.setCveInstitucion(studentData.getSchoolKey());
        institucion.setNombreInstitucion(studentData.getSchoolName());
        tituloElectronico.setInstitucion(institucion);

        TituloElectronico.Carrera carrera = new TituloElectronico.Carrera();
        carrera.setCveCarrera(studentData.getCareerKey());
        carrera.setNombreCarrera(studentData.getCareerName());
        carrera.setFechaInicio(studentData.getStartDate().toString());
        carrera.setFechaTerminacion(AppFunctions.parseDateToDegStringDate(studentData.getEndDate()));
        carrera.setIdAutorizacionReconocimiento(studentData.getAuthId());
        carrera.setAutorizacionReconocimiento(studentData.getAuth());
        tituloElectronico.setCarrera(carrera);

        TituloElectronico.Profesionista profesionista = new TituloElectronico.Profesionista();
        profesionista.setCurp(studentData.getCurp());
        profesionista.setNombre(AppFunctions.DeleteAcentTextAndUpperCase(studentData.getName()));
        profesionista.setPrimerApellido(AppFunctions.DeleteAcentTextAndUpperCase(studentData.getFirstLastName()));
        if (studentData.getSecondLastName() != null)
            profesionista.setSegundoApellido(AppFunctions.DeleteAcentTextAndUpperCase(studentData.getSecondLastName()));
        profesionista.setCorreoElectronico(studentData.getEmail());
        tituloElectronico.setProfesionista(profesionista);

        TituloElectronico.Expedicion expedicion = new TituloElectronico.Expedicion();
        expedicion.setFechaExpedicion(studentData.getExpeditionDate().toString());
        expedicion.setIdModalidadTitulacion(studentData.getDegreeModalityId());
        expedicion.setModalidadTitulacion(studentData.getDegreeModality());
        if (studentData.getExamDate() != null)
            expedicion.setFechaExamenProfesional(AppFunctions.parseDateToDegStringDate(studentData.getExamDate()));
        if (studentData.getExencionExamen() != null)
            expedicion.setFechaExencionExamenProfesional(AppFunctions.parseDateToDegStringDate(studentData.getExencionExamen()));
        expedicion.setCumplioServicioSocial(studentData.getHasSocialService());
        expedicion.setIdFundamentoLegalServicioSocial(studentData.getSocialServiceId());
        expedicion.setFundamentoLegalServicioSocial(studentData.getSocialService());
        String stateId = studentData.getStateId().toString();
        if (stateId.length() == 1) stateId = "0" + stateId;
        expedicion.setIdEntidadFederativa(stateId);
        expedicion.setEntidadFederativa(studentData.getState());
        tituloElectronico.setExpedicion(expedicion);

        TituloElectronico.Antecedente antecedente = new TituloElectronico.Antecedente();
        antecedente.setInstitucionProcedencia(studentData.getAntecdentSchoolName());
        antecedente.setIdTipoEstudioAntecedente(studentData.getAntecedentId());
        antecedente.setTipoEstudioAntecedente(studentData.getAntecedent());
        String antecdentStateId = studentData.getAntecedentStateId().toString();
        if (antecdentStateId.length() == 1) antecdentStateId = "0" + antecdentStateId;
        antecedente.setIdEntidadFederativa(antecdentStateId);
        antecedente.setEntidadFederativa(studentData.getAntecedentState());
        antecedente.setFechaInicio(studentData.getAntecedentStartDate().toString());
        antecedente.setFechaTerminacion(studentData.getAntecedentEndDate().toString());
        antecedente.setNoCedula(studentData.getAntecedentCedula());
        tituloElectronico.setAntecedente(antecedente);

        String originalString = generateOriginalString(tituloElectronico);
        String fielCertificateString = degreeSigner.getFiel().getCer64();
        String noCertificado = CryptographyFunctions.getCertificateNumber(degreeSigner.getFiel().getCer());
        String sello = CryptographyFunctions.signWithKey(degreeSigner.getFiel(), originalString);

        tituloElectronico.getFirmaResponsables().getFirmaResponsable().get(0).setCertificadoResponsable(fielCertificateString);
        tituloElectronico.getFirmaResponsables().getFirmaResponsable().get(0).setNoCertificadoResponsable(noCertificado);
        tituloElectronico.getFirmaResponsables().getFirmaResponsable().get(0).setSello(sello);

        String xmlString = DegreeParser.classToXml(tituloElectronico);
        xmlString = xmlString.replace("\"https://www.siged.sep.gob.mx/titulos/\"",
                "\"https://www.siged.sep.gob.mx/titulos/\" " +
                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                        "xsi:schemaLocation=\"https://www.siged.sep.gob.mx/titulos/schema.xsd\"");
        return xmlString;

    }

    private static String generateOriginalString(TituloElectronico tituloElectronico) {
        StringBuilder sb = new StringBuilder();
        sb.append("||");
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getVersion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getFolioControl()));

        for (TituloElectronico.FirmaResponsables.FirmaResponsable firmaResponsable : tituloElectronico.getFirmaResponsables().getFirmaResponsable()) {
            sb.append(MetFunctions.concatToOriginalString(firmaResponsable.getCurp()));
            sb.append(MetFunctions.concatToOriginalString(firmaResponsable.getIdCargo()));
            sb.append(MetFunctions.concatToOriginalString(firmaResponsable.getCargo()));
            sb.append(MetFunctions.concatToOriginalString(firmaResponsable.getAbrTitulo()));
        }

        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getInstitucion().getCveInstitucion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getInstitucion().getNombreInstitucion()));

        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getCveCarrera()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getNombreCarrera()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getFechaInicio()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getFechaTerminacion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getIdAutorizacionReconocimiento()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getAutorizacionReconocimiento()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getCarrera().getNumeroRvoe()));

        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getProfesionista().getCurp()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getProfesionista().getNombre()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getProfesionista().getPrimerApellido()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getProfesionista().getSegundoApellido()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getProfesionista().getCorreoElectronico()));

        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getFechaExpedicion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getIdModalidadTitulacion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getModalidadTitulacion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getFechaExamenProfesional()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getFechaExencionExamenProfesional()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getCumplioServicioSocial()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getIdFundamentoLegalServicioSocial()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getFundamentoLegalServicioSocial()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getIdEntidadFederativa()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getExpedicion().getEntidadFederativa()));

        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getInstitucionProcedencia()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getIdTipoEstudioAntecedente()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getTipoEstudioAntecedente()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getIdEntidadFederativa()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getEntidadFederativa()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getFechaInicio()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getFechaTerminacion()));
        sb.append(MetFunctions.concatToOriginalString(tituloElectronico.getAntecedente().getNoCedula()));

        sb.append("|");
        System.out.println("CADENA ORIGINAL: "+ sb.toString());
        return sb.toString();
    }

    public static DegreePdfData generatePdfData(byte[] xmlBytes, DegreeComplementDoc complementDoc) {
        TituloElectronico dec = DegreeParser.xmlToClass(xmlBytes);
        return new DegreePdfData(dec, complementDoc);
    }
}
