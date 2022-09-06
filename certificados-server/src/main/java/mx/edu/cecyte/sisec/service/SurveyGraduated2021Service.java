package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2021FolioInfo;
import mx.edu.cecyte.sisec.dto.survey.SurveyGraduated2021Request;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.survey2021.SurveyGraduated2021;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SurveyGraduated2021Queries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyGraduated2021Service {
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SurveyGraduated2021Queries surveyQueries;
    public String saveSurvey(SurveyGraduated2021Request surveyRequest, String username) {
        Student student = studentQueries.getStudentByUsername(username);

        if (student.getSurveyGraduated2020() != null) throw new AppException(Messages.survey_alreadyAnswered);
        SurveyGraduated2021 surveyGraduated2021 = new SurveyGraduated2021(surveyRequest, student);
        surveyGraduated2021 = surveyQueries.saveSurvey(surveyGraduated2021);

        auditingQueries.saveAudit("SurveyGraduated2021Service", "saveSurvey", student.getId(), SurveyGraduated2021.class, surveyGraduated2021.getId(), "Added student survey");
        return surveyGraduated2021.getConfirmationFolio();
    }

    public SurveyGraduated2021FolioInfo getInfoFromFolio(String confirmationFolio) {
        SurveyGraduated2021 survey = surveyQueries.getInfoFromFolio(confirmationFolio);
        return new SurveyGraduated2021FolioInfo(survey);
    }
}
