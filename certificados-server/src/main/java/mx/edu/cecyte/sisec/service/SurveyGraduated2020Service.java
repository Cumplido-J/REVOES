package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2020FolioInfo;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2020Request;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.survey2020.SurveyGraduated2020;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SurveyGraduated2020Queries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyGraduated2020Service {
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SurveyGraduated2020Queries surveyQueries;

    public String saveSurvey(SurveyGraduated2020Request surveyRequest, String username) {
        Student student = studentQueries.getStudentByUsername(username);

        if (student.getSurveyGraduated2020() != null) throw new AppException(Messages.survey_alreadyAnswered);
        SurveyGraduated2020 surveyGraduated2020 = new SurveyGraduated2020(surveyRequest, student);
        surveyGraduated2020 = surveyQueries.saveSurvey(surveyGraduated2020);

        auditingQueries.saveAudit("SurveyGraduated2020Service", "saveSurvey", student.getId(), SurveyGraduated2020.class, surveyGraduated2020.getId(), "Added student survey");
        return surveyGraduated2020.getConfirmationFolio();
    }

    public SurveyGraduated2020FolioInfo getInfoFromFolio(String confirmationFolio) {
        SurveyGraduated2020 survey = surveyQueries.getInfoFromFolio(confirmationFolio);
        return new SurveyGraduated2020FolioInfo(survey);
    }
}
