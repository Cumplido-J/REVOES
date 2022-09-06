package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.dashboard.*;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.users.AdminUserScope;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.queries.degree.DegreeQueries;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class DashboardService {
    @Autowired private SurveyIntentions2021Queries queries;
    @Autowired private CertifiedReportQueries certifiedReportQueries;
    @Autowired private SurveyIntentions2020Queries surveyIntentions2020Queries;
    @Autowired private SurveyGraduated2020Queries surveyGraduated2020Queries;
    @Autowired private SurveyGraduated2021Queries surveyGraduated2021Queries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SchoolSearchQueries schoolQueries;
    @Autowired private UserQueries userQueries;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private StateQueries stateQueries;
    @Autowired private DegreeQueries degreeQueries;
    //info new Generation
    public List<CountNew> getCountNewGeneration(Integer idstate,Integer idschool, Integer adminId) {
        List<CountNew> rest = new ArrayList<>();
        if(idstate!=0 && idschool==0){
            rest = studentQueries.getConteoState(idstate);
        }
        else if(idschool!=0 && idstate==0){
            rest = studentQueries.getConteoSchool(idschool);
        }
        else if(idschool!=0 && idstate!=0){
            rest = studentQueries.getConteoStateAndSchool(idstate,idschool);
        }
        else{
            rest = studentQueries.getConteo();
        }
        return rest;
    }
    public List<CountCertified> getCountCertified(Integer idstate, Integer idschool,Integer adminId) {
        List<CountCertified> rest = new ArrayList<>();
        if(idstate!=0 && idschool==0){
            rest = certifiedReportQueries.getCountCertifiedState(idstate);
        }
        else if(idschool!=0 && idstate!=0){
            rest = certifiedReportQueries.getCountCertifiedStateAndSchool(idschool,idstate);
        }
        else if(idschool!=0 && idstate==0){
            rest = certifiedReportQueries.getCountCertifiedSchoolById(idschool);
        }
        else {
            rest = certifiedReportQueries.getCountCertified();
        }

        return rest;
    }


    public Integer getTotal2(String question,String gender,Integer idestado,Integer idschool, Integer surveyType,Integer adminId){
        //Integer tt;
        Integer rest=0;
        if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2021)) {
            if(idestado!=0 && idschool==0){
                rest= queries.getCountByQuestionState(question,gender,idestado);
            }else if(idschool!=0 && idestado!=0){
                rest=queries.getCountByQuestionStateAndSchool(question,gender,idschool,idestado);
            }
            else if(idestado==0 && idschool!=0){
                rest=queries.getCountByQuestionSchool(question,gender,idschool);
            }else{
                rest= queries.getCountByQuestion(question,gender);
            }
        }
        else if(surveyType.equals(AppCatalogs.SURVEY_GRADUATED2020)){
            if(idestado!=0 && idschool==0){
                rest= surveyGraduated2020Queries.getCountByQuestionState(question,gender,idestado);
            }else if(idestado==0 && idschool!=0){
                rest=surveyGraduated2020Queries.getCountByQuestionSchool(question,gender,idschool);
            }
            else if(idestado!=0 && idschool!=0){
                rest=surveyGraduated2020Queries.getCountByQuestionStateAndSchool(question,gender,idschool,idestado);
            }
            else{
                rest= surveyGraduated2020Queries.getCountByQuestion(question,gender);
            }
        }
        else if(surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2020)){
            if(idestado!=0 && idschool==0){
                rest= surveyIntentions2020Queries.getCountByQuestionState(question,gender,idestado);
            } else if(idschool!=0 && idestado==0 ){
                rest=surveyIntentions2020Queries.getCountByQuestionSchool(question,gender,idschool);
            }
            else if(idschool!=0 && idestado!=0 ){
                rest=surveyIntentions2020Queries.getCountByQuestionStateAndSchool(question,gender,idschool,idestado);
            }
            else{
                rest= surveyIntentions2020Queries.getCountByQuestion(question,gender);
            }

        }
        else if(surveyType.equals(AppCatalogs.SURVEY_GRADUATED2021)){
            if(idestado!=0 && idschool==0){
                rest= surveyGraduated2021Queries.getCountByQuestionState(question,gender,idestado);
            }
            else if(idschool!=0 && idestado==0){
                rest=surveyGraduated2021Queries.getCountByQuestionSchool(question,gender,idschool);
            }
            else if(idschool!=0 && idestado!=0){
                rest=surveyGraduated2021Queries.getCountByQuestionStateAndSchool(question,gender,idschool,idestado);
            }
            else{
                rest= surveyGraduated2021Queries.getCountByQuestion(question,gender);
            }
        }
        return rest;

    }
    //certificados

    //consultas para mapa

    public List<ReportCountry> getMexicoReport(Integer surveyType,String username) {
        User userAdmin = userQueries.getUserByUsername(username);
        List<ReportCountry> surveys = new ArrayList<>();

        if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2020)) {
            surveys = surveyIntentions2020Queries.getMexicoReport(userAdmin);
        } else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2020)) {
            surveys = surveyGraduated2020Queries.getMexicoReport(userAdmin);
        } else if (surveyType.equals(AppCatalogs.SURVEY_INTENTIONS2021)) {
            surveys = queries.getMexicoReport(userAdmin);
        }
        else if (surveyType.equals(AppCatalogs.SURVEY_GRADUATED2021)) {
            surveys = surveyGraduated2021Queries.getMexicoReport(userAdmin );
        }
        return surveys;
    }
    ///lista de escuelas
    public List<SchoolList> getListSchool(Integer idstate,Integer schoolId){
        List<SchoolList> result = new ArrayList<>();
        //result=schoolQueries.getSchools();
        if(idstate!=0 && schoolId==0){
            result=schoolQueries.getStateSchool(idstate);
        }
        else if(schoolId!=0 && idstate!=0){
            result=schoolQueries.getStateSchoolById(idstate,schoolId);
        }
        else if(idstate==0 && schoolId==0){
            result=schoolQueries.getSchools();
        }
        else if(idstate==0 && schoolId!=0){
            result=schoolQueries.getLatitudeSchoolById(schoolId);
        }
        return result;
    }
    public List<TotalList> getCountCertifiedBy(Integer idstate, Integer idschool, Integer adminId) {
        List<TotalList> rest = new ArrayList<>();
        if(idstate!=0 && idschool==0){
            rest = certifiedReportQueries.getCountCertifiedStateHM(idstate);
        }
        else if(idschool!=0 && idstate!=0){
            rest = certifiedReportQueries.getCountCertifiedStateAndSchoolHM(idschool,idstate);
        }
        else if(idschool!=0 && idstate==0){
            rest = certifiedReportQueries.getCountCertifiedSchoolHM(idschool);
        }
        else {
            rest = certifiedReportQueries.getCountCertifiedHM();
        }

        return rest;
    }

    public List<TotalList> getCountDegreedBy(Integer idstate, Integer idschool, Integer adminId) {
        List<TotalList> rest = new ArrayList<>();
        if(idstate!=0 && idschool==0){
            rest = degreeQueries.getCountDegreedHMByState(idstate);
        }
        else if(idschool!=0 && idstate!=0){
            rest = degreeQueries.getCountDegreedHMByStateAndSchool(idschool,idstate);
        }
        else if(idschool!=0 && idstate==0){
            rest = degreeQueries.getCountDegreedHMBySchool(idschool);
        }
        else {
            rest = degreeQueries.getCountDegreedHM();
        }

        return rest;
    }
}
