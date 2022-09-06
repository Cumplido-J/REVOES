package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.survey2022.SurveyGraduated2022;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyGraduated2022Repository extends JpaRepository<SurveyGraduated2022, Integer> {
    SurveyGraduated2022 findByConfirmationFolio(String confirmationFolio);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyGraduated2022 survey " +
            "WHERE survey.student.schoolCareer.school.city.state.id = :stateId")
    Integer countByStateId(Integer stateId);

    @Query("SELECT COUNT(survey) " +
            "FROM SurveyGraduated2022 survey " +
            "WHERE survey.student.schoolCareer.school.id = :schoolId")
    Integer countBySchoolId(Integer schoolId);
}
