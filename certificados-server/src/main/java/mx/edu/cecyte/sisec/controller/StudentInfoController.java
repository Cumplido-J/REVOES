package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.student.StudentInfoDto;
import mx.edu.cecyte.sisec.log.StudentInfoLogger;
import mx.edu.cecyte.sisec.service.StudentInfoService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/studentInfo")
@Log4j
public class StudentInfoController {
    @Autowired private StudentInfoService studentService;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> getStudentInfo(@LoggedUser UserSession userSession) {
        try {
            StudentInfoDto studentInfoDto = studentService.getStudentInfo(userSession.getId());
            return CustomResponseEntity.OK(studentInfoDto);
        } catch (AppException exception) {
            StudentInfoLogger.getStudentInfo(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentInfoLogger.getStudentInfo(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> editStudentInfo(@LoggedUser UserSession userSession,
                                             @RequestBody StudentInfoDto studentInfoDto) {
        try {
            studentInfoDto = studentService.editStudentInfo(userSession.getId(), studentInfoDto);
            return CustomResponseEntity.OK(studentInfoDto);
        } catch (AppException exception) {
            StudentInfoLogger.editStudentInfo(log, exception.getMessage(), userSession, studentInfoDto);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentInfoLogger.editStudentInfo(log, exception.toString(), userSession, studentInfoDto);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
