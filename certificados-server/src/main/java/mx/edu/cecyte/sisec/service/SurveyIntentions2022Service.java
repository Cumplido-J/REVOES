package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.survey.SurveyIntentions2022FolioInfo;
import mx.edu.cecyte.sisec.dto.survey.SurveyIntentions2022Request;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.survey2022.SurveyIntentions2022;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SurveyIntentions2022Queries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyIntentions2022Service {
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SurveyIntentions2022Queries surveyQueries;

    public String saveSurvey(SurveyIntentions2022Request surveyRequest, String username) {
        Student student = studentQueries.getStudentByUsername(username);

        if (student.getSurveyIntentions2022() != null) throw new AppException(Messages.survey_alreadyAnswered);
        SurveyIntentions2022 surveyIntentions2022 = new SurveyIntentions2022(surveyRequest, student);
        surveyIntentions2022 = surveyQueries.saveSurvey(surveyIntentions2022);

        auditingQueries.saveAudit("SurveyIntentions2022Service", "saveSurvey", student.getId(), SurveyIntentions2022.class, surveyIntentions2022.getId(), "Added student survey");
        return surveyIntentions2022.getConfirmationFolio();
    }

    public SurveyIntentions2022FolioInfo getInfoFromFolio(String confirmationFolio) {
        SurveyIntentions2022 survey = surveyQueries.getInfoFromFolio(confirmationFolio);
        return new SurveyIntentions2022FolioInfo(survey);
    }
}
