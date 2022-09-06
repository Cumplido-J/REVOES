package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.CertifiedFilter;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportCountry;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportSchool;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportState;
import mx.edu.cecyte.sisec.log.DegreeReportLogger;
import mx.edu.cecyte.sisec.service.DegreeReportService;
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
@RequestMapping("api/v1/degreeReport")
@Log4j
public class DegreeReportController {
    @Autowired private DegreeReportService degreeReportService;
    @GetMapping("/country")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> degreeCountryReport(@LoggedUser UserSession userSession,
                                              @RequestParam(defaultValue = "0") String generation){
        try {
            List<CertifiedReportCountry> certifiedCountry = degreeReportService.degreeCountryReport(generation, userSession.getId());
            return CustomResponseEntity.OK(certifiedCountry);
        } catch(AppException exception){
            DegreeReportLogger.degreeCountryReport(log, exception.getMessage(), userSession, generation);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception){
            DegreeReportLogger.degreeCountryReport(log, exception.toString(), userSession, generation);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @GetMapping("/state")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> degreeStateReport(@LoggedUser UserSession userSession,
                                            @RequestParam(defaultValue = "0") String generation,
                                            @RequestParam(defaultValue = "0") Integer stateId){
        CertifiedFilter certifiedFilter = new CertifiedFilter(generation, stateId);
        try {
            CertifiedReportState certifiedReport = degreeReportService.degreeStateReport(certifiedFilter, userSession.getId());
            return CustomResponseEntity.OK(certifiedReport);

        } catch(AppException exception) {
            DegreeReportLogger.degreeStateReport(log, exception.getMessage(), userSession, generation, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception){
            DegreeReportLogger.degreeStateReport(log, exception.toString(), userSession, generation, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/school")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> degreeSchoolReport(@LoggedUser UserSession userSession,
                                             @RequestParam(defaultValue = "0") String generation,
                                             @RequestParam(defaultValue = "0") Integer schoolId) {
        CertifiedFilter certifiedFilter = new CertifiedFilter(generation, schoolId);
        try {
            CertifiedReportSchool certifiedReportSchool = degreeReportService.degreeSchoolReport(generation, schoolId, userSession.getId());
            return CustomResponseEntity.OK(certifiedReportSchool);
        } catch(AppException exception){
            DegreeReportLogger.degreeSchoolReport(log, exception.getMessage(), userSession, generation, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception){
            DegreeReportLogger.degreeSchoolReport(log, exception.toString(), userSession, generation, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
