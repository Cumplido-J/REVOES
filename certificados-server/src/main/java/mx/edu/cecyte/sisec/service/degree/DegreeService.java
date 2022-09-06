package mx.edu.cecyte.sisec.service.degree;

import mx.edu.cecyte.sisec.business.CryptographyFunctions;
import mx.edu.cecyte.sisec.business.FileFunctions;
import mx.edu.cecyte.sisec.business.MetFunctions;
import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.business.degree.DegreeFunctions;
import mx.edu.cecyte.sisec.business.degree.DegreeSigner;
import mx.edu.cecyte.sisec.business.pdfgenerator.degree.DegreePdfData;
import mx.edu.cecyte.sisec.business.pdfgenerator.degree.DegreePdfService;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.degree.*;
import mx.edu.cecyte.sisec.dto.degree.*;
import mx.edu.cecyte.sisec.model.catalogs.degree.*;
import mx.edu.cecyte.sisec.model.met.Degree;
import mx.edu.cecyte.sisec.model.met.DegreeData;
import mx.edu.cecyte.sisec.model.met.DegreeStatus;
import mx.edu.cecyte.sisec.model.met.MetCredentials;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.CatalogQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.queries.degree.DegreeQueries;
import mx.edu.cecyte.sisec.shared.*;
import mx.edu.cecyte.sisec.webservice.DegreeClient;
import mx.edu.cecyte.titulows.CancelaTituloElectronicoResponse;
import mx.edu.cecyte.titulows.CargaTituloElectronicoResponse;
import mx.edu.cecyte.titulows.ConsultaProcesoTituloElectronicoResponse;
import mx.edu.cecyte.titulows.DescargaTituloElectronicoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DegreeService {
    @Autowired private UserQueries userQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private DegreeQueries degreeQueries;
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private PropertiesService propertiesService;
    @Autowired private DegreePdfService degreePdfService;
    @Autowired private CatalogQueries catalogQueries;

    public void validateStudents(List<String> curps, Integer adminId) {
        System.out.println("VALIDAR ALUMNO: "+curps);
        List<Student> students = studentQueries.getListStudentByUsernames(curps);
        List<Degree> degrees = degreeQueries.validateStudents(students);
        List<Integer> degreesId = degrees.stream().map(Degree::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("DegreeService", "validateStudents", adminId, Degree.class, degreesId, "Validated student");
    }

    public void setDegreesInProcess(List<Degree> degrees, Integer mecBatchNumber, Integer adminId, MetCredentials metCredentials) {
        degrees.forEach(degree -> degree.setInProcess(mecBatchNumber, metCredentials));
        degrees = degreeQueries.saveAllDegrees(degrees);

        List<Integer> degreesId = degrees.stream().map(Degree::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("DegreeService", "setDegreesInProcess", adminId, Degree.class, degreesId, "Change status to in process of degree.");
    }

    public void updateDegreesResult(List<ExcelRowDegree> excelRows, Integer adminId) {
        String timeStamp = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(Calendar.getInstance().getTime());
        List<Degree> degrees = new ArrayList<>();
        for (ExcelRowDegree excelRow : excelRows) {
            System.out.println("+STATUS: "+excelRow.getStatus());
            System.out.println("+MENSAJE: "+excelRow.getMessage());
            System.out.println("+FILE NAME: "+excelRow.getFileName());
            System.out.println("+class: "+excelRow.getClass());

            Degree degree = degreeQueries.findInProcessByFileName(excelRow.getFileName());
            System.out.println("{...}: "+degree.getStatus());
            degree.updateExcelResult(excelRow);
            degree.setDateSep(timeStamp);
            degrees.add(degree);
        }
        degrees = degreeQueries.saveAllDegrees(degrees);

        List<Integer> degreesId = degrees.stream().map(Degree::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("DegreeService", "updateDegreesResult", adminId, Degree.class, degreesId, "Changed degree status from excel result.");
    }

    //**Consulta Carga de Lista para Validar
    public DegreeValidationStudentDto studentSearch(DegreeSearchFilter filter, Integer adminId, Integer searchType) {
        User userAdmin = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIdsByAdminUser = userQueries.getAvailableSchoolIdsByAdminUserV2(filter.getStateId(),userAdmin, AppCatalogs.isState);
        List<DegreeValidationStudent> student = degreeQueries.searchDegreeStudents(filter, availableSchoolIdsByAdminUser, searchType);
        return new DegreeValidationStudentDto(student);
    }

    public DegreeQueryStudentDto studentQuerySearch(DegreeSearchFilter filter, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIdsByAdminUser = userQueries.getAvailableSchoolIdsByAdminUserV2(filter.getStateId(),userAdmin, AppCatalogs.isState);
        List<DegreeQueryStudent> students = degreeQueries.studentQuerySearch(filter, availableSchoolIdsByAdminUser);
        return new DegreeQueryStudentDto(students);
    }

    public void degreeStudents(DegreeCurpsFiel fiel, Integer adminId) {
        CryptographyFunctions.signWithKey(fiel.getFielBytes(), "Test String");
        System.out.println("TITULAR ALUMNO: ***");
        List<Degree> degrees = degreeQueries.findByUsernameListAndStatus(fiel.getCurps(), DegreeStatus.validated);
        degrees.forEach(r->{
            System.out.println("Status: "+r.getStatus());
            System.out.println("Name: "+r.getStudent().getId());
        });
        User userAdmin = userQueries.getUserById(adminId);
        System.out.println("admin: "+userAdmin.getUsername());
        MetCredentials metCredentials = userQueries.getMetCredentialsFromAdmin(userAdmin);
        System.out.println("State: "+metCredentials.getState().getId());
        Integer stateId = metCredentials.getState().getId();
        System.out.println("State: "+stateId);
        System.out.println("FIELD:  "+fiel.getFielBytes());
        System.out.println("FIELD:  "+fiel.getFiel());
        DegreeSigner degreeSigner = degreeQueries.getDegreeSignerData( metCredentials, userAdmin, fiel.getFielBytes());
        System.out.println("degreeSigner: "+degreeSigner.getCurp());
        List<CustomFile> xmlsToSend = getXmlsToSend(degrees,  degreeSigner, userQueries.isDevAdmin(userAdmin));
        CargaTituloElectronicoResponse uploadResponse = uploadXmls(userAdmin, metCredentials, degreeSigner, xmlsToSend);
        if (uploadResponse.getNumeroLote() == null) {
            if (!StringUtils.isEmpty(uploadResponse.getMensaje())) throw new AppException(uploadResponse.getMensaje());
            throw new AppException(Messages.mec_noServerConnection);
        }
        saveUploadXmls(stateId, xmlsToSend, uploadResponse.getNumeroLote().intValue());
        setDegreesInProcess(degrees, uploadResponse.getNumeroLote().intValue(), adminId, metCredentials);
    }

    private CargaTituloElectronicoResponse uploadXmls(User userAdmin, MetCredentials metCredentials, DegreeSigner degreeSigner, List<CustomFile> xmlsToSend) {
        System.out.println("SUBIDA DE XML: ***");
        boolean validate = Boolean.parseBoolean(null);
        boolean dev = userQueries.isDevAdmin(userAdmin);
        if (metCredentials.getValidated().equals("1") && dev != true) validate = false;
        else validate = true;
        CustomFile zipToSend = FileFunctions.compressFiles(xmlsToSend, degreeSigner.getCurp());
        DegreeClient client = new DegreeClient(metCredentials, validate);
        return client.uploadRequest(zipToSend);
    }

    private List<CustomFile> getXmlsToSend(List<Degree> degrees, DegreeSigner degreeSigner, boolean isDev) {
        List<CustomFile> xmlsToSend = new ArrayList<>();
        for (Degree degree : degrees) {
            CustomFile xmlFile;
            StudentDegreeData degreeData = degreeQueries.getStudentDegreeData(degree.getStudent().getId());
            xmlFile = DegreeFunctions.generateXmlFile(degreeData, degreeSigner);
            degree.setFileName(xmlFile.getFileNameWithExtension());
            xmlsToSend.add(xmlFile);
        }
        return xmlsToSend;
    }

    private void saveUploadXmls(Integer stateId, List<CustomFile> xmlsToSend, Integer mecBatchNumber) {
        System.out.println("GUARDAR ARCHIVO ENVIADO: **** /Titulo/*ESTADO*/*LOTE*/Carga/*ARCHIVO*");
        String mainFolder = propertiesService.getDegreeDirectory();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        Path uploadPath = Paths.get(mainFolder, stateFolder, mecBatchNumber.toString(), "Carga");
        xmlsToSend.forEach(xmlFile -> FileFunctions.saveFile(uploadPath, xmlFile));
    }

    private void saveDownloadXmls(Integer stateId, List<CustomFile> xmlsReceived, Integer mecBatchNumber) {
        String mainFolder = propertiesService.getDegreeDirectory();
        System.out.println("MAIN FOLDER: "+mainFolder);
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        System.out.println("STATE FOLDER: "+stateFolder);
        Path uploadPath = Paths.get(mainFolder, stateFolder, mecBatchNumber.toString(), "Descarga");
        System.out.println("UPLOAD: "+uploadPath.getFileName());
        System.out.println("FILE XML"+xmlsReceived);

        xmlsReceived.forEach(xmlFile -> FileFunctions.saveFile(uploadPath, xmlFile));
    }

    public CustomFile downloadXml(String folioNumber, Integer adminId) {
        System.out.println("DESCARGA DE ARCHIVO: ****");
        Degree degree = degreeQueries.findByFolioNumber(folioNumber);
        String filename = degree.getStudent().getUser().getUsername();

        byte[] xmlBytes = getXmlBytes(degree);
        return new CustomFile(xmlBytes, filename, CustomFileExtension.XML);
    }

    public CustomFile downloadPdf(String folioNumber, Integer adminId) {
        System.out.println("DESCARGA PDF: ****");
        Degree degree = degreeQueries.findByFolioNumber(folioNumber);
        String filename = degree.getStudent().getUser().getUsername();
        byte[] xmlBytes = getXmlBytes(degree);
        byte[] pdfBytes = getPdfBytes(degree, xmlBytes);
        return new CustomFile(pdfBytes, filename, CustomFileExtension.PDF);
    }

    private byte[] getPdfBytes(Degree degree, byte[] xmlBytes) {
        byte[] pdfBytes = null;
        DegreeComplementDoc complementDoc = degreeQueries.selectComplement(degree.getStudent().getId());//getComplementData(degree.getStudent().getId());
        DegreePdfData pdfData = DegreeFunctions.generatePdfData(xmlBytes, complementDoc);
        pdfBytes = degreePdfService.generatePdf(pdfData);
        return pdfBytes;
    }

    private Path getXmlPath(Degree degree) {
        String mainFolder = propertiesService.getDegreeDirectory();
        Integer stateId = degree.getStudent().getSchoolCareer().getSchool().getCity().getState().getId();
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        /*Opcion a evaluar*/
        return Paths.get(mainFolder, stateFolder, degree.getBatchNumber().toString(), "Carga", degree.getFileName());
    }

    public boolean getPendientBatches(Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Integer stateId;
        /*if (userAdmin.getCertificationAdmin() != null) stateId = userAdmin.getCertificationAdmin().getState().getId();
        else stateId = userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);*/

        stateId = userAdmin.getAdminUserScope()!= null ? catalogQueries.getStateId(userAdmin) : userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);

        return degreeQueries.getPendientBatches(stateId);
    }

    public String sincronizeBatches(Integer adminId) {
        System.out.println("SINCRINIZACION DE BATCH: ****");
        User userAdmin = userQueries.getUserById(adminId);
        Integer stateId;
        /*if (userAdmin.getDegreeAdmim() != null) stateId = userAdmin.getDegreeAdmim().getState().getId();
        else stateId = userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);*/

        stateId = userAdmin.getAdminUserScope() != null ? catalogQueries.getStateId(userAdmin) : userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);

        MetCredentials metCredentials = userQueries.getMetCredentialsFromState(stateId);
        boolean validate = Boolean.parseBoolean(null);
        boolean dev = userQueries.isDevAdmin(userAdmin);
        if (metCredentials.getValidated().equals("1") && dev != true) validate = false;
        else validate = true;
        DegreeClient client = new DegreeClient(metCredentials, validate);

        Set<Integer> batchNumbers = degreeQueries.getPendientBatchesNumber(stateId);
        System.out.println("NUMEROS DE BATCH : "+batchNumbers);
        List<String> errorMessages = new ArrayList<>();
        for (Integer batchNumber : batchNumbers) {
            System.out.println("NUMERO DE BATCH: "+batchNumber);

            System.out.println("--------CONSULTA DE BATCH---------");
            ConsultaProcesoTituloElectronicoResponse queryResponse = client.batchStatusQuery(batchNumber);
            System.out.println("MENSSAJE: "+queryResponse.getMensaje());
            System.out.println("ESTATUS LOTE: "+queryResponse.getEstatusLote());
            System.out.println("NUMERO DE LOTE: "+queryResponse.getNumeroLote());
            if (queryResponse.getEstatusLote() == 0) {
                errorMessages.add(queryResponse.getMensaje());
                continue;
            }

            DescargaTituloElectronicoResponse downloadResponse = client.downloadBatch(batchNumber);
            System.out.println("--------DESCARGA DE BATCH---------");
            System.out.println("MENSAJE: "+downloadResponse.getMensaje());
            System.out.println("BASE 64: "+downloadResponse.getTitulosBase64());
            System.out.println("NUMERO DE LOTE: "+downloadResponse.getNumeroLote());
            if (downloadResponse.getTitulosBase64() == null) {
                errorMessages.add("Lote " + batchNumber + " ha tenido algun archivo con errores.");
                continue;
            }

            List<CustomFile> excelFiles = FileFunctions.decompressZip(downloadResponse.getTitulosBase64());
            System.out.println("FILE:- "+excelFiles.toString());
            excelFiles.forEach(r->{
                System.out.println("FILE NAME: "+r.getFileName());
                System.out.println("FILE NAME WRITE: "+r.getFileNameWithExtension());
                System.out.println("FILE NAME EXTENDS: "+r.getCustomFileExtension());
                System.out.println("BASE: ");

            });
            //saveDownloadXmls(stateId, excelFiles, batchNumber );
            for (CustomFile excelFile : excelFiles) {
                List<ExcelRowDegree> excelRows = MetFunctions.getResultsFromExcelFile(excelFile.getBytes());
                excelRows.forEach(r->{
                    System.out.println("MESSAGE: "+r.getMessage());
                    System.out.println("FILE NAME: "+r.getFileName());
                    System.out.println("STATUS: "+r.getStatus());
                    System.out.println("FOLIO: "+r.getFolio());
                });
                updateDegreesResult(excelRows, adminId);
                saveExcel(excelFile, batchNumber, stateId);
            }
        }
        if (errorMessages.size() != 0) {
            return String.join(",", errorMessages);
        }
        return "Alumnos sincronizados correctamente, puede descargar los titulos.";
    }

    private void saveExcel(CustomFile excelFile, Integer mecBatchNumber, Integer stateId) {
        System.out.println(": Custo File: "+excelFile.getFileName());
        System.out.println(": Custo File: "+excelFile.getFileNameWithExtension());
        System.out.println(": mecBatchNumber: "+mecBatchNumber);
        System.out.println(": stateId: "+stateId);
        String mainFolder = propertiesService.getDegreeDirectory();
        System.out.println("mainFolder: " + mainFolder);
        String stateFolder = AppFunctions.stateIdToFolderName(stateId);
        System.out.println("sateFolde: "+stateFolder);
        Path path = Paths.get(mainFolder, stateFolder, mecBatchNumber.toString());
        System.out.println("Path: "+path);
        FileFunctions.saveFile(path, excelFile);

    }

    public CustomFile downloadMultiplePdf(List<String> curps, Integer adminId) {
        if (curps.size() > 150) throw new AppException(Messages.pdfdownload_high);
        User userAdmin = userQueries.getUserById(adminId);
        List<Degree> degrees = degreeQueries.findByUsernameListAndStatus(curps, DegreeStatus.degreed);
        List<CustomFile> zipContent = new ArrayList<>();
        for (Degree degree : degrees) {
            String filename = degree.getStudent().getUser().getUsername();

            byte[] xmlBytes = getXmlBytes(degree);
            byte[] pdfBytes = getPdfBytes(degree, xmlBytes);

            CustomFile xmlFile = new CustomFile(xmlBytes, filename, CustomFileExtension.XML);
            CustomFile pdfFile = new CustomFile(pdfBytes, filename, CustomFileExtension.PDF);

            zipContent.add(xmlFile);
            zipContent.add(pdfFile);
        }

        return FileFunctions.compressFiles(zipContent, "Titulos");
    }

    private byte[] getXmlBytes(Degree degree) {
        Path xmlPath = getXmlPath(degree);
        return FileFunctions.getFileFromPath(xmlPath);
    }

    public void cancelDegree(String curp, String cancelationReason, Integer adminId) {
        System.out.println("CANCELACION DE TITULO: ***");
        User userAdmin = userQueries.getUserById(adminId);
        MetCredentials metCredentials = userQueries.getMetCredentialsFromAdmin(userAdmin);
        boolean validate = Boolean.parseBoolean(null);
        boolean dev = userQueries.isDevAdmin(userAdmin);
        if (metCredentials.getValidated().equals("1") && dev != true) validate = false;
        else validate = true;
        DegreeClient client = new DegreeClient(metCredentials, validate);
        Student student = studentQueries.getStudentByUsername(curp);
        Degree degree = degreeQueries.getByStudentAndAndStatus(student, DegreeStatus.degreed);
        CancelaTituloElectronicoResponse response = client.cancelFolio(degree.getFolio(), cancelationReason);
        if (response.getCodigo() != 0) throw new AppException(response.getMensaje());
        degree = degreeQueries.cancelDegree(degree);
        auditingQueries.saveAudit("DegreeService", "cancelDegree", adminId, Degree.class, degree.getId(), "Canceled degree.");
    }


    public DegreeDataAntecedents antecedentsData(String curp, DegreeDataAntecedents data, Integer adminId) {
        Student student = studentQueries.getStudentByUsername(curp);
        CatDegreeState state = degreeQueries.getDegreeEntity(data.getCarrerId());
        DegreeData degreeData = new DegreeData();
        if (degreeQueries.existeStudent(student.getId()) == 0){
            data.setStudentId(student.getId());
            data.setFederalEntityId(state.getId());
            data.setFederalEntityName(state.getName());
            degreeData = degreeQueries.antecedentsDataSaveAll(data);
        } else {
            throw new AppException(Messages.database_cantFindResource);
        }
        return data;
    }

    public List<StudentDegreeStructure> getDegreeView(String curp) {

        Student student = studentQueries.getStudentByUsername(curp);
        //StudentDegreeStructure structure = degreeQueries.getDegreeView(student);
        return degreeQueries.getDegreeView(student);
    }

    public DegreeEditStudent getStudentModules(String curp, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);

        boolean isStudentAvailableForAdmin = userQueries.isStudentAvailableForAdmin(userAdmin, student);
        if (!isStudentAvailableForAdmin) throw new AppException(Messages.student_noEditPermissions);
        return degreeQueries.getStudentModules(student);
    }
    //**Update Student for Degree
    public void editStudentModules(String studentCurp, DegreeDataAntecedents data, Integer adminId) {
        Student student = studentQueries.getStudentByUsername(studentCurp);
        CatDegreeState state = degreeQueries.getDegreeEntity(data.getCarrerId());
        DegreeData id = degreeQueries.getDegreDataId(student);

        if (degreeQueries.existeStudent(student.getId()) != 0 && id.getId() != 0){
            data.setStudentId(student.getId());
            data.setFederalEntityName(state.getName());
            degreeQueries.updateStudentModules(data, id);
        }

    }

    public DegreeSearchData searchFolioDegree(String folio) {
        DegreeSearchData data = null;
        if (degreeQueries.isExistFolio(folio)) data = degreeQueries.searchFolioDegree(folio);
        return data;
    }

    public CancelStampExternal cancelExternalStamps(Integer adminId, CancelStampExternal cancelStampExternal) {
        MetCredentials metCredentials = userQueries.getMetCredentialsFromState(cancelStampExternal.getStateId());
        boolean isProductive = true;
        if (cancelStampExternal.isStateServer() == true) isProductive = false;
        else if (cancelStampExternal.isStateServer() == false) isProductive = true;
        DegreeClient client = null;
        if (cancelStampExternal.getFolio() != null && cancelStampExternal.getMotivo() != null) client = new DegreeClient(metCredentials, isProductive);
        CancelaTituloElectronicoResponse response = client.cancelFolio(cancelStampExternal.getFolio(), cancelStampExternal.getMotivo());
        //degreeQueries.degreeCancelExternal(cancelStampExternal, response.getCodigo(), response.getMensaje());
        if (response.getCodigo() != 0) throw new AppException(response.getMensaje());
        degreeQueries.degreeCancelExternal(cancelStampExternal, response.getCodigo(), response.getMensaje());
        return cancelStampExternal;
    }
}
