package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.log.StudentFunctionsLogger;
import mx.edu.cecyte.sisec.service.StudentFunctionsService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/studentfunctions")
@Log4j
public class StudentFunctionsController {
    @Autowired private StudentFunctionsService studentFunctionsService;

    @GetMapping("/acceptPrivacy")
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> acceptPrivacy(@LoggedUser UserSession userSession) {
        try {
            studentFunctionsService.acceptPrivacy(userSession.getId());
            return CustomResponseEntity.OK("Gracias por aceptar el aviso de privacidad.");
        } catch (AppException exception) {
            StudentFunctionsLogger.acceptPrivacy(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentFunctionsLogger.acceptPrivacy(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/updateStudentCareer/{schoolCareerId}")
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> updateStudentCareer(@LoggedUser UserSession userSession,
                                                 @PathVariable Integer schoolCareerId) {
        try {
            studentFunctionsService.updateStudentCareer(userSession.getId(), schoolCareerId);
            return CustomResponseEntity.OK("Tu carrera ha sido actualizada correctamente.");
        } catch (AppException exception) {
            StudentFunctionsLogger.updateStudentCareer(log, exception.getMessage(), userSession, schoolCareerId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentFunctionsLogger.updateStudentCareer(log, exception.toString(), userSession, schoolCareerId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/availableSchoolCareers")
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> getAvailableSchoolCareers(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> schoolCareers = studentFunctionsService.getAvailableSchoolCareer(userSession.getId());
            return CustomResponseEntity.OK(schoolCareers);
        } catch (AppException exception) {
            StudentFunctionsLogger.getAvailableSchoolCareer(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentFunctionsLogger.getAvailableSchoolCareer(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
