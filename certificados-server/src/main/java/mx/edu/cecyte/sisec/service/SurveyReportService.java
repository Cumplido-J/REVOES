package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.SurveyIntentions2021Request;
import mx.edu.cecyte.sisec.dto.survey.*;
import mx.edu.cecyte.sisec.model.SurveyIntentions2021;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.survey2020.SurveyGraduated2020;
import mx.edu.cecyte.sisec.model.survey2020.SurveyIntentions2020;
import mx.edu.cecyte.sisec.model.survey2021.SurveyGraduated2021;
import mx.edu.cecyte.sisec.model.users.AdminUserScope;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class SurveyReportService {
    @Autowired private UserQueries userQueries;
    @Autowired private StateQueries stateQueries;
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private SurveyGraduated2020Queries surveyGraduated2020Queries;
    @Autowired private SurveyGraduated2021Queries surveyGraduated2021Queries;
    @Autowired private SurveyGraduated2022Queries surveyGraduated2022Queries;
    @Autowired private SurveyIntentions2020Queries surveyIntentions2020Queries;
    @Autowired private SurveyIntentions2021Queries surveyIntentions2021Queries;
    @Autowired private SurveyIntentions2022Queries surveyIntentions2022Queries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private CatalogQueries catalogQueries;

    public List<SurveyReportCountry> getCountryReport(Integer surveyType, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        //if (!userQueries.isDevAdmin(userAdmin)) throw new AppException("No tienes permiso para ver este reporte");

        List<SurveyReportCountry> surveys = new ArrayList<>();
        if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2020)) {
            surveys = surveyIntentions2020Queries.getCountryReport(userAdmin);
        } else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2020)) {
            surveys = surveyGraduated2020Queries.getCountryReport(userAdmin);
        } else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2021)) {
            surveys = surveyIntentions2021Queries.getCountryReport(userAdmin);
        }
        //codigo eugenio
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2021)) {
            surveys = surveyGraduated2021Queries.getCountryReport(userAdmin);
        } else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2022)) {
            surveys = surveyIntentions2022Queries.getCountryReport(userAdmin);
        } else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2022)) {
            surveys = surveyGraduated2022Queries.getCountryReport(userAdmin);
        }
        //termina codigo eugenio
        return surveys;
    }

    public SurveyReportState getStateReport(Integer surveyType, Integer stateId, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        /*GraduateTracingAdmin graduateTracingAdmin = userAdmin.getGraduateTracingAdmin();

        if (graduateTracingAdmin != null) {
            if (graduateTracingAdmin.getState() != null)
                stateId = graduateTracingAdmin.getState().getId();
            else if (graduateTracingAdmin.getSchool() != null)
                stateId = graduateTracingAdmin.getSchool().getCity().getState().getId();
        }*/

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if ( adminUserScope != null ) {
            stateId = catalogQueries.getSearchAndComparabilityTheStateById(stateId,userAdmin);
        }

        CatState state = stateQueries.getById(stateId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,userAdmin,AppCatalogs.isState);

        List<SurveyReportStateSchool> surveys = new ArrayList<>();
        if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2020)) {
            surveys = surveyIntentions2020Queries.getStateReport(state, availableSchoolIds);
        } else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2020)) {
            surveys = surveyGraduated2020Queries.getStateReport(state, availableSchoolIds);
        } else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2021)) {
            surveys = surveyIntentions2021Queries.getStateReport(state, availableSchoolIds);
        }
        //codigo eugenio
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2021)) {
            surveys = surveyGraduated2021Queries.getStateReport(state, availableSchoolIds);
        }
        else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2022)) {
            surveys = surveyIntentions2022Queries.getStateReport(state, availableSchoolIds);
        }
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2022)) {
            surveys = surveyGraduated2022Queries.getStateReport(state, availableSchoolIds);
        }
        return new SurveyReportState(state.getId(), state.getName(), surveys);
    }

    public SurveyReportSchool getSchoolReport(Integer surveyType, Integer schoolId, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        /*GraduateTracingAdmin graduateTracingAdmin = userAdmin.getGraduateTracingAdmin();

        if (graduateTracingAdmin != null)
            if (graduateTracingAdmin.getSchool() != null)
                schoolId = graduateTracingAdmin.getSchool().getId();*/

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if ( adminUserScope != null ) {
            schoolId = catalogQueries.getSearchAndComparabilityTheSchoolById(schoolId,userAdmin);
        }

        School school = schoolSearchQueries.getSchoolById(schoolId);
        List<SurveyReportStudent> students = new ArrayList<>();
        if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2020))
            students = surveyIntentions2020Queries.getSchoolReport(schoolId);
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2020))
            students = surveyGraduated2020Queries.getSchoolReport(schoolId);
        else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2021))
            students = surveyIntentions2021Queries.getSchoolReport(schoolId);
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2021))
            students = surveyGraduated2021Queries.getSchoolReport(schoolId);
        else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2022))
            students = surveyIntentions2022Queries.getSchoolReport(schoolId);
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2022))
            students = surveyGraduated2022Queries.getSchoolReport(schoolId);
        return new SurveyReportSchool(schoolId, school.getCct(), school.getName(), students);
    }

    public SurveyReportStateAnswer getStateReportAnswer(Integer surveyType, Integer stateId, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        /*GraduateTracingAdmin graduateTracingAdmin = userAdmin.getGraduateTracingAdmin();

        if (graduateTracingAdmin != null) {
            if (graduateTracingAdmin.getState() != null)
                stateId = graduateTracingAdmin.getState().getId();
            else if (graduateTracingAdmin.getSchool() != null)
                stateId = graduateTracingAdmin.getSchool().getCity().getState().getId();
        }*/

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if ( adminUserScope != null ) {
            stateId =catalogQueries.getSearchAndComparabilityTheStateById(stateId,userAdmin);
            //stateId = catalogQueries.getStateId(userAdmin);
        }
        CatState state = stateQueries.getById(stateId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,userAdmin,AppCatalogs.isState);
        List<SurveyReportStateSchoolAnswer> surveys = new ArrayList<>();
        if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2020)) {
            //surveys = surveyIntentions2020Queries.getStateReport(state, availableSchoolIds);
        } else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2020)) {
            //surveys = surveyGraduated2020Queries.getStateReport(state, availableSchoolIds);
        } else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2021)) {
            surveys = surveyIntentions2021Queries.getStateReportAnswer(state, availableSchoolIds);
        }else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2022)) {
            surveys = surveyIntentions2022Queries.getStateReportAnswer(state, availableSchoolIds);
        }
        return new SurveyReportStateAnswer(state.getId(), state.getName(), surveys);
    }

    public SurveyReportAnswerGraduated getStateReportAnswerGraduated(Integer surveyType, Integer stateId, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        if (stateId == 0) {
            //stateId = userAdmin.getGraduateTracingAdmin().getState().getId();
            stateId =catalogQueries.getSearchAndComparabilityTheStateById(stateId,userAdmin);
        }
        /*GraduateTracingAdmin graduateTracingAdmin = userAdmin.getGraduateTracingAdmin();

        if (graduateTracingAdmin != null) {
            if (graduateTracingAdmin.getState() != null)
                stateId = graduateTracingAdmin.getState().getId();
            else if (graduateTracingAdmin.getSchool() != null)
                stateId = graduateTracingAdmin.getSchool().getCity().getState().getId();
        }*/
        CatState state = stateQueries.getById(stateId);
        //Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUser(userAdmin);
        List<SurveyReportStateAnswerGraduated> surveys = new ArrayList<>();
        if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2021)) {
            surveys = surveyGraduated2021Queries.getStateReportAnswer(stateId);
        }
        if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2022)) {
            surveys = surveyGraduated2022Queries.getStateReportAnswer(stateId);
        }
        return new SurveyReportAnswerGraduated(state.getId(), state.getName(), surveys);
    }

    public SurveyGraduated2021Request getAnswerGraduated(String curp, Integer adminId){
        Student student=studentQueries.getStudentByUsername(curp);
        Integer idstudent=student.getId();
        SurveyGraduated2021 graduated2021=surveyGraduated2021Queries.getById(idstudent);
        return new SurveyGraduated2021Request(graduated2021);
    }

    public SurveyIntentions2021Request getAnswerIntentions(String curp, Integer adminId){
        Student student=studentQueries.getStudentByUsername(curp);
        Integer idstudent=student.getId();
        SurveyIntentions2021 intentions2021=surveyIntentions2021Queries.getById(idstudent);
        return new SurveyIntentions2021Request(intentions2021);
    }
    public SurveyIntentions2020Request getAnswerIntentionsUno(String curp, Integer adminId){
        Student student=studentQueries.getStudentByUsername(curp);
        Integer idstudent=student.getId();
        SurveyIntentions2020 intentions2020=surveyIntentions2020Queries.getById(idstudent);
        return new SurveyIntentions2020Request(intentions2020);
    }
    public SurveyGraduated2020Request getAnswerGraduatedUno(String curp, Integer adminId){
        Student student=studentQueries.getStudentByUsername(curp);
        Integer idstudent=student.getId();
        SurveyGraduated2020 graduated2020=surveyGraduated2020Queries.getById(idstudent);
        return new SurveyGraduated2020Request(graduated2020);
    }
}
