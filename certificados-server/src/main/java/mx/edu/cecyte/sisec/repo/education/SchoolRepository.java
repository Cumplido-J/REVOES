package mx.edu.cecyte.sisec.repo.education;

import mx.edu.cecyte.sisec.model.education.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface SchoolRepository extends JpaRepository<School, Integer> {

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.id IN :availableSchoolIds " +
            "AND school.city.state.id = :stateId " +
            "AND school.status = 1")
    List<School> findAllByIdAndStateIdAndStatus(Integer stateId, Set<Integer> availableSchoolIds);

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.id IN :availableSchoolIds " +
            "AND school.city.state.id = :stateId ")
    List<School> findAllByIdAndStateId(Integer stateId, Set<Integer> availableSchoolIds);

    Optional<School> findByCct(String cct);

    Integer countByCct(String cct);

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.city.state.id = :stateId ")
    List<School> findAllByStateId(Integer stateId);

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.latitude IS NOT NULL " +
            "AND school.city.state.id =:stateId " +
            "AND school.status = 1")
    List<School> findByStateId(Integer stateId);

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.latitude IS NOT NULL " +
            "AND school.city.state.id =:stateId " +
            "AND school.id =:schoolId " +
            "AND school.status = 1")
    List<School> findByStateIdAndSchoolId(Integer stateId,Integer schoolId);

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.latitude IS NOT NULL " +
            "AND school.status = 1")
    List<School> findByLatitude();

    @Query("SELECT school " +
            "FROM School school " +
            "WHERE school.latitude IS NOT NULL " +
            "AND school.id =:schoolId " +
            "AND school.status = 1")
    List<School> findByLatitudeAndSchoolId(Integer schoolId);
}
