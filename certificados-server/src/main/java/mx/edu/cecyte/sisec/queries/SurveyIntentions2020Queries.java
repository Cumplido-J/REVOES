package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.dashboard.ReportCountry;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportCountry;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportStateSchool;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportStudent;
import mx.edu.cecyte.sisec.model.SurveyIntentions2021;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.SchoolCareer_;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.survey2020.SurveyIntentions2020;
import mx.edu.cecyte.sisec.model.survey2020.SurveyIntentions2020_;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.User_;
import mx.edu.cecyte.sisec.repo.SurveyIntentions2020Repository;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class SurveyIntentions2020Queries {
    @Autowired private SurveyIntentions2020Repository surveyIntentions2020Repository;
    @Autowired private StateRepository stateRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private EntityManager entityManager;

    private String generation = "2017-2020";

    public List<SurveyReportCountry> getCountryReport( User user ) {
        List<SurveyReportCountry> result = new ArrayList<>();
        List<CatState> states = catalogQueries.getAllStateModel(user);
        //List<CatState> states = stateRepository.findAll();
        for (CatState state : states) {
            Integer stateId = state.getId();
            String stateName = state.getName();
            Integer totalSurveys = surveyIntentions2020Repository.countByStateId(stateId);
            Integer totalStudents = studentRepository.countActiveByStateId(stateId, generation);
            double percentage = 0;

            if (totalSurveys > totalStudents) totalSurveys = totalStudents;
            if (totalStudents > 0)
                percentage = totalSurveys.doubleValue() / totalStudents.doubleValue();

            result.add(new SurveyReportCountry(stateId, stateName, totalSurveys, totalStudents, percentage * 100));
        }

        return result;
    }

    public List<SurveyReportStateSchool> getStateReport(CatState state, Set<Integer> availableSchoolIds) {
        List<SurveyReportStateSchool> result = new ArrayList<>();

        List<School> schools = schoolRepository.findAllByIdAndStateIdAndStatus(state.getId(), availableSchoolIds);
        for (School school : schools) {
            Integer schoolId = school.getId();
            String cct = school.getCct();
            String schoolName = school.getName();
            Integer totalSurveys = surveyIntentions2020Repository.countBySchoolId(schoolId);
            Integer totalStudents = studentRepository.countActiveBySchoolId(schoolId, generation);
            double percentage = 0;
            if (totalSurveys > totalStudents) totalSurveys = totalStudents;
            if (totalStudents > 0)
                percentage = totalSurveys.doubleValue() / totalStudents.doubleValue();

            result.add(new SurveyReportStateSchool(schoolId, cct, schoolName, totalSurveys, totalStudents, percentage * 100));
        }
        return result;
    }

    public List<SurveyReportStudent> getSchoolReport(Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SurveyReportStudent> criteriaQuery = builder.createQuery(SurveyReportStudent.class);

        Root<Student> student = criteriaQuery.from(Student.class);
        predicates.add(builder.equal(student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.id), schoolId));
        predicates.add(builder.equal(student.get(Student_.generation), generation));
        predicates.add(builder.equal(student.get(Student_.status), true));

        Join<Student, SurveyIntentions2020> survey = student.join(Student_.surveyIntentions2020, JoinType.LEFT);
        criteriaQuery.select(builder.construct(
                SurveyReportStudent.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                builder.selectCase()

                        .when(builder.isNull(survey.get(SurveyIntentions2020_.id)), false)
                        .otherwise(true)
        ));

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SurveyReportStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }
    public SurveyIntentions2020 getById(Integer id){
        return surveyIntentions2020Repository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }
    public List<ReportCountry> getMexicoReport(User user) {
        List<ReportCountry> result = new ArrayList<>();

        //List<CatState> states = stateRepository.findAll();
        List<CatState> states = catalogQueries.getAllStateModel(user);
        for (CatState state : states) {
            Integer stateId = state.getId();
            String stateName = state.getName();
            String geomap = state.getGeoMap();
            Integer totalH = surveyIntentions2020Repository.countByStateIdAndGender(stateId,"H");
            Integer totalM = surveyIntentions2020Repository.countByStateIdAndGender(stateId,"M");
            result.add(new ReportCountry(geomap, stateName, totalH,totalM));
        }

        return result;
    }
    public Integer getCountByQuestion(String question,String gender){
        return surveyIntentions2020Repository.countByGenerationAndQ4AndGender(generation,question,gender);
    }
    public Integer getCountByQuestionState(String question,String gender,Integer stateId){
        return surveyIntentions2020Repository.countByGenerationAndQ4AndGenderAndStateId(generation,question,gender,stateId);
    }
    public Integer getCountByQuestionSchool(String question,String gender,Integer schoolId){
        return surveyIntentions2020Repository.countByGenerationAndQ4AndGenderAndSchoolId(generation,question,gender,schoolId);
    }
    public Integer getCountByQuestionStateAndSchool(String question,String gender,Integer schoolId,Integer stateId){
        return surveyIntentions2020Repository.countByGenerationAndQ4AndGenderAndStateAndSchoolId(generation,question,gender,schoolId,stateId);
    }
}
