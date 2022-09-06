package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.certificadows.CancelarCertificadosIEMSResponse;
import mx.edu.cecyte.certificadows.CargaCertificadosIEMSResponse;
import mx.edu.cecyte.certificadows.ConsultaCertificadosIEMSResponse;
import mx.edu.cecyte.certificadows.DescargaCertificadosIEMSResponse;
import mx.edu.cecyte.sisec.business.CryptographyFunctions;
import mx.edu.cecyte.sisec.business.FileFunctions;
import mx.edu.cecyte.sisec.business.MecFunctions;
import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.business.certificate.EndingCertificateFunctions;
import mx.edu.cecyte.sisec.business.certificate.AbrogatedCertificateFunctions;
import mx.edu.cecyte.sisec.business.certificate.PartialCertificateFunctions;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate.EndingCertificatePdfService;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.endingcertificate.EndingPdfData;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate.PartialCertificatePdfService;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate.PartialPdfData;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.abrogatedcertificate.AbrogatedCertificatePdfService;
import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.abrogatedcertificate.AbrogatedPdfData;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.ExcelRowMec;
import mx.edu.cecyte.sisec.classes.Fiel;
import mx.edu.cecyte.sisec.classes.certificate.*;
import mx.edu.cecyte.sisec.dto.catalogs.ConfigPeriodData;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurpsFiel;
import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudent;
import mx.edu.cecyte.sisec.dto.certificate.CertificateStatusValidation;
import mx.edu.cecyte.sisec.dto.degree.CancelStampExternal;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.mec.CertificateStatus;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.queries.degree.DgpQueries;
import mx.edu.cecyte.sisec.shared.*;
import mx.edu.cecyte.sisec.webservice.CertificateClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CertificateService {
    @Autowired private UserQueries userQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private CertificateQueries certificateQueries;
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private PropertiesService propertiesService;
    @Autowired private EndingCertificatePdfService endingCertificatePdfService;
    @Autowired private PartialCertificatePdfService partialCertificatePdfService;
    @Autowired private AbrogatedCertificatePdfService abrogatedCertificatePdfService;
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private DgpQueries dgpQueries;

    public void validateStudents(List<String> curps, Integer certificateType, Integer adminId) {
        List<Student> students = studentQueries.getListStudentByUsernames(curps);
        List<Certificate> certificates = certificateQueries.validateStudents(students, certificateType);

        List<Integer> certificatesId = certificates.stream().map(Certificate::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("CertificateService", "validateStudents", adminId, Certificate.class, certificatesId, "Validated student");
    }

    public void setCertificatesInProcess(List<Certificate> certificates, Integer mecBatchNumber, Integer adminId) {
        certificates.forEach(certificate -> certificate.setInProcess(mecBatchNumber));
        certificates = certificateQueries.saveAllCertificates(certificates);

        List<Integer> certificatesId = certificates.stream().map(Certificate::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("CertificateService", "setCertificatesInProcess", adminId, Certificate.class, certificatesId, "Change status to in process of certificate.");
    }

    public void updateCertificatesResult(List<ExcelRowMec> excelRows, Integer adminId) {
        List<Certificate> certificates = new ArrayList<>();
        for (ExcelRowMec excelRow : excelRows) {
            Certificate certificate = certificateQueries.findInProcessByFileName(excelRow.getFileName());
            certificate.updateExcelResult(excelRow);
            certificates.add(certificate);
        }
        certificates = certificateQueries.saveAllCertificates(certificates);

        List<Integer> certificatesId = certificates.stream().map(Certificate::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("CertificateService", "updateCertificatesResult", adminId, Certificate.class, certificatesId, "Changed certificate status from excel result.");
    }


    public Map<String, Object> studentSearch(CertificateSearchFilter filter, Integer adminId, Integer searchType) {
        Map<String, Object> result = new HashMap<>();
        User userAdmin = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIdsByAdminUser = userQueries.getAvailableSchoolIdsByAdminUserV2(filter.getStateId(),userAdmin,AppCatalogs.isState);

        if (filter.getCertificateTypeId() == 1) {
            List<EndingCertificateValidationStudent> students = new ArrayList<>();

            if ((Arrays.asList(AppCatalogs.actualEndingCertificateStates).contains(filter.getStateId())) || userQueries.isDevAdmin(userAdmin))
                students = certificateQueries.searchEndingCertificateStudents(filter, availableSchoolIdsByAdminUser, searchType);

            result.put("students", students);
        }
        else if (filter.getCertificateTypeId() == AppCatalogs.CERTIFICATETYPE_ABROGATED) {
            List<AbrogatedCertificateValidationStudent> students = new ArrayList<>();

            if ((Arrays.asList(AppCatalogs.actualAbrogatedCertificateStates).contains(filter.getStateId())) || userQueries.isDevAdmin(userAdmin))
                students = certificateQueries.searchAbrogatedCertificateStudents(filter, availableSchoolIdsByAdminUser, searchType);

            result.put("students", students);
        }
        else {

            List<PartialCertificateValidationStudent> students = certificateQueries.searchPartialCertificateValidationStuents(filter, availableSchoolIdsByAdminUser, searchType);
            result.put("students", students);

            List<String> cp = new ArrayList<>();
            cp.add("LOGM740510HASRYS09");
            System.out.println("--"+cp);
            List<Certificate> certificates = certificateQueries.findByUsernameListAndStatus(cp, CertificateStatus.validated);
            for (Certificate certificate : certificates) {
                AdminDecData adminDecData = certificateQueries.getAdminDecData(userAdmin);
                StudentPartialDecData decData = certificateQueries.getStudentPartialDecData(certificate.getStudent().getId());
                Fiel fielBytes = new Fiel();
                CustomFile xmlFile = PartialCertificateFunctions.generateXmlFile(decData, adminDecData, fielBytes);
                System.out.println(xmlFile.toString());
            }

        }
        return result;
    }

    public Map<String, Object> studentQuerySearch(CertificateSearchFilter filter, Integer adminId) {
        Map<String, Object> result = new HashMap<>();
        User userAdmin = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIdsByAdminUser = userQueries.getAvailableSchoolIdsByAdminUserV2(filter.getStateId(),userAdmin,AppCatalogs.isState);

        List<CertificateQueryStudent> students = certificateQueries.studentQuerySearch(filter, availableSchoolIdsByAdminUser);
        result.put("students", students);

        return result;
    }

    public void reprobateStudent(String curp, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        student = studentQueries.reprobateStudent(student);
        auditingQueries.saveAudit("CertificateService", "reprobateStudent", adminId, Student.class, student.getId(), "Student reprobate changed.");
    }

    public void editStudentModules(CertificateEditStudent certificateEditStudent, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(certificateEditStudent.getCurp());

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);
        System.out.println("=> "+certificateEditStudent.getIsAbrogado());
        System.out.println("=> "+certificateEditStudent.getIsPortability());
        System.out.println("=> "+certificateEditStudent.getDisciplinaryCompetence());
        System.out.println("=> "+certificateEditStudent.getReprobate());
        System.out.println("=> "+certificateEditStudent.getSchoolName());
        System.out.println("=> "+certificateEditStudent.getDisciplinaryCompetence());
        student = studentQueries.editStudentModules(student, certificateEditStudent);
        auditingQueries.saveAudit("CertificateService", "editStudentModules", adminId, Student.class, student.getId(), "Student modules changed, " + certificateEditStudent);
    }

    public CertificateEditStudent getStudentModules(String curp, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);
        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);

        return studentQueries.getStudentModules(student);
    }

    public void certificateStudents(CertificateCurpsFiel certificateCurpsFiel, Integer adminId) {
        CryptographyFunctions.signWithKey(certificateCurpsFiel.getFielBytes(), "Test String");

        List<Certificate> certificates = certificateQueries.findByUsernameListAndStatus(certificateCurpsFiel.getCurps(), CertificateStatus.validated);
        User userAdmin = userQueries.getUserById(adminId);
        MecCredentials mecCredentials = userQueries.getMecCredentialsFromAdmin(userAdmin);
        Integer stateId = mecCredentials.getState().getId();
        AdminDecData adminDecData = certificateQueries.getAdminDecData(userAdmin);

        List<CustomFile> xmlsToSend = getXmlsToSend(certificates, certificateCurpsFiel, adminDecData, userQueries.isDevAdmin(userAdmin));
        CargaCertificadosIEMSResponse uploadResponse = uploadXmls(userAdmin, mecCredentials, adminDecData, xmlsToSend,certificateCurpsFiel.getIsTest(), certificateCurpsFiel.getIsWebService());

        if (uploadResponse.getNumeroLote() == null) {
            if (!StringUtils.isEmpty(uploadResponse.getMensaje())) throw new AppException(uploadResponse.getMensaje());
            throw new AppException(Messages.mec_noServerConnection);
        }

        saveUploadXmls(certificateCurpsFiel.getCertificateTypeId(), stateId, xmlsToSend, uploadResponse.getNumeroLote().intValue());
        setCertificatesInProcess(certificates, uploadResponse.getNumeroLote().intValue(), adminId);
    }

    private CargaCertificadosIEMSResponse uploadXmls(User userAdmin, MecCredentials mecCredentials, AdminDecData adminDecData, List<CustomFile> xmlsToSend,
                                                     boolean isAuthorization_WS, boolean isWebService) {
        CustomFile zipToSend = FileFunctions.compressFiles(xmlsToSend, adminDecData.getCurp());
        boolean isAuthorization_TEST_or_PRODUCTION = false;
        if ( isWebService ) isAuthorization_TEST_or_PRODUCTION = mecCredentials.getAuthentificationWS().equals("P") ? isAuthorization_WS : true;

        CertificateClient client = new CertificateClient(mecCredentials, isAuthorization_TEST_or_PRODUCTION);
        //CertificateClient client = new CertificateClient(mecCredentials, userQueries.isDevAdmin(userAdmin));
        return client.uploadRequest(zipToSend);
    }

    private List<CustomFile> getXmlsToSend(List<Certificate> certificates, CertificateCurpsFiel certificateCurpsFiel, AdminDecData adminDecData, boolean isDev) {
        List<CustomFile> xmlsToSend = new ArrayList<>();
        for (Certificate certificate : certificates) {
            CustomFile xmlFile;
            if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ENDING)) {
                StudentEndingDecData decData = certificateQueries.getStudentEndingDecData(certificate.getStudent().getId());
                if (isDev) decData.setIemsId(AppFunctions.getIemsIdByStateId(14));
                xmlFile = EndingCertificateFunctions.generateXmlFile(decData, adminDecData, certificateCurpsFiel.getFielBytes());
            } else if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ABROGATED)) {
                Integer schoolId = certificate.getStudent().getSchoolCareer().getSchool().getId();
                boolean isExist = schoolSearchQueries.isSchoolEquivalentExist(schoolId);
                StudentAbrogatedDecData decData;
                if (isExist) {
                    decData = certificateQueries.getStudentAbrogatedDecDataEquivalent(certificate.getStudent().getId(), schoolId);
                } else {
                    decData = certificateQueries.getStudentAbrogatedDecData(certificate.getStudent().getId());
                }

                if (isDev) decData.setIemsId(AppFunctions.getIemsIdByStateId(14));
                xmlFile = AbrogatedCertificateFunctions.generateXmlFile(decData, adminDecData, certificateCurpsFiel.getFielBytes());
            } else {
                StudentPartialDecData decData = certificateQueries.getStudentPartialDecData(certificate.getStudent().getId());
                if (isDev) decData.setIemsId(AppFunctions.getIemsIdByStateId(14));
                System.out.println(certificateCurpsFiel.getFielBytes());
                xmlFile = PartialCertificateFunctions.generateXmlFile(decData, adminDecData, certificateCurpsFiel.getFielBytes());
            }
            certificate.setFileName(xmlFile.getFileNameWithExtension());
            xmlsToSend.add(xmlFile);
        }
        return xmlsToSend;
    }

    private void saveUploadXmls(Integer certificateTypeId, Integer stateId, List<CustomFile> xmlsToSend, Integer mecBatchNumber) {
        String mainFolder = "";
        if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING))
            mainFolder = propertiesService.getEndingCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ABROGATED))
            mainFolder = propertiesService.getAbrogatedCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_PARTIAL))
            mainFolder = propertiesService.getPartialCertificateDirectory();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        Path uploadPath = Paths.get(mainFolder, stateFolder, mecBatchNumber.toString(), "Carga");
        xmlsToSend.forEach(xmlFile -> FileFunctions.saveFile(uploadPath, xmlFile));
    }

    private void saveDownloadXmls(Integer certificateTypeId, Integer stateId, List<CustomFile> xmlsReceived, Integer mecBatchNumber) {
        String mainFolder = "";
        if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING))
            mainFolder = propertiesService.getEndingCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ABROGATED))
            mainFolder = propertiesService.getAbrogatedCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_PARTIAL))
            mainFolder = propertiesService.getPartialCertificateDirectory();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        Path uploadPath = Paths.get(mainFolder, stateFolder, mecBatchNumber.toString(), "Descarga");
        xmlsReceived.forEach(xmlFile -> FileFunctions.saveFile(uploadPath, xmlFile));
    }

    public CustomFile downloadXml(String folioNumber, Integer adminId) {
        Certificate certificate = certificateQueries.findByFolioNumber(folioNumber);
        String filename = certificate.getStudent().getUser().getUsername();

        byte[] xmlBytes = getXmlBytes(certificate);
        return new CustomFile(xmlBytes, filename, CustomFileExtension.XML);
    }

    public CustomFile downloadPdf(String folioNumber, Integer adminId) {
        Certificate certificate = certificateQueries.findByFolioNumber(folioNumber);
        String filename = certificate.getStudent().getUser().getUsername();
        byte[] xmlBytes = getXmlBytes(certificate);
        byte[] pdfBytes = getPdfBytes(certificate, xmlBytes);
        return new CustomFile(pdfBytes, filename, CustomFileExtension.PDF);
    }

    private byte[] getPdfBytes(Certificate certificate, byte[] xmlBytes) {
        byte[] pdfBytes = null;
        Date sinemsDate = certificate.getStudent().getSchoolCareer().getSchool().getSinemsDate();
        String careerKey = certificate.getStudent().getSchoolCareer().getCareer().getCareerKey();
        boolean isPortability = certificate.getStudent().getIsPortability();
        DecreeSelect decree = dgpQueries.selectDecree(certificate.getStudent().getSchoolCareer().getSchool().getCity().getState().getId());
        ConfigPeriodData periodData = certificateQueries.selectPeriodCerticate(certificate.getStudent().getSchoolCareer().getSchool().getCity().getState().getId(), certificate.getStudent().getGeneration());
        if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ENDING)) {
            EndingPdfData pdfData = EndingCertificateFunctions.generatePdfData(xmlBytes, sinemsDate, isPortability, decree, periodData);
            pdfBytes = endingCertificatePdfService.generatePdf(pdfData);
        } else if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_ABROGATED)) {
            AbrogatedPdfData pdfData = AbrogatedCertificateFunctions.generatePdfData(xmlBytes, sinemsDate, isPortability, decree);
            pdfBytes = abrogatedCertificatePdfService.generatePdf(pdfData);
        } else if (certificate.getCertificateTypeId().equals(AppCatalogs.CERTIFICATETYPE_PARTIAL)) {
            PartialPdfData pdfData = PartialCertificateFunctions.generatePdfData(xmlBytes, sinemsDate, careerKey, decree);
            pdfBytes = partialCertificatePdfService.generatePdf(pdfData);
        }
        return pdfBytes;
    }

    private Path getXmlPath(Integer certificateTypeId, Certificate certificate) {
        String mainFolder = "";
        if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING))
            mainFolder = propertiesService.getEndingCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ABROGATED))
            mainFolder = propertiesService.getAbrogatedCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_PARTIAL))
            mainFolder = propertiesService.getPartialCertificateDirectory();

        Integer stateId = certificate.getStudent().getSchoolCareer().getSchool().getCity().getState().getId();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);

        return Paths.get(mainFolder, stateFolder, certificate.getMecBatchNumber().toString(), "Descarga", certificate.getFileName());
    }

    public boolean getPendientBatches(Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Integer stateId;
        /*if (userAdmin.getCertificationAdmin() != null) stateId = userAdmin.getCertificationAdmin().getState().getId();
        else stateId = userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);*/

        stateId = userAdmin.getAdminUserScope() != null ? catalogQueries.getStateId(userAdmin) : userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);

        return certificateQueries.getPendientBatches(stateId);
    }

    public String sincronizeBatches(Integer adminId, boolean isTest) {
        User userAdmin = userQueries.getUserById(adminId);
        Integer stateId;
        /*if (userAdmin.getCertificationAdmin() != null) stateId = userAdmin.getCertificationAdmin().getState().getId();
        else stateId = userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);*/

        stateId = userAdmin.getAdminUserScope() != null ? catalogQueries.getStateId(userAdmin) : userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);

        MecCredentials mecCredentials = userQueries.getMecCredentialsFromState(stateId);
        //CertificateClient client = new CertificateClient(mecCredentials, userQueries.isDevAdmin(userAdmin));
        CertificateClient client = new CertificateClient(mecCredentials, isTest);

        Set<Integer> mecBatchNumbers = certificateQueries.getPendientBatchesNumber(stateId);

        List<String> errorMessages = new ArrayList<>();
        for (Integer mecBatchNumber : mecBatchNumbers) {
            Integer certificateTypeId = certificateQueries.findCertificateTypeIdFromBatchNumber(mecBatchNumber);

            ConsultaCertificadosIEMSResponse queryResponse = client.batchStatusQuery(mecBatchNumber);
            if (queryResponse.getExcelBase64() == null) {
                errorMessages.add(queryResponse.getMensaje());
                continue;
            }

            List<CustomFile> excelFiles = FileFunctions.decompressZip(queryResponse.getExcelBase64());
            for (CustomFile excelFile : excelFiles) {
                List<ExcelRowMec> excelRows = MecFunctions.getResultsFromExcelFile(excelFile.getBytes());
                updateCertificatesResult(excelRows, adminId);
                saveExcel(excelFile, certificateTypeId, mecBatchNumber, stateId);
            }

            DescargaCertificadosIEMSResponse downloadResponse = client.downloadBatch(mecBatchNumber);
            if (downloadResponse.getCertificadosBase64() == null) {
                errorMessages.add("Lote " + mecBatchNumber + " ha tenido algun archivo con errores.");
                continue;
            }
            List<CustomFile> xmlStamp = FileFunctions.decompressZip(downloadResponse.getCertificadosBase64());
            saveDownloadXmls(certificateTypeId, stateId, xmlStamp, mecBatchNumber);
            List<Certificate> certificates = new ArrayList<>();
            for (CustomFile file : xmlStamp) {
                Certificate certificate = updateFolioSep(file.getBytes(), certificateTypeId);
                certificates.add(certificate);
            }
            certificateQueries.saveAllCertificates(certificates);
        }
        if (errorMessages.size() != 0) {
            return String.join(",", errorMessages);
        }
        return "Alumnos sincronizados correctamente, puede descargar los certificados.";
    }

    private Certificate updateFolioSep(byte[] xmlBytes, Integer certificateTypeId) {
        CertificateFolio certificateFolio;
        if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING)) {
            certificateFolio = EndingCertificateFunctions.getFolioFromXmlBytes(xmlBytes);
        } else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ABROGATED)) {
            certificateFolio = AbrogatedCertificateFunctions.getFolioFromXmlBytes(xmlBytes);
        }
        else {
            certificateFolio = PartialCertificateFunctions.getFolioFromXmlBytes(xmlBytes);
        }
        Certificate certificate = certificateQueries.findCertifiedByUsername(certificateFolio.getCurp());
        certificate.setFolio(certificateFolio.getFolio());
        certificate.setDateSep(certificateFolio.getFecha());
        return certificate;
    }

    private void saveExcel(CustomFile excelFile, Integer certificateTypeId, Integer mecBatchNumber, Integer stateId) {
        String mainFolder = "";
        if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING))
            mainFolder = propertiesService.getEndingCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ABROGATED))
            mainFolder = propertiesService.getAbrogatedCertificateDirectory();
        else if (certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_PARTIAL))
            mainFolder = propertiesService.getPartialCertificateDirectory();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        Path path = Paths.get(mainFolder, stateFolder, mecBatchNumber.toString());

        FileFunctions.saveFile(path, excelFile);

    }

    public CustomFile downloadMultiplePdf(List<String> curps, Integer adminId) {
        if (curps.size() > 150) throw new AppException(Messages.pdfdownload_high);
        User userAdmin = userQueries.getUserById(adminId);
        List<Certificate> certificates = certificateQueries.findByUsernameListAndStatus(curps, CertificateStatus.certified);
        List<CustomFile> zipContent = new ArrayList<>();
        for (Certificate certificate : certificates) {
            String filename = certificate.getStudent().getUser().getUsername();

            byte[] xmlBytes = getXmlBytes(certificate);
            byte[] pdfBytes = getPdfBytes(certificate, xmlBytes);

            CustomFile xmlFile = new CustomFile(xmlBytes, filename, CustomFileExtension.XML);
            CustomFile pdfFile = new CustomFile(pdfBytes, filename, CustomFileExtension.PDF);

            zipContent.add(xmlFile);
            zipContent.add(pdfFile);
        }

        return FileFunctions.compressFiles(zipContent, "Certificados");
    }

    private byte[] getXmlBytes(Certificate certificate) {
        Path xmlPath = getXmlPath(certificate.getCertificateTypeId(), certificate);
        return FileFunctions.getFileFromPath(xmlPath);
    }

    public void cancelCertificate(String curp, Integer certificateType, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        MecCredentials mecCredentials = userQueries.getMecCredentialsFromAdmin(userAdmin);
        CertificateClient client = new CertificateClient(mecCredentials, userQueries.isDevAdmin(userAdmin));
        Student student = studentQueries.getStudentByUsername(curp);

        Certificate certificate = certificateQueries.getByStudentAndCertificateTypeIdAndStatus(student, certificateType, CertificateStatus.certified);
        CancelarCertificadosIEMSResponse response = client.cancelFolio(certificate.getFolio());
        if (response.getCodigo() != 0) throw new AppException(response.getMensaje());

        certificate = certificateQueries.cancelCertificate(certificate);
        studentQueries.cancelCertificateStudent(student);
        auditingQueries.saveAudit("CertificateService", "cancelCertificate", adminId, Certificate.class, certificate.getId(), "Canceled certificate.");
    }

    public CertificateStatusValidation getCertificateLimit( String username){
        Student student= studentQueries.getStudentByUsername(username);
        if(certificateQueries.countByUsernameCertificate(student)) {
            Certificate c=certificateQueries.findByCertificateLimit2(student);
            return new CertificateStatusValidation(c);
        }
        else {return new CertificateStatusValidation(0,"");
        }
    }

    public StudentPartialDecData selectDataStudent(String curps, Integer adminId) {
        Student student = studentQueries.getStudentByUsername(curps);
        StudentPartialDecData datastudent = certificateQueries.getStudentPartialDecData(student.getId());
        return datastudent;
    }

    public MecCredentials mecCredentials(Integer adminId){
        User userAdmin = userQueries.getUserById(adminId);
        MecCredentials mecCredentials = userQueries.getMecCredentialsFromAdmin(userAdmin);
        return mecCredentials;
    }

    public CancelStampExternal cancelExternalStamps(Integer adminId, CancelStampExternal cancelStamp) {
        MecCredentials mecCredentials = userQueries.getMecCredentialsFromState(cancelStamp.getStateId());
        boolean isProductive = true;
        if (cancelStamp.isStateServer() == true) isProductive = false;
        else if (cancelStamp.isStateServer() == false) isProductive = true;
        CertificateClient client = new CertificateClient(mecCredentials, isProductive);

        CancelarCertificadosIEMSResponse response = client.cancelFolio(cancelStamp.getFolio());
        //certificateQueries.certificateCancelExternal(cancelStamp, response.getCodigo(), response.getMensaje());
        if (response.getCodigo() != 0) throw new AppException(response.getMensaje());
        certificateQueries.certificateCancelExternal(cancelStamp, response.getCodigo(), response.getMensaje());
        return cancelStamp;
    }
}
