package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2021FolioInfo;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2021Request;
import mx.edu.cecyte.sisec.log.SurveyGraduated2021Logger;
import mx.edu.cecyte.sisec.service.SurveyGraduated2021Service;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/surveyGraduated2021")
@Log4j
public class SurveyGraduated2021Controller {
    @Autowired
    private SurveyGraduated2021Service surveyGraduated2021Service;
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> saveSurvey(@LoggedUser UserSession userSession,
                                        @RequestBody SurveyGraduated2021Request surveyRequest) {
        try {
            String confirmationFolio = surveyGraduated2021Service.saveSurvey(surveyRequest, userSession.getUsername());
            return CustomResponseEntity.OK(confirmationFolio);
        } catch (AppException exception) {
           SurveyGraduated2021Logger.saveSurvey(log, exception.getMessage(), userSession, surveyRequest);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyGraduated2021Logger.saveSurvey(log, exception.toString(), userSession, surveyRequest);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{confirmationFolio}")
    @PreAuthorize("hasRole('ROLE_ALUMNO')")
    public ResponseEntity<?> getInfoFromFolio(@PathVariable String confirmationFolio) {
        try {
            SurveyGraduated2021FolioInfo folioInfo = surveyGraduated2021Service.getInfoFromFolio(confirmationFolio);
            return CustomResponseEntity.OK(folioInfo);
        } catch (AppException exception) {
            SurveyGraduated2021Logger.getInfoFromFolio(log, exception.getMessage(), confirmationFolio);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SurveyGraduated2021Logger.getInfoFromFolio(log, exception.toString(), confirmationFolio);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
