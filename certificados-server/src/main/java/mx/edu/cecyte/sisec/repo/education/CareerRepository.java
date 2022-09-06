package mx.edu.cecyte.sisec.repo.education;

import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerRepository extends JpaRepository<Career, Integer> {
    Optional<Career> findByCareerKey(String careerKey);

 //   @Query("SELECT c " +
   //         "FROM Career c " +
     //       "WHERE c.id = :id ")
    Career findByIdOrderByCareerModulesOrderDesc(Integer  id);

    Integer countByCareerKey(String careerKey);
}
