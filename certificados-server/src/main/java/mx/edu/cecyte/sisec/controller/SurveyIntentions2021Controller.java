package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.SurveyIntentions2021FolioInfo;
import mx.edu.cecyte.sisec.dto.SurveyIntentions2021Request;
import mx.edu.cecyte.sisec.log.Survey2021Logger;
import mx.edu.cecyte.sisec.service.SurveyIntentions2021Service;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/surveyIntentions2021")
@Log4j
public class SurveyIntentions2021Controller { @Autowired private SurveyIntentions2021Service surveyService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> saveSurvey(@LoggedUser UserSession userSession,
                                        @RequestBody SurveyIntentions2021Request surveyRequest) {
        try {
            String confirmationFolio = surveyService.saveSurvey(surveyRequest, userSession.getUsername());
            return CustomResponseEntity.OK(confirmationFolio);
        } catch (AppException exception) {
            Survey2021Logger.saveSurvey(log, exception.getMessage(), userSession, surveyRequest);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            Survey2021Logger.saveSurvey(log, exception.toString(), userSession, surveyRequest);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{confirmationFolio}")
    public ResponseEntity<?> getInfoFromFolio(@PathVariable String confirmationFolio) {
        try {
            SurveyIntentions2021FolioInfo folioInfo = surveyService.getInfoFromFolio(confirmationFolio);
            return CustomResponseEntity.OK(folioInfo);
        } catch (AppException exception) {
            Survey2021Logger.getInfoFromFolio(log, exception.getMessage(), confirmationFolio);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            Survey2021Logger.getInfoFromFolio(log, exception.toString(), confirmationFolio);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
