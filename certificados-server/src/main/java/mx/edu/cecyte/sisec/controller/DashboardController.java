package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.dashboard.*;
import mx.edu.cecyte.sisec.log.DashboardLogger;
import mx.edu.cecyte.sisec.log.SurveyReportLogger;
import mx.edu.cecyte.sisec.service.DashboardService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@Log4j
public class DashboardController {
    @Autowired
    private DashboardService service;

    @GetMapping("/question4/{question}/{gender}/{idestado}/{idschool}/{surveyType}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getQuestion4(@LoggedUser UserSession userSession,
                                            @PathVariable String question,
                                            @PathVariable String gender,
                                            @PathVariable Integer idestado,
                                            @PathVariable Integer idschool,
                                            @PathVariable Integer surveyType) {
        try {
            Integer question4= service.getTotal2(question,gender,idestado,idschool,surveyType,userSession.getId());
            return CustomResponseEntity.OK(question4);
        } catch (AppException exception) {
            DashboardLogger.getTotal2(log, exception.getMessage(), userSession,question);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getTotal2(log, exception.toString(), userSession,question);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    //mapa
    @GetMapping("/paismexico/{tipo}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getMexicoReport(@LoggedUser UserSession userSession,
                                              @PathVariable Integer tipo) {
        try {
            List<ReportCountry> surveyReport = service.getMexicoReport(tipo,userSession.getUsername());
            return CustomResponseEntity.OK(surveyReport);
        } catch (AppException exception) {
            DashboardLogger.getMexicoReport(log, exception.getMessage(), userSession, tipo);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getMexicoReport(log, exception.toString(), userSession, tipo);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    //Total new Generation
    @GetMapping("/conteoNew/{idestado}/{idschool}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getNewGeneration(@LoggedUser UserSession userSession,
                                              @PathVariable Integer idestado,
                                              @PathVariable Integer idschool) {
        try {
            List<CountNew> newgeneration = service.getCountNewGeneration(idestado,idschool,userSession.getId());
            return CustomResponseEntity.OK(newgeneration);
        } catch (AppException exception) {
            DashboardLogger.getNew(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getNew(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/conteoCertificado/{idestado}/{idschool}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getCertified(@LoggedUser UserSession userSession,
                                          @PathVariable Integer idestado,
                                          @PathVariable Integer idschool) {
        try {
            List<CountCertified> tcertified = service.getCountCertified(idestado,idschool,userSession.getId());
            return CustomResponseEntity.OK(tcertified);
        } catch (AppException exception) {
            DashboardLogger.getNew(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getNew(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/cecytes/{idestado}/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getPlanteles(@LoggedUser UserSession userSession,
                                          @PathVariable Integer idestado,
                                          @PathVariable Integer schoolId) {
        try {
            List<SchoolList> schools = service.getListSchool(idestado,schoolId);
            return CustomResponseEntity.OK(schools);
        } catch (AppException exception) {
            DashboardLogger.getNew(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getNew(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    //certificados por genero
    @GetMapping("/certifiedByHM/{idestado}/{idschool}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getCertifiedBy(@LoggedUser UserSession userSession,
                                          @PathVariable Integer idestado,
                                          @PathVariable Integer idschool) {
        try {
            List<TotalList> dataCertified = service.getCountCertifiedBy(idestado,idschool,userSession.getId());
            return CustomResponseEntity.OK(dataCertified);
        } catch (AppException exception) {
            DashboardLogger.getNew(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getNew(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    //titulados por genero
    @GetMapping("/degreedByHM/{idestado}/{idschool}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getDegreedBy(@LoggedUser UserSession userSession,
                                            @PathVariable Integer idestado,
                                            @PathVariable Integer idschool) {
        try {
            List<TotalList> dataDegreed = service.getCountDegreedBy(idestado,idschool,userSession.getId());
            return CustomResponseEntity.OK(dataDegreed);
        } catch (AppException exception) {
            DashboardLogger.getNew(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DashboardLogger.getNew(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
