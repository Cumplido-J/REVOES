package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.classes.degree.DegreeQueryStudentDto;
import mx.edu.cecyte.sisec.classes.degree.DegreeSearchFilter;
import mx.edu.cecyte.sisec.classes.degree.DegreeValidationStudentDto;
import mx.edu.cecyte.sisec.dto.degree.*;
import mx.edu.cecyte.sisec.log.DegreeLogger;
import mx.edu.cecyte.sisec.service.CertificadoService;
import mx.edu.cecyte.sisec.service.CertificateService;
import mx.edu.cecyte.sisec.service.StudentService;
import mx.edu.cecyte.sisec.service.degree.DegreeService;
import mx.edu.cecyte.sisec.shared.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/degree")
@Log4j
public class DegreeController {
    @Autowired
    private DegreeService degreeService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private CertificateService certificateService;

    @GetMapping("/validate/search")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> studentValidationSearch(@LoggedUser UserSession userSession,
                                                     @RequestParam(defaultValue = "0") Integer stateId,
                                                     @RequestParam(defaultValue = "0") Integer schoolId,
                                                     @RequestParam(defaultValue = "0") Integer careerId,
                                                     @RequestParam(defaultValue = "") String generation,
                                                     @RequestParam(defaultValue = "") String searchText) {
        DegreeSearchFilter filter = new DegreeSearchFilter(stateId, schoolId, careerId, generation, searchText);
        try {

            DegreeValidationStudentDto students = degreeService.studentSearch(filter, userSession.getId(), AppCatalogs.DEGREESEARCH_VALIDATE);
            return CustomResponseEntity.OK(students);
        } catch (AppException exception) {
            DegreeLogger.studentValidationSearch(log, exception.getMessage(), userSession, filter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.studentValidationSearch(log, exception.toString(), userSession, filter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/validateStudents")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> validateStudents(@LoggedUser UserSession userSession,
                                              @RequestBody DegreeCurps degreeCurps) {
        try {
            degreeService.validateStudents(degreeCurps.getCurps(), userSession.getId());
            return CustomResponseEntity.OK("Todos los alumnos han sido validados");
        } catch (AppException exception) {
            DegreeLogger.validateStudents(log, exception.getMessage(), userSession, degreeCurps);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.validateStudents(log, exception.toString(), userSession, degreeCurps);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/degree/search")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentDegreeSearch(@LoggedUser UserSession userSession,
                                                 @RequestParam(defaultValue = "0") Integer stateId,
                                                 @RequestParam(defaultValue = "0") Integer schoolId,
                                                 @RequestParam(defaultValue = "0") Integer careerId,
                                                 @RequestParam(defaultValue = "") String generation,
                                                 @RequestParam(defaultValue = "") String searchText) {
        DegreeSearchFilter filter = new DegreeSearchFilter(stateId, schoolId, careerId, generation, searchText);
        try {
            DegreeValidationStudentDto students = degreeService.studentSearch(filter, userSession.getId(), AppCatalogs.DEGREESEARCH_UPLOAD);
            return CustomResponseEntity.OK(students);
        } catch (AppException exception) {
            DegreeLogger.studentDegreeSearch(log, exception.getMessage(), userSession, filter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.studentDegreeSearch(log, exception.toString(), userSession, filter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/query/search")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> studentQuerySearch(@LoggedUser UserSession userSession,
                                                @RequestParam(defaultValue = "0") Integer stateId,
                                                @RequestParam(defaultValue = "0") Integer schoolId,
                                                @RequestParam(defaultValue = "0") Integer careerId,
                                                @RequestParam(defaultValue = "") String generation,
                                                @RequestParam(defaultValue = "") String searchText) {
        DegreeSearchFilter filter = new DegreeSearchFilter(stateId, schoolId, careerId, generation, searchText);
        try {
            DegreeQueryStudentDto students = degreeService.studentQuerySearch(filter, userSession.getId());
            return CustomResponseEntity.OK(students);
        } catch (AppException exception) {
            DegreeLogger.studentQuerySearch(log, exception.getMessage(), userSession, filter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.studentQuerySearch(log, exception.toString(), userSession, filter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/degreeStudents")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> degreeStudents(@LoggedUser UserSession userSession,
                                            @RequestBody DegreeCurpsFiel fiel) {
        try {
            degreeService.degreeStudents(fiel, userSession.getId());
            return CustomResponseEntity.OK("Los alumnos han sido cargados. Ir a la pantalla de consulta para descargar el titulo.");
        } catch (AppException exception) {
            DegreeLogger.degreeStudents(log, exception.getMessage(), userSession, fiel);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.degreeStudents(log, exception.toString(), userSession, fiel);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/downloadPdf")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> downloadPdf(@LoggedUser UserSession userSession,
                                         @RequestParam(defaultValue = "") String folioNumber) {
        try {
            CustomFile file = degreeService.downloadPdf(folioNumber, userSession.getId());
            return CustomResponseEntity.OK(file);
        } catch (AppException exception) {
            DegreeLogger.downloadPdf(log, exception.getMessage(), userSession, folioNumber);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.downloadPdf(log, exception.toString(), userSession, folioNumber);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/downloadMultiplePdf")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> downloadMultiplePdf(@LoggedUser UserSession userSession,
                                                 @RequestBody DegreeCurps degreeCurps) {
        try {
            CustomFile file = degreeService.downloadMultiplePdf(degreeCurps.getCurps(), userSession.getId());
            return CustomResponseEntity.OK(file);
        } catch (AppException exception) {
            DegreeLogger.downloadMultiplePdf(log, exception.getMessage(), userSession, degreeCurps);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.downloadMultiplePdf(log, exception.toString(), userSession, degreeCurps);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/cancelDegree")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> cancelDegree(@LoggedUser UserSession userSession,
                                          @RequestParam(defaultValue = "") String curp,
                                          @RequestParam(defaultValue = "") String cancelationReason) {
        try {
            degreeService.cancelDegree(curp, cancelationReason, userSession.getId());
            return CustomResponseEntity.OK("El título ha sido cancelado exitosamente.");
        } catch (AppException exception) {
            DegreeLogger.cancelDegree(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.cancelDegree(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/downloadXml")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> downloadXml(@LoggedUser UserSession userSession,
                                         @RequestParam(defaultValue = "") String folioNumber) {
        try {
            CustomFile file = degreeService.downloadXml(folioNumber, userSession.getId());
            return CustomResponseEntity.OK(file);
        } catch (AppException exception) {
            DegreeLogger.downloadXml(log, exception.getMessage(), userSession, folioNumber);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.downloadXml(log, exception.toString(), userSession, folioNumber);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getPendientBatches")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getPendientBatches(@LoggedUser UserSession userSession) {
        try {
            boolean pendientBatches = degreeService.getPendientBatches(userSession.getId());
            return CustomResponseEntity.OK(pendientBatches);
        } catch (AppException exception) {
            DegreeLogger.getPendientBatches(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.getPendientBatches(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/sincronizeBatches")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> sincronizeBatches(@LoggedUser UserSession userSession) {
        try {
            String message = degreeService.sincronizeBatches(userSession.getId());
            return CustomResponseEntity.OK(message);
        } catch (AppException exception) {
            DegreeLogger.sincronizeBatches(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.sincronizeBatches(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getStudentModules/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getStudentModules(@LoggedUser UserSession userSession,
                                               @PathVariable String curp) {
        try {
            DegreeEditStudent studentData = degreeService.getStudentModules(curp, userSession.getId());
            return CustomResponseEntity.OK(studentData);
        } catch (AppException exception) {
            DegreeLogger.getStudentModules(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.getStudentModules(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/editStudentModules/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> editStudentModules(@LoggedUser UserSession userSession,
                                                @PathVariable String studentCurp,
                                                @RequestBody DegreeDataAntecedents degreeDataAntecedents) {
        try {
            degreeService.editStudentModules(studentCurp, degreeDataAntecedents, userSession.getId());
            return CustomResponseEntity.OK("Los datos del alumno han sido cambiados");
        } catch (AppException exception) {
            DegreeLogger.editStudentModules(log, exception.getMessage(), userSession, degreeDataAntecedents);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.editStudentModules(log, exception.toString(), userSession, degreeDataAntecedents);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/antecedentsDegree/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> antecedentsData(@LoggedUser UserSession userSession,
                                             @PathVariable String studentCurp,
                                             @RequestBody DegreeDataAntecedents degreeDataAntecedents) {
        try {
            degreeDataAntecedents = degreeService.antecedentsData(studentCurp, degreeDataAntecedents, userSession.getId());
            return CustomResponseEntity.OK(degreeDataAntecedents);
        } catch (AppException exception) {
            DegreeLogger.antecedentsData(log, exception.getMessage(), userSession, studentCurp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.antecedentsData(log, exception.toString(), userSession, studentCurp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/degreeView/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> degreeView(@LoggedUser UserSession userSession,
                                        @PathVariable String studentCurp) {
        try {
            List<StudentDegreeStructure> view = degreeService.getDegreeView(studentCurp);
            return CustomResponseEntity.OK(view);
        } catch (AppException exception) {
            DegreeLogger.degreeView(log, exception.getMessage(), userSession, studentCurp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.degreeView(log, exception.toString(), userSession, studentCurp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/degreeCancelExternal")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> cancelExternalStamps(@LoggedUser UserSession userSession,
                                                  @RequestBody CancelStampExternal cancelStamp) {
        try {
            CancelStampExternal cencelStaps = new CancelStampExternal();
            if (cancelStamp.getStampedType().equals(4))
                cencelStaps = degreeService.cancelExternalStamps(userSession.getId(), cancelStamp);
            else cencelStaps = certificateService.cancelExternalStamps(userSession.getId(), cancelStamp);
            return CustomResponseEntity.OK(cencelStaps);
        } catch (AppException exception) {
            DegreeLogger.degreeCancelExternal(log, exception.getMessage(), userSession, cancelStamp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeLogger.degreeCancelExternal(log, exception.toString(), userSession, cancelStamp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
