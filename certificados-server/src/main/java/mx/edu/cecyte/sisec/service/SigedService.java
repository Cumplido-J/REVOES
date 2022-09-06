package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.business.FileFunctions;
import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.business.certificate.EndingCertificateFunctions;
import mx.edu.cecyte.sisec.business.certificate.PartialCertificateFunctions;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.siged.SigedFolioData;
import mx.edu.cecyte.sisec.queries.CertificateQueries;
import mx.edu.cecyte.sisec.queries.SigedApiQueries;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class SigedService {
    @Autowired private SigedApiQueries sigedApiQueries;
    @Autowired private PropertiesService propertiesService;
    @Autowired private CertificateQueries certificateQueries;

    public SigedFolioData getFolioData(String folioNumber) {
        String prueba="";


        Map<String, SigedFolioData> dataTest = getTestCertificates();
            prueba="1a";
        if (dataTest.containsKey(folioNumber)) return dataTest.get(folioNumber);

        prueba="2";
        SigedFolioData folioData = sigedApiQueries.getFolioData(folioNumber);
            prueba="2s";
        if (folioData != null) return folioData;
            prueba="2a";
        Certificate certificate = certificateQueries.findByFolioNumberOrNull(folioNumber);
            prueba="2c";
        if (certificate == null) return null;
        byte[] xmlBytes = getXmlBytes(certificate);
            prueba="3";
        if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ENDING)){
            prueba="4";
            return EndingCertificateFunctions.getFolioDataFromXmlBytes(xmlBytes, certificate.getStatus());}
        else if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_PARTIAL)){
            prueba="5";
            return PartialCertificateFunctions.getFolioDataFromXmlBytes(xmlBytes, certificate.getStatus());}
            prueba="6";
        return null;

    }

    private byte[] getXmlBytes(Certificate certificate) {
        Path xmlPath = getXmlPath(certificate.getCertificateTypeId(), certificate);
        return FileFunctions.getFileFromPath(xmlPath);
    }

    private Path getXmlPath(Integer certificateTypeId, Certificate certificate) {
        String mainFolder = "";
        if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING))
            mainFolder = propertiesService.getEndingCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_PARTIAL))
            mainFolder = propertiesService.getPartialCertificateDirectory();

        Integer stateId = certificate.getStudent().getSchoolCareer().getSchool().getCity().getState().getId();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);

        return Paths.get(mainFolder, stateFolder, certificate.getMecBatchNumber().toString(), "Descarga", certificate.getFileName());
    }


    private Map<String, SigedFolioData> getTestCertificates() {
        Map<String, SigedFolioData> testData = new HashMap<>();
        SigedFolioData CECyTE_AbrogadoMCC = SigedFolioData.builder()
                .institucion("DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE JALISCO").entidadFederativa("JALISCO").tipo("IEMS").idEntidadFederativa("14").estatus("CERTIFICADO")
                .certificadoId(10000001)
                .folio("ea92d168-f53b-468f-bc9f-2a021c902df7")
                .curp("TUGV010803HJCRNCA0")
                .nombres("VÍCTOR MANUEL")
                .primerApellido("TRUJILLO")
                .segundoApellido("GONZÁLEZ")
                .tipoCertificado("TERMINACIÓN")
                .promedio("9.0")
                .promedioTexto("NUEVE PUNTO CERO")
                .carrera("ENFERMERÍA GENERAL")
                .fechaCertificado("25/03/2021 17:37:01")
                .fechaEmision("25/03/2021 17:37:01")
                .build();
        SigedFolioData CECyTE_AbrogadoParcial = SigedFolioData.builder()
                .institucion("DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE JALISCO").entidadFederativa("JALISCO").tipo("IEMS").idEntidadFederativa("14").estatus("CERTIFICADO")
                .certificadoId(10000002)
                .folio("b20cbbf7-5000-4a25-a46b-5bfba5b9d35f")
                .curp("VAHU021021HJCRRLA4")
                .nombres("ULISES TADEO")
                .primerApellido("VARGAS")
                .segundoApellido("HERNÁNDEZ")
                .tipoCertificado("PARCIAL")
                .promedio("8.5")
                .promedioTexto("OCHO PUNTO CINCO")
                .carrera("ENFERMERÍA GENERAL")
                .fechaCertificado("25/03/2021 17:37:12")
                .fechaEmision("25/03/2021 17:37:12")
                .build();
        SigedFolioData CECyTE_AbrogadoSinMCC = SigedFolioData.builder()
                .institucion("DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE JALISCO").entidadFederativa("JALISCO").tipo("IEMS").idEntidadFederativa("14").estatus("CERTIFICADO")
                .certificadoId(10000003)
                .folio("fa3586ce-3f23-4c40-a089-65b15ac393bd")
                .curp("AAMD011201MJCLRYA4")
                .nombres("DAYANA MICHELLE")
                .primerApellido("ALMARAZ")
                .segundoApellido("MORFIN")
                .tipoCertificado("TERMINACIÓN")
                .promedio("8.4")
                .promedioTexto("OCHO PUNTO CUATRO")
                .carrera("ENFERMERÍA GENERAL")
                .fechaCertificado("25/03/2021 17:37:00")
                .fechaEmision("25/03/2021 17:37:00")
                .build();
        SigedFolioData EMSAD_AbrogadoParcial = SigedFolioData.builder()
                .institucion("DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE JALISCO").entidadFederativa("JALISCO").tipo("IEMS").idEntidadFederativa("14").estatus("CERTIFICADO")
                .certificadoId(10000004)
                .folio("492a545f-0978-42dc-bce9-3d02acafa557")
                .curp("FAHO020820HJCLRSA4")
                .nombres("OSCAR DANIEL")
                .primerApellido("FALCÓN")
                .segundoApellido("HERNÁNDEZ")
                .tipoCertificado("PARCIAL")
                .promedio("9.5")
                .promedioTexto("NUEVE PUNTO CINCO")
                .carrera("INFORMÁTICA")
                .fechaCertificado("25/03/2021 17:37:11")
                .fechaEmision("25/03/2021 17:37:11")
                .build();

        SigedFolioData EMSAD_AbrogadoTermino = SigedFolioData.builder()
                .institucion("DIRECCIÓN GENERAL DEL COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE JALISCO").entidadFederativa("JALISCO").tipo("IEMS").idEntidadFederativa("14").estatus("CERTIFICADO")
                .certificadoId(10000004)
                .folio("8fe49d03-a0fb-4420-a0ca-8c002d9ad18d")
                .curp("BEVE021107MJCRRRA3")
                .nombres("ERIKA PAULETTE")
                .primerApellido("BERMEJO")
                .segundoApellido("VARGAS")
                .tipoCertificado("TERMINACIÓN")
                .promedio("8.0")
                .promedioTexto("OCHO PUNTO CERO")
                .carrera("INFORMÁTICA")
                .fechaCertificado("25/03/2021 17:37:00")
                .fechaEmision("25/03/2021 17:37:00")
                .build();

        testData.put(CECyTE_AbrogadoSinMCC.getFolio(), CECyTE_AbrogadoSinMCC);
        testData.put(CECyTE_AbrogadoParcial.getFolio(), CECyTE_AbrogadoParcial);
        testData.put(CECyTE_AbrogadoMCC.getFolio(), CECyTE_AbrogadoMCC);
        testData.put(EMSAD_AbrogadoParcial.getFolio(), EMSAD_AbrogadoParcial);
        testData.put(EMSAD_AbrogadoTermino.getFolio(), EMSAD_AbrogadoTermino);
        return testData;
    }
}
