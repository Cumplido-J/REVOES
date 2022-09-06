package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2022FolioInfo;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2022Request;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.survey2022.SurveyGraduated2022;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SurveyGraduated2022Queries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyGraduated2022Service {
    @Autowired
    private AuditingQueries auditingQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SurveyGraduated2022Queries surveyQueries;
    public String saveSurvey(SurveyGraduated2022Request surveyRequest, String username) {
        Student student = studentQueries.getStudentByUsername(username);

        if (student.getSurveyGraduated2022() != null) throw new AppException(Messages.survey_alreadyAnswered);
        SurveyGraduated2022 surveyGraduated2022 = new SurveyGraduated2022(surveyRequest, student);
        surveyGraduated2022 = surveyQueries.saveSurvey(surveyGraduated2022);

        auditingQueries.saveAudit("SurveyGraduated2022Service", "saveSurvey", student.getId(), SurveyGraduated2022.class, surveyGraduated2022.getId(), "Added student survey");
        return surveyGraduated2022.getConfirmationFolio();
    }

    public SurveyGraduated2022FolioInfo getInfoFromFolio(String confirmationFolio) {
        SurveyGraduated2022 survey = surveyQueries.getInfoFromFolio(confirmationFolio);
        return new SurveyGraduated2022FolioInfo(survey);
    }
}
