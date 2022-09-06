package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.certificate.CertificateSearchFilter;
import mx.edu.cecyte.sisec.classes.certificate.StudentPartialDecData;
import mx.edu.cecyte.sisec.devfunctions.DevEndingCertificateService;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurps;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurpsFiel;
import mx.edu.cecyte.sisec.dto.certificate.CertificateEditStudent;
import mx.edu.cecyte.sisec.dto.certificate.CertificateStatusValidation;
import mx.edu.cecyte.sisec.log.CertificateLogger;
import mx.edu.cecyte.sisec.service.CertificateService;
import mx.edu.cecyte.sisec.service.StudentService;
import mx.edu.cecyte.sisec.shared.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/certificate")
@Log4j
public class CertificateController {

    @Autowired private CertificateService certificateService;
    @Autowired private StudentService studentService;
    @Autowired private DevEndingCertificateService devEndingCertificateService;

    @GetMapping("/validate/search")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentValidationSearch(@LoggedUser UserSession userSession,
                                                     @RequestParam(defaultValue = "0") Integer stateId,
                                                     @RequestParam(defaultValue = "0") Integer schoolId,
                                                     @RequestParam(defaultValue = "0") Integer careerId,
                                                     @RequestParam(defaultValue = "") String generation,
                                                     @RequestParam(defaultValue = "") String searchText,
                                                     @RequestParam(defaultValue = "0") Integer certificateTypeId) {
        CertificateSearchFilter filter = new CertificateSearchFilter(stateId, schoolId, careerId, generation, searchText, certificateTypeId);
        try {
            Map<String, Object> students = certificateService.studentSearch(filter, userSession.getId(), AppCatalogs.CERTIFICATESEARCH_VALIDATE);
            return CustomResponseEntity.OK(students);
        } catch (AppException exception) {
            CertificateLogger.studentValidationSearch(log, exception.getMessage(), userSession, filter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.studentValidationSearch(log, exception.toString(), userSession, filter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/validateStudents")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> validateStudents(@LoggedUser UserSession userSession,
                                              @RequestBody CertificateCurps certificateCurps) {
        try {
            certificateService.validateStudents(certificateCurps.getCurps(), certificateCurps.getCertificateTypeId(), userSession.getId());
            return CustomResponseEntity.OK("Todos los alumnos han sido validados");
        } catch (AppException exception) {
            CertificateLogger.validateStudents(log, exception.getMessage(), userSession, certificateCurps);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.validateStudents(log, exception.toString(), userSession, certificateCurps);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/reprobateStudent/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> reprobateStudent(@LoggedUser UserSession userSession,
                                              @PathVariable String curp) {
        try {
            studentService.reprobateStudent(curp, userSession.getId());
            return CustomResponseEntity.OK("El alumno ha sido cambiado");
        } catch (AppException exception) {
            CertificateLogger.reprobateStudent(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.reprobateStudent(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/editStudentModules")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> editStudentModules(@LoggedUser UserSession userSession,
                                         @RequestBody CertificateEditStudent certificateEditStudent) {
        try {
            certificateService.editStudentModules(certificateEditStudent, userSession.getId());
            return CustomResponseEntity.OK("Los datos del alumno han sido cambiados");
        } catch (AppException exception) {
            CertificateLogger.editStudent(log, exception.getMessage(), userSession, certificateEditStudent);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.editStudent(log, exception.toString(), userSession, certificateEditStudent);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getStudentModules/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION','ROLE_SEGUIMIENTO')")
    public ResponseEntity<?> getStudentModules(@LoggedUser UserSession userSession,
                                               @PathVariable String curp) {
        try {
            CertificateEditStudent studentData = certificateService.getStudentModules(curp, userSession.getId());
            return CustomResponseEntity.OK(studentData);
        } catch (AppException exception) {
            CertificateLogger.getStudentModules(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.getStudentModules(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/certificate/search")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentCertificateSearch(@LoggedUser UserSession userSession,
                                                      @RequestParam(defaultValue = "0") Integer stateId,
                                                      @RequestParam(defaultValue = "0") Integer schoolId,
                                                      @RequestParam(defaultValue = "0") Integer careerId,
                                                      @RequestParam(defaultValue = "") String generation,
                                                      @RequestParam(defaultValue = "") String searchText,
                                                      @RequestParam(defaultValue = "0") Integer certificateTypeId) {
        CertificateSearchFilter filter = new CertificateSearchFilter(stateId, schoolId, careerId, generation, searchText, certificateTypeId);
        try {
            Map<String, Object> students = certificateService.studentSearch(filter, userSession.getId(), AppCatalogs.CERTIFICATESEARCH_UPLOAD);
            return CustomResponseEntity.OK(students);
        } catch (AppException exception) {
            CertificateLogger.studentCertificateSearch(log, exception.getMessage(), userSession, filter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.studentCertificateSearch(log, exception.toString(), userSession, filter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/query/search")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentQuerySearch(@LoggedUser UserSession userSession,
                                                @RequestParam(defaultValue = "0") Integer stateId,
                                                @RequestParam(defaultValue = "0") Integer schoolId,
                                                @RequestParam(defaultValue = "0") Integer careerId,
                                                @RequestParam(defaultValue = "") String generation,
                                                @RequestParam(defaultValue = "") String searchText,
                                                @RequestParam(defaultValue = "0") Integer certificateTypeId) {
        CertificateSearchFilter filter = new CertificateSearchFilter(stateId, schoolId, careerId, generation, searchText, certificateTypeId);
        try {
            Map<String, Object> students = certificateService.studentQuerySearch(filter, userSession.getId());
            return CustomResponseEntity.OK(students);
        } catch (AppException exception) {
            CertificateLogger.studentCertificateSearch(log, exception.getMessage(), userSession, filter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.studentCertificateSearch(log, exception.toString(), userSession, filter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/certificateStudents")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> certificateStudents(@LoggedUser UserSession userSession,
                                                 @RequestBody CertificateCurpsFiel certificateCurpsFiel) {
        try {
            certificateService.certificateStudents(certificateCurpsFiel, userSession.getId());
            devEndingCertificateService.GenerateDocument(certificateCurpsFiel, userSession.getUsername() );
            return CustomResponseEntity.OK("Los alumnos han sido cargados. Ir a la pantalla de consulta para descargar el certificado.");
        } catch (AppException exception) {
            CertificateLogger.certificateStudents(log, exception.getMessage(), userSession, certificateCurpsFiel);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.certificateStudents(log, exception.toString(), userSession, certificateCurpsFiel);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/downloadPdf")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> downloadPdf(@LoggedUser UserSession userSession,
                                         @RequestParam(defaultValue = "") String folioNumber) {
        try {
            CustomFile file = certificateService.downloadPdf(folioNumber, userSession.getId());
            return CustomResponseEntity.OK(file);
        } catch (AppException exception) {
            CertificateLogger.downloadPdf(log, exception.getMessage(), userSession, folioNumber);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.downloadPdf(log, exception.toString(), userSession, folioNumber);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/downloadMultiplePdf")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> downloadMultiplePdf(@LoggedUser UserSession userSession,
                                                 @RequestBody CertificateCurps certificateCurps) {
        try {
            CustomFile file = certificateService.downloadMultiplePdf(certificateCurps.getCurps(), userSession.getId());
            return CustomResponseEntity.OK(file);
        } catch (AppException exception) {
            CertificateLogger.downloadMultiplePdf(log, exception.getMessage(), userSession, certificateCurps);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.downloadMultiplePdf(log, exception.toString(), userSession, certificateCurps);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/cancelCertificate")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> cancelCertificate(@LoggedUser UserSession userSession,
                                               @RequestParam(defaultValue = "") String curp,
                                               @RequestParam(defaultValue = "0") Integer certificateType) {
        try {
            certificateService.cancelCertificate(curp, certificateType, userSession.getId());
            return CustomResponseEntity.OK("El certificado ha sido cancelado exitosamente.");
        } catch (AppException exception) {
            CertificateLogger.cancelCertificate(log, exception.getMessage(), userSession, curp, certificateType);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.cancelCertificate(log, exception.toString(), userSession, curp, certificateType);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/downloadXml")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> downloadXml(@LoggedUser UserSession userSession,
                                         @RequestParam(defaultValue = "") String folioNumber) {
        try {
            CustomFile file = certificateService.downloadXml(folioNumber, userSession.getId());
            return CustomResponseEntity.OK(file);
        } catch (AppException exception) {
            CertificateLogger.downloadXml(log, exception.getMessage(), userSession, folioNumber);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.downloadXml(log, exception.toString(), userSession, folioNumber);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getPendientBatches")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getPendientBatches(@LoggedUser UserSession userSession) {
        try {
            boolean pendientBatches = certificateService.getPendientBatches(userSession.getId());
            return CustomResponseEntity.OK(pendientBatches);
        } catch (AppException exception) {
            CertificateLogger.getPendientBatches(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.getPendientBatches(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/sincronizeBatches")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> sincronizeBatches(@LoggedUser UserSession userSession) {
        try {
            String message = certificateService.sincronizeBatches(userSession.getId(), false);
            return CustomResponseEntity.OK(message);
        } catch (AppException exception) {
            CertificateLogger.sincronizeBatches(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.sincronizeBatches(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getCertificateLimit/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCertificateLimit(@LoggedUser UserSession userSession,
                                                   @PathVariable String curp) {
        try {
            CertificateStatusValidation statusValidation =certificateService.getCertificateLimit(curp);
            return CustomResponseEntity.OK(statusValidation);
        } catch (AppException exception) {
            CertificateLogger.statusValidation(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.statusValidation(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/selectDataStudent/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> selectDataStudent(@LoggedUser UserSession userSession,
                                               @PathVariable String curp) {
        try {
            StudentPartialDecData data = certificateService.selectDataStudent(curp, userSession.getId());
            return CustomResponseEntity.OK(data);
        } catch (AppException exception) {
            CertificateLogger.selectDataStudent(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CertificateLogger.selectDataStudent(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
