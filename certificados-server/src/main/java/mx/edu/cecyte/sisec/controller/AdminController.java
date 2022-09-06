package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.log.AdminLogger;
import mx.edu.cecyte.sisec.service.AdminService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@Log4j
public class AdminController {

    @Autowired private AdminService adminService;

    @GetMapping("/countTemporalPasswords")
    @PreAuthorize("hasRole('ROLE_DEV')")
    public ResponseEntity<?> getStudentsWithTemporalPasswordCount(@LoggedUser UserSession userSession) {
        try {
            Integer studentsWithTemporalPasswordCount = adminService.getStudentsWithTemporalPasswordCount();
            return CustomResponseEntity.OK(studentsWithTemporalPasswordCount);
        } catch (AppException exception) {
            AdminLogger.getStudentsWithTemporalPasswordCount(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            AdminLogger.getStudentsWithTemporalPasswordCount(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/updateTemporalPasswords")
    @PreAuthorize("hasRole('ROLE_DEV')")
    public ResponseEntity<?> updateStudentsWithTemporalPassword(@LoggedUser UserSession userSession) {
        try {
            adminService.updateTemporalPasswords(userSession.getId());
            return CustomResponseEntity.OK("Las contraseñas han sido actualizadas correctamente");
        } catch (AppException exception) {
            AdminLogger.updateStudentsWithTemporalPassword(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            AdminLogger.updateStudentsWithTemporalPassword(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
