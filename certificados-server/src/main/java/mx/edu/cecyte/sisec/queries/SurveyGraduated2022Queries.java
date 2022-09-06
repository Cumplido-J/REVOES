package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.survey.SurveyReportCountry;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportStateAnswerGraduated;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportStateSchool;
import mx.edu.cecyte.sisec.dto.survey.SurveyReportStudent;
import mx.edu.cecyte.sisec.model.catalogs.CatCity;
import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.student.studentinfo.StudentInfo;
import mx.edu.cecyte.sisec.model.student.studentinfo.StudentInfo_;
import mx.edu.cecyte.sisec.model.survey2022.SurveyGraduated2022;
import mx.edu.cecyte.sisec.model.survey2022.SurveyGraduated2022_;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.User_;
import mx.edu.cecyte.sisec.repo.SurveyGraduated2022Repository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class SurveyGraduated2022Queries {
    @Autowired private SurveyGraduated2022Repository graduated2022Repository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private EntityManager entityManager;
    private String generation = "2019-2022";

    public SurveyGraduated2022 saveSurvey(SurveyGraduated2022 surveyGraduated2022) {
        return graduated2022Repository.save(surveyGraduated2022);
    }

    public SurveyGraduated2022 getInfoFromFolio(String confirmationFolio) {
        return graduated2022Repository.findByConfirmationFolio(confirmationFolio);
    }

    public List<SurveyReportStateAnswerGraduated> getStateReportAnswer(Integer state) {
        /*List<SurveyReportStateAnswerGraduated> list = new ArrayList<>();
        List<SurveyReportStateAnswerGraduated> resul= selectSurveyGraduated(state);
        resul.forEach(r->{
            if (r.getCurp().charAt(10) == 'H') r.setGenero("Hombre");
            else if (r.getCurp().charAt(10) == 'M') r.setGenero("Mujer");
            list.add(new SurveyReportStateAnswerGraduated(r.getId(), r.getCct(), r.getPlantel(), r.getCurp(),
                    r.getCarrera(), r.getNombre(), r.getApellido_paterno(), r.getApellido_materno(), r.getGenero(), r.getCorreo(), r.getNumeroTelefonico(),
                    r.getQ1(), r.getQ2(), r.getQ3(), r.getQ4(), r.getQ5(), r.getQ6(), r.getQ7(), r.getQ8(), r.getQ9(),
                    r.getQ10(), r.getQ11(), r.getQ12(), r.getQ13(), r.getQ14(), r.getQ15(), r.getQ16(),
                    r.isShareInformation(), r.isContinua_estudios(), r.getDiscapacidad(), r.getGrupo_etnico(), r.getIdioma(), r.getLengua(),
                    r.isEmprendimiento(), r.isEmprendimiento_carrera(), r.isEmprendimiento_derivado(), r.getEmprendimiento_estatus(),
                    r.getExamen(), r.getHogar(), r.getPrograma()));
        });
        return list;*/
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SurveyReportStateAnswerGraduated> criteriaQuery = builder.createQuery(SurveyReportStateAnswerGraduated.class);

        Root<SurveyGraduated2022> survey = criteriaQuery.from(SurveyGraduated2022.class);
        Join<SurveyGraduated2022, Student> student = survey.join(SurveyGraduated2022_.student);
        Join<Student, User> user = student.join(Student_.user);
        Join<Student, SchoolCareer> schoolCareer = student.join(Student_.schoolCareer);
        Join<SchoolCareer, School> school = schoolCareer.join(SchoolCareer_.school);
        Join<School, CatCity> city = school.join(School_.city);

        Join<Student, StudentInfo> studentInfo = student.join(Student_.studentInfo);

        predicates.add(builder.equal(city.get(CatCity_.state).get(CatState_.id), state));

        predicates.add(builder.equal(student.get(Student_.generation), generation));

        criteriaQuery.multiselect(
                user.get(User_.id),
                school.get(School_.cct),
                school.get(School_.name),
                user.get(User_.username),
                schoolCareer.get(SchoolCareer_.career).get(Career_.name),
                user.get(User_.name),
                user.get(User_.firstLastName),
                user.get(User_.secondLastName),
                builder.selectCase(builder.substring(user.get(User_.username), 11, 1)).when("H", "Hombre").when("M", "Mujer").otherwise("S/E"),
                builder.selectCase().when(builder.isNotNull(user.get(User_.email)), user.get(User_.email)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.phoneNumber)), studentInfo.get(StudentInfo_.phoneNumber)).otherwise(""),

                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q1)), survey.get(SurveyGraduated2022_.q1)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q2)), survey.get(SurveyGraduated2022_.q2)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q3)), survey.get(SurveyGraduated2022_.q3)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q4)), survey.get(SurveyGraduated2022_.q4)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q5)), survey.get(SurveyGraduated2022_.q5)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q6)), survey.get(SurveyGraduated2022_.q6)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q7)), survey.get(SurveyGraduated2022_.q7)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q8)), survey.get(SurveyGraduated2022_.q8)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q9)), survey.get(SurveyGraduated2022_.q9)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q10)), survey.get(SurveyGraduated2022_.q10)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q11)), survey.get(SurveyGraduated2022_.q11)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q12)), survey.get(SurveyGraduated2022_.q12)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q13)), survey.get(SurveyGraduated2022_.q13)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q14)), survey.get(SurveyGraduated2022_.q14)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q15)), survey.get(SurveyGraduated2022_.q15)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(survey.get(SurveyGraduated2022_.q16)), survey.get(SurveyGraduated2022_.q16)).otherwise(""),

                builder.selectCase(studentInfo.get(StudentInfo_.shareInformation)).when(true , "Si").when(false, "No").otherwise("No"),
                builder.selectCase(studentInfo.get(StudentInfo_.continueStudies)).when(true,  "Si").when(false, "No").otherwise(""),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.disability)), studentInfo.get(StudentInfo_.disability)).otherwise("No"),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.ethnicGroup)), studentInfo.get(StudentInfo_.ethnicGroup)).otherwise("No"),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.language)), studentInfo.get(StudentInfo_.language)).otherwise("No"),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.indigenousLangage)), studentInfo.get(StudentInfo_.indigenousLangage)).otherwise("No"),
                builder.selectCase(studentInfo.get(StudentInfo_.entrepreneurship)).when(true, "Si").when(false, "No").otherwise(""),
                builder.selectCase(studentInfo.get(StudentInfo_.entrepreneurshipCareer)).when(true, "Si").when(false, "No").otherwise(""),
                builder.selectCase(studentInfo.get(StudentInfo_.entrepreneurshipDerivated)).when(true, "Si").when(false, "No").otherwise(""),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.entrepreneurshipStatus)), studentInfo.get(StudentInfo_.entrepreneurshipStatus)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.exam)), studentInfo.get(StudentInfo_.exam)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.home)), studentInfo.get(StudentInfo_.home)).otherwise(""),
                builder.selectCase().when(builder.isNotNull(studentInfo.get(StudentInfo_.program)), studentInfo.get(StudentInfo_.program)).otherwise("")
        );

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SurveyReportStateAnswerGraduated> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<SurveyReportCountry> getCountryReport(User userAdmin) {
        List<SurveyReportCountry> result = new ArrayList<>();
        List<CatState> states = catalogQueries.getAllStateModel(userAdmin);

        // List<CatState> states = stateRepository.findAll();
        for (CatState state : states) {
            Integer stateId = state.getId();
            String stateName = state.getName();
            Integer totalSurveys = graduated2022Repository.countByStateId(stateId);
            Integer totalStudents = studentRepository.countActiveByStateId(stateId, generation);
            double percentage = 0;
            if (totalSurveys > totalStudents) totalSurveys = totalStudents;
            if (totalStudents > 0) {
                percentage = totalSurveys.doubleValue() / totalStudents.doubleValue();
            }
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
            Integer totalSurveys = graduated2022Repository.countBySchoolId(schoolId);
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

        Join<Student, SurveyGraduated2022> survey = student.join(Student_.surveyGraduated2022, JoinType.LEFT);
        criteriaQuery.select(builder.construct(
                SurveyReportStudent.class,
                student.get(Student_.user).get(User_.username),
                student.get(Student_.user).get(User_.name),
                student.get(Student_.user).get(User_.firstLastName),
                student.get(Student_.user).get(User_.secondLastName),
                builder.selectCase()
                        .when(builder.isNull(survey.get(SurveyGraduated2022_.id)), false)
                        .otherwise(true)
        ));

        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<SurveyReportStudent> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }
}
