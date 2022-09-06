package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.SurveyIntentions2021Request;
import mx.edu.cecyte.sisec.dto.survey.*;
import mx.edu.cecyte.sisec.log.SurveyReportLogger;
import mx.edu.cecyte.sisec.service.SurveyReportService;
import mx.edu.cecyte.sisec.shared.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/surveyreport")
@Log4j
public class SurveyReportController {
    @Autowired private SurveyReportService surveyReportService;

    @GetMapping("/country")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getCountryReport(@LoggedUser UserSession userSession,
                                              @RequestParam(defaultValue = "0") Integer surveyType) {
        try {
            List<SurveyReportCountry> surveyReport = surveyReportService.getCountryReport(surveyType, userSession.getId());
            return CustomResponseEntity.OK(surveyReport);
        } catch (AppException exception) {
            SurveyReportLogger.getCountryReport(log, exception.getMessage(), userSession, surveyType);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getCountryReport(log, exception.toString(), userSession, surveyType);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/state")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getStateReport(@LoggedUser UserSession userSession,
                                            @RequestParam(defaultValue = "0") Integer surveyType,
                                            @RequestParam(defaultValue = "0") Integer stateId) {
        try {
            SurveyReportState surveyReport = surveyReportService.getStateReport(surveyType, stateId, userSession.getId());
            return CustomResponseEntity.OK(surveyReport);
        } catch (AppException exception) {
            SurveyReportLogger.getStateReport(log, exception.getMessage(), userSession, surveyType, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getStateReport(log, exception.toString(), userSession, surveyType, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/school")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getSchoolReport(@LoggedUser UserSession userSession,
                                             @RequestParam(defaultValue = "0") Integer surveyType,
                                             @RequestParam(defaultValue = "0") Integer schoolId) {
        try {
            SurveyReportSchool surveyReport = surveyReportService.getSchoolReport(surveyType, schoolId, userSession.getId());
            return CustomResponseEntity.OK(surveyReport);
        } catch (AppException exception) {
            SurveyReportLogger.getSchoolReport(log, exception.getMessage(), userSession, surveyType, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getSchoolReport(log, exception.toString(), userSession, surveyType, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @GetMapping("/stateAnswer")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getStateReportAnswer(@LoggedUser UserSession userSession,
                                                  @RequestParam(defaultValue = "0") Integer surveyType,
                                                  @RequestParam(defaultValue = "0") Integer stateId) {
        try {
            SurveyReportStateAnswer surveyReport = surveyReportService.getStateReportAnswer(surveyType, stateId, userSession.getId());
            return CustomResponseEntity.OK(surveyReport);
        } catch (AppException exception) {
            SurveyReportLogger.getStateReportAnswer(log, exception.getMessage(), userSession, surveyType, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getStateReportAnswer(log, exception.toString(), userSession, surveyType, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/stateAnswerGraduated")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getStateReportAnswerGraduated(@LoggedUser UserSession userSession,
                                                  @RequestParam(defaultValue = "0") Integer surveyType,
                                                  @RequestParam(defaultValue = "0") Integer stateId) {
        try {
            SurveyReportAnswerGraduated surveyReport = surveyReportService.getStateReportAnswerGraduated(surveyType, stateId, userSession.getId());
            //System.out.println(surveyReport);
            return CustomResponseEntity.OK(surveyReport);
        } catch (AppException exception) {
            SurveyReportLogger.getStateReportAnswerGraduated(log, exception.getMessage(), userSession, surveyType, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getStateReportAnswerGraduated(log, exception.toString(), userSession, surveyType, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/answerIntentions1/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getAnswerIntentionsData1(@LoggedUser UserSession userSession,
                                                     @PathVariable String curp) {
        try {
            SurveyIntentions2020Request answerData = surveyReportService.getAnswerIntentionsUno(curp, userSession.getId());
            return CustomResponseEntity.OK(answerData);
        } catch (AppException exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.getMessage(), userSession,curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.toString(), userSession,curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/answerGraduated1/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getAnswerGraduatedData1(@LoggedUser UserSession userSession,
                                                    @PathVariable String curp) {
        try {
            SurveyGraduated2020Request answerData = surveyReportService.getAnswerGraduatedUno(curp, userSession.getId());
            return CustomResponseEntity.OK(answerData);
        } catch (AppException exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.getMessage(), userSession,curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.toString(), userSession,curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/answerGraduated2/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getAnswerGraduatedData(@LoggedUser UserSession userSession,
                                                    @PathVariable String curp) {
        try {
            SurveyGraduated2021Request answerData = surveyReportService.getAnswerGraduated(curp, userSession.getId());
            return CustomResponseEntity.OK(answerData);
        } catch (AppException exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.getMessage(), userSession,curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.toString(), userSession,curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/answerIntentions2/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR')")
    public ResponseEntity<?> getAnswerIntentionsData(@LoggedUser UserSession userSession,
                                                    @PathVariable String curp) {
        try {
            SurveyIntentions2021Request answerData = surveyReportService.getAnswerIntentions(curp, userSession.getId());
            return CustomResponseEntity.OK(answerData);
        } catch (AppException exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.getMessage(), userSession,curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyReportLogger.getAnswerGraduated(log, exception.toString(), userSession,curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
