package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.StudentFilter;
import mx.edu.cecyte.sisec.dto.certificado.CertificateData;
import mx.edu.cecyte.sisec.dto.student.*;
import mx.edu.cecyte.sisec.log.StudentLogger;
import mx.edu.cecyte.sisec.service.StudentService;
import mx.edu.cecyte.sisec.service.SubjectService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/students")
@Log4j
public class StudentController {

    @Autowired private StudentService studentService;
    @Autowired private SubjectService subjectService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentSearch(@LoggedUser UserSession userSession,
                                           @RequestParam(defaultValue = "0") Integer stateId,
                                           @RequestParam(defaultValue = "0") Integer schoolId,
                                           @RequestParam(defaultValue = "0") Integer careerId,
                                           @RequestParam(defaultValue = "0") Integer studentStatus,
                                           @RequestParam(defaultValue = "") String searchText,
                                           @RequestParam(defaultValue = "") String generation) {
        StudentFilter studentFilter = new StudentFilter(stateId, schoolId, careerId, studentStatus, searchText, generation);
        try {
            List<StudentSearchResult> resultList = studentService.studentSearch(studentFilter, userSession.getId());
            return CustomResponseEntity.OK(resultList);
        } catch (AppException exception) {
            StudentLogger.studentSearch(log, exception.getMessage(), userSession, studentFilter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.studentSearch(log, exception.toString(), userSession, studentFilter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getStudentData(@LoggedUser UserSession userSession,
                                            @PathVariable String studentCurp) {
        try {
            StudentData studentData = studentService.getStudentData(studentCurp, userSession.getId());
            return CustomResponseEntity.OK(studentData);
        } catch (AppException exception) {
            StudentLogger.getStudentData(log, exception.getMessage(), userSession, studentCurp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getStudentData(log, exception.toString(), userSession, studentCurp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> addNewStudent(@LoggedUser UserSession userSession,
                                           @RequestBody StudentData studentData) {
        try {
            studentData = studentService.addNewStudent(studentData, userSession.getId());
            return CustomResponseEntity.OK(studentData);
        } catch (AppException exception) {
            StudentLogger.addNewStudent(log, exception.getMessage(), userSession, studentData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.addNewStudent(log, exception.toString(), userSession, studentData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/edit/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> editStudent(@LoggedUser UserSession userSession,
                                         @PathVariable String studentCurp,
                                         @RequestBody StudentData studentData) {
        try {
            studentData = studentService.editStudent(studentData, studentCurp, userSession.getId());
            return CustomResponseEntity.OK(studentData);
        } catch (AppException exception) {
            StudentLogger.editStudent(log, exception.getMessage(), userSession, studentData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.editStudent(log, exception.toString(), userSession, studentData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/password/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO')")
    public ResponseEntity<?> editStudentPassword(@LoggedUser UserSession userSession,
                                                 @PathVariable String studentCurp,
                                                 @RequestBody StudentPasswordDto password) {
        try {
            studentService.editStudentPassword(studentCurp, userSession.getId(), password);
            return CustomResponseEntity.OK("Se ha editado correctamente el alumno");
        } catch (AppException exception) {
            StudentLogger.editStudentPassword(log, exception.getMessage(), userSession, password);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.editStudentPassword(log, exception.toString(), userSession, password);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @PostMapping("/editStudentModules")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> addPortabilityModules(@LoggedUser UserSession userSession,
                                                   @RequestBody StudentPortability studentPortability) {
        try {
            studentService.addPortabilityModules(studentPortability, userSession.getId());
            return CustomResponseEntity.OK("Las calificaciones de los módulos han sido actualizadas");
        } catch (AppException exception) {
            StudentLogger.addPortabilityModules(log, exception.getMessage(), userSession, studentPortability);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.addPortabilityModules(log, exception.toString(), userSession, studentPortability);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getStudentModules/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getStudentModules(@LoggedUser UserSession userSession,
                                               @PathVariable String curp) {
        try {
            List<StudentPortabilityModules> modules = studentService.getStudentPortabilityModules(curp, userSession.getId());
            return CustomResponseEntity.OK(modules);
        } catch (AppException exception) {
            StudentLogger.getStudentModules(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getStudentModules(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/availablesubjects/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getAvailableStudentSubjects(@LoggedUser UserSession userSession,
                                                @PathVariable String curp) {
        try {
            StudentSemesters studentSemesters = subjectService.getAvailableStudentSubjects(curp, userSession.getId());
            return CustomResponseEntity.OK(studentSemesters);
        } catch (AppException exception) {
            StudentLogger.getAvailableStudentSubjects(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getAvailableStudentSubjects(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/subjects/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getStudentSubjects(@LoggedUser UserSession userSession,
                                                @PathVariable String curp) {
        try {
            StudentSemesters studentSemesters = subjectService.getStudentSubjects(curp, userSession.getId());
            return CustomResponseEntity.OK(studentSemesters);
        } catch (AppException exception) {
            StudentLogger.getStudentSubjects(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getStudentSubjects(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/subjects/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> addStudentSubjects(@LoggedUser UserSession userSession,
                                                @RequestBody StudentSemesters semesters,
                                                @PathVariable String curp) {
        try {
            subjectService.addStudentSubjects(curp, semesters, userSession.getId());
            return CustomResponseEntity.OK("Se han guardado correctamente las calificaciones del alumno");
        } catch (AppException exception) {
            StudentLogger.addStudentSubjects(log, exception.getMessage(), userSession, semesters, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.addStudentSubjects(log, exception.toString(), userSession, semesters, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/formatdownload")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentFormatDownload(@LoggedUser UserSession userSession,
                                           @RequestBody StudentDataFormat studentDataFormat) {
        try {
            List<StudentFormatCarrer> studentFormat = studentService.studentFormatDownload(studentDataFormat, userSession.getId());
            return CustomResponseEntity.OK(studentFormat);
        } catch (AppException exception) {
            StudentLogger.studentFormatDownload(log, exception.getMessage(), userSession, studentDataFormat);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.studentFormatDownload(log, exception.toString(), userSession, studentDataFormat);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }

    }

    @PostMapping("/updateScoreStudent")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getUpdateStudentSubject(@LoggedUser UserSession userSession,
                                                     @RequestBody StudentSubjectUpdate studentSubjectUpdate) {
        try {
            StudentSubjectUpdate subject = subjectService.getUpdateStudentSubject(studentSubjectUpdate, userSession.getId());
            return CustomResponseEntity.OK(subject);
        } catch (AppException exception) {
            StudentLogger.getUpdateStudentSubject(log, exception.getMessage(), userSession, studentSubjectUpdate);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getUpdateStudentSubject(log, exception.toString(), userSession, studentSubjectUpdate);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/updateCreditsStudent")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> updateCreditsStudent(@LoggedUser UserSession userSession,
                                                  @RequestBody StudentCreditsUpdate studentCreditsUpdate) {
        try {
            StudentCreditsUpdate credit = studentService.updateCreditsStudent(studentCreditsUpdate, userSession.getUsername());
            return CustomResponseEntity.OK(credit);
        } catch (AppException exception) {
            StudentLogger.updateCreditsStudent(log, exception.getMessage(), userSession, studentCreditsUpdate);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.updateCreditsStudent(log, exception.toString(), userSession, studentCreditsUpdate);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteScoreStudent")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> deleteScoreStudent(@LoggedUser UserSession userSession,
                                                @RequestBody StudentDeleteScore studentDeleteScore) {
        try {
            StudentDeleteScore delete = studentService.deleteScoreStudent(studentDeleteScore);
            return CustomResponseEntity.OK(delete);
        } catch (AppException exception) {
            StudentLogger.deleteScoreStudent(log, exception.getMessage(), userSession, studentDeleteScore);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.deleteScoreStudent(log, exception.toString(), userSession, studentDeleteScore);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addSubjectRow/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public  ResponseEntity<?> addSubjectRow(@LoggedUser UserSession userSession,
                                            @RequestBody StudentSubjectRow studentSubjectRow,
                                            @PathVariable String curp) {
        try {
            StudentSubjectRow row = studentService.addSubjectRow(studentSubjectRow, curp, userSession.getUsername());
            return CustomResponseEntity.OK(row);
        } catch (AppException exception) {
            StudentLogger.addSubjectRow(log, exception.getMessage(), userSession, studentSubjectRow);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.addSubjectRow(log, exception.toString(), userSession, studentSubjectRow);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/studentRecord/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentRecord(@LoggedUser UserSession userSession,
                                           @PathVariable String curp) {
        try{
            StudentRecord record = studentService.studentRecord(userSession.getId(), curp);
            return CustomResponseEntity.OK(record);
        } catch(AppException exception) {
            StudentLogger.studentRecord(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception) {
            StudentLogger.studentRecord(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("selectRecordCourse/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> selectRecordCourse(@LoggedUser UserSession userSession,
                                                @PathVariable Integer id) {
        try{
            List<StudentRecordScore> recordScores = studentService.selectRecordCourse(userSession.getId(), id);
            return CustomResponseEntity.OK(recordScores);
        } catch (AppException exception) {
            StudentLogger.selectRecordCourse(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.selectRecordCourse(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/returnCourseRecors/{studentId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> returnCourseRecors(@LoggedUser UserSession userSession,
                                                @PathVariable Integer studentId,
                                                @RequestBody StudentRecordData studentRecordData){
        try{
            StudentRecordScore score = studentService.returnCourseRecors(studentId, studentRecordData);
            return CustomResponseEntity.OK("Registro retornado correctamente");
        } catch (AppException exception) {
            StudentLogger.returnCourseRecors(log, exception.getMessage(), userSession, studentId, studentRecordData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.returnCourseRecors(log, exception.toString(), userSession, studentId, studentRecordData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/selectIssuedCertificates/{curp}/{certificateType}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> selectIssuedCertificates(@LoggedUser UserSession userSession,
                                                      @PathVariable String curp,
                                                      @PathVariable Integer certificateType) {
        try {
            List<CertificateData> issued = studentService.selectIssuedCertificates(curp, certificateType);
            return CustomResponseEntity.OK(issued);
        } catch (AppException exception) {
            StudentLogger.selectIssuedCertificates(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.selectIssuedCertificates(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteRowRecord/{studentId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> deleteRowRecord(@LoggedUser UserSession userSession,
                                             @PathVariable Integer studentId,
                                             @RequestBody StudentRecordData studentRecordData) {
        try {
            StudentRecordScore delete = studentService.deleteRowRecord(studentId, studentRecordData);
            return CustomResponseEntity.OK("Registro eliminado correctamente");
        } catch (AppException exception) {
            StudentLogger.deleteRowRecord(log, exception.getMessage(), userSession, studentRecordData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.deleteRowRecord(log, exception.toString(), userSession, studentRecordData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/searchStudentText/{searchText}/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> studentSearch(@LoggedUser UserSession userSession,
                                           @PathVariable String searchText,
                                           @PathVariable Integer stateId) {
        //StudentFilter studentFilter = new StudentFilter(stateId, schoolId, careerId, studentStatus, searchText, generation);
        try {
            List<StudentSearchResult> resultList = studentService.studentSearchCopy(searchText, userSession.getId(),stateId);
            return CustomResponseEntity.OK(resultList);
        } catch (AppException exception) {
            StudentLogger.studentSearchCopy(log, exception.getMessage(), userSession, searchText);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.studentSearchCopy(log, exception.toString(), userSession, searchText);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/changeStatus/{curp}/{status}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> changeStatus(@LoggedUser UserSession userSession,
                                          @PathVariable String curp,
                                          @PathVariable Boolean status) {
        try {
            ///System.out.println("CURP:"+ curp +" " +status);
            studentService.changeStatus(curp, status, userSession.getId());
            return CustomResponseEntity.OK(" Modificado");
        } catch (AppException exception) {
            StudentLogger.changeStatus(log, exception.getMessage(), userSession, curp,status);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.changeStatus(log, exception.toString(), userSession,curp,status);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
