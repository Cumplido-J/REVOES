package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.survey2022.SurveyIntentions2022;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyIntentions2022Repository extends JpaRepository<SurveyIntentions2022, Integer> {
    SurveyIntentions2022 findByConfirmationFolio(String confirmationFolio);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2022 survey " +
            "WHERE survey.student.schoolCareer.school.city.state.id = :stateId " +
            "AND survey.student.status = TRUE")
    Integer countByStateId(Integer stateId);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyIntentions2022 survey " +
            "WHERE survey.student.schoolCareer.school.id = :schoolId " +
            "AND survey.student.status = TRUE " +
            "AND survey.student.user.status = 1")
    Integer countBySchoolId(Integer schoolId);
}
