package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.CertifiedFilter;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportCountry;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportSchool;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportState;
import mx.edu.cecyte.sisec.log.CertifiedReportLogger;
import mx.edu.cecyte.sisec.service.CertifiedReportService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/certifiedreport")
@Log4j
public class CertifiedReportController {

    @Autowired private CertifiedReportService certifiedReportService;

    @GetMapping("/country")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCountryReport(@LoggedUser UserSession userSession,
                                              @RequestParam(defaultValue = "0") String certifiedType){
       try {
            List<CertifiedReportCountry> certifiedCountry = certifiedReportService.getCountryReport(certifiedType, userSession.getId());
            return CustomResponseEntity.OK(certifiedCountry);
       } catch(AppException exception){
           CertifiedReportLogger.getCountryReport(log, exception.getMessage(), userSession, certifiedType);
           return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception){
           CertifiedReportLogger.getCountryReport(log, exception.toString(), userSession, certifiedType);
           return CustomResponseEntity.INTERNAL_SERVER_ERROR();
       }
    }

    @GetMapping("/state")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getStateReport(@LoggedUser UserSession userSession,
                                            @RequestParam(defaultValue = "0") String certifiedType,
                                            @RequestParam(defaultValue = "0") Integer stateId){
        CertifiedFilter certifiedFilter = new CertifiedFilter(certifiedType, stateId);
        try {
            CertifiedReportState certifiedReport = certifiedReportService.getStateReport(certifiedFilter, userSession.getId());
            return CustomResponseEntity.OK(certifiedReport);

        } catch(AppException exception) {
            CertifiedReportLogger.getStateReport(log, exception.getMessage(), userSession, certifiedType, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception){
            CertifiedReportLogger.getStateReport(log, exception.toString(), userSession, certifiedType, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/school")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getSchoolReport(@LoggedUser UserSession userSession,
                                             @RequestParam(defaultValue = "0") String certifiedType,
                                             @RequestParam(defaultValue = "0") Integer schoolId) {
        CertifiedFilter certifiedFilter = new CertifiedFilter(certifiedType, schoolId);
        try {
            CertifiedReportSchool certifiedReportSchool = certifiedReportService.getSchoolReport(certifiedType, schoolId, userSession.getId());
            return CustomResponseEntity.OK(certifiedReportSchool);
        } catch(AppException exception){
            CertifiedReportLogger.getSchoolReport(log, exception.getMessage(), userSession, certifiedType, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception){
            CertifiedReportLogger.getSchoolReport(log, exception.toString(), userSession, certifiedType, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }



}
