package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.student.StudentSettingRole;
import mx.edu.cecyte.sisec.log.StudentSettingLogger;
import mx.edu.cecyte.sisec.service.StudentSettingService;
import mx.edu.cecyte.sisec.shared.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/setting")
@Log4j
public class StudentSettingController {
    @Autowired
    private StudentSettingService studentSettingService;

    @GetMapping("/selectUserRole/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> selectUserRole(@LoggedUser UserSession userSession,
                                            @PathVariable String curp) {
        try {
            List<StudentSettingRole> role = studentSettingService.selectUserRole(userSession.getUsername(), curp);
            return CustomResponseEntity.OK(role);
        } catch (AppException exception) {
            StudentSettingLogger.selectUserRole(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentSettingLogger.selectUserRole(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/assignRole/{studentId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> assignRole(@LoggedUser UserSession userSession,
                                        @PathVariable Integer studentId) {
        try {
            StudentSettingRole assign = studentSettingService.assignRole(studentId);
            return CustomResponseEntity.OK(assign);
        } catch (AppException exception) {
            StudentSettingLogger.assignRole(log, exception.getMessage(), userSession, studentId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentSettingLogger.assignRole(log, exception.toString(), userSession, studentId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
