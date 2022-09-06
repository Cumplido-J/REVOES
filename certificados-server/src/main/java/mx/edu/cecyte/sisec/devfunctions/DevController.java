package mx.edu.cecyte.sisec.devfunctions;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.log.DevLogger;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dev")
@Log4j
public class DevController {
    @Autowired private DevEndingCertificateService devEndingCertificateService;
    @Autowired private DevPartialCertificateService devPartialCertificateService;
    @Autowired private DevPartialCertificateAllService devPartialCertificateAllService;
    @Autowired private DevUserCreationService devUserCreationService;

//    @GetMapping
//    @PreAuthorize("hasRole('ROLE_DEV')")
//    public ResponseEntity<?> generatePdf() {
//        try {
//            devPartialCertificateService.generateCecytePartialPdf();
//            devPartialCertificateService.generateEmsadPartialPdf();
//            return CustomResponseEntity.OK("Oki");
//        } catch (AppException exception) {
//            DevLogger.schoolSearch(log, exception.getMessage());
//            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
//        } catch (Exception exception) {
//            DevLogger.schoolSearch(log, exception.toString());
//            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
//        }
//    }

   // @GetMapping("/schoolControlAdmin")
//    @PreAuthorize("hasRole('ROLE_DEV')")
    /*public ResponseEntity<?> generateAllSchoolControlAdmins() {
        try {
            List<UserPassword> passwords = devUserCreationService.generateAllSchoolControlAdmins();
            return CustomResponseEntity.OK(passwords);
        } catch (AppException exception) {
            DevLogger.generateAllSchoolControlAdmins(log, exception.getMessage());
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DevLogger.generateAllSchoolControlAdmins(log, exception.toString());
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }*/
//    @GetMapping("/tracingAdmin")
//    public ResponseEntity<?> generateAllTracingAdmins() {
//        try {
//            List<UserPassword> passwords = devUserCreationService.generateAllTracingAdmins();
//            return CustomResponseEntity.OK(passwords);
//        } catch (AppException exception) {
//            DevLogger.generateAllTracingAdmins(log, exception.getMessage());
//            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
//        } catch (Exception exception) {
//            DevLogger.generateAllTracingAdmins(log, exception.toString());
//            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
//        }
//    }
}
