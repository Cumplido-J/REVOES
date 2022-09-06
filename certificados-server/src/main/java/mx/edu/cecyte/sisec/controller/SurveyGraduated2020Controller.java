package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2020FolioInfo;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2020Request;
import mx.edu.cecyte.sisec.log.Surve2020Logger;
import mx.edu.cecyte.sisec.service.SurveyGraduated2020Service;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/surveyGraduated2020")
@Log4j
public class SurveyGraduated2020Controller {
    @Autowired private SurveyGraduated2020Service surveyService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> saveSurvey(@LoggedUser UserSession userSession,
                                        @RequestBody SurveyGraduated2020Request surveyRequest) {
        try {
            String confirmationFolio = surveyService.saveSurvey(surveyRequest, userSession.getUsername());
            return CustomResponseEntity.OK(confirmationFolio);
        } catch (AppException exception) {
            Surve2020Logger.saveSurvey(log, exception.getMessage(), userSession, surveyRequest);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            Surve2020Logger.saveSurvey(log, exception.toString(), userSession, surveyRequest);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{confirmationFolio}")
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> getInfoFromFolio(@PathVariable String confirmationFolio) {
        try {
            SurveyGraduated2020FolioInfo folioInfo = surveyService.getInfoFromFolio(confirmationFolio);
            return CustomResponseEntity.OK(folioInfo);
        } catch (AppException exception) {
            Surve2020Logger.getInfoFromFolio(log, exception.getMessage(), confirmationFolio);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            Surve2020Logger.getInfoFromFolio(log, exception.toString(), confirmationFolio);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
