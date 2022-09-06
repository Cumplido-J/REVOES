package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.SurveyIntentions2021;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyIntentions2021Repository extends JpaRepository<SurveyIntentions2021, Integer> {
    SurveyIntentions2021 findByConfirmationFolio(String confirmationFolio);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.schoolCareer.school.city.state.id = :stateId " +
            "AND survey.student.status = TRUE")
    Integer countByStateId(Integer stateId);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.schoolCareer.school.id = :schoolId " +
            "AND survey.student.status = TRUE")
    Integer countBySchoolId(Integer schoolId);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.schoolCareer.school.city.state.id = :stateId " +
            "AND survey.student.status = TRUE " +
            "AND survey.student.gender = :gender")
    Integer countByStateIdAndGender(Integer stateId,String gender);
    ///nuevas consultas
    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.generation = :generation "+
            "AND survey.student.gender = :gender")
    Integer countByGenerationAndGender(String generation,String gender);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.generation = :generation "+
            "AND survey.q4  like :q4% " +
            "AND survey.student.gender = :gender")
    Integer countByGenerationAndQ4AndGender(String generation,String q4, String gender);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.generation = :generation "+
            "AND survey.q4  like :q4% " +
            "AND survey.student.gender = :gender " +
            "AND survey.student.schoolCareer.school.city.state.id = :stateId")
    Integer countByGenerationAndQ4AndGenderAndStateId(String generation,String q4, String gender,Integer stateId);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.generation = :generation "+
            "AND survey.q4 like :q4% " +
            "AND survey.student.gender = :gender " +
            "AND survey.student.schoolCareer.school.id = :schoolId")
    Integer countByGenerationAndQ4AndGenderAndSchoolId(String generation,String q4, String gender,Integer schoolId);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2021 survey " +
            "WHERE survey.student.generation = :generation "+
            "AND survey.q4 like :q4% " +
            "AND survey.student.gender = :gender " +
            "AND survey.student.schoolCareer.school.id = :schoolId " +
            "AND survey.student.schoolCareer.school.city.state.id = :stateId")
    Integer countByGenerationAndQ4AndGenderAndStateAndSchoolId(String generation,String q4, String gender,Integer schoolId,Integer stateId);


}
