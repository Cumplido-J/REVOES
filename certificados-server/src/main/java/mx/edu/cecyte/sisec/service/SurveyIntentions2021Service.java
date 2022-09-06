package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.SurveyIntentions2021FolioInfo;
import mx.edu.cecyte.sisec.dto.SurveyIntentions2021Request;
import mx.edu.cecyte.sisec.model.SurveyIntentions2021;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SurveyIntentions2021Queries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyIntentions2021Service {
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SurveyIntentions2021Queries surveyQueries;

    public String saveSurvey(SurveyIntentions2021Request surveyRequest, String username) {
        Student student = studentQueries.getStudentByUsername(username);

        if (student.getSurveyIntentions2021() != null) throw new AppException(Messages.survey_alreadyAnswered);
        SurveyIntentions2021 surveyIntentions2021 = new SurveyIntentions2021(surveyRequest, student);
        surveyIntentions2021 = surveyQueries.saveSurvey(surveyIntentions2021);

        auditingQueries.saveAudit("SurveyIntentions2021Service", "saveSurvey", student.getId(), SurveyIntentions2021.class, surveyIntentions2021.getId(), "Added student survey");
        return surveyIntentions2021.getConfirmationFolio();
    }

    public SurveyIntentions2021FolioInfo getInfoFromFolio(String confirmationFolio) {
        SurveyIntentions2021 survey = surveyQueries.getInfoFromFolio(confirmationFolio);
        return new SurveyIntentions2021FolioInfo(survey);
    }
}
