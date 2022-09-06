package mx.edu.cecyte.sisec.repo.education;

import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.SchoolEquivalent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolEquivalentRepository extends JpaRepository<SchoolEquivalent, Integer> {
    Optional<SchoolEquivalent> findByCct(String cct);
    Integer countByCct(String cct);

    @Query("SELECT equivalent " +
            "FROM SchoolEquivalent equivalent " +
            "WHERE equivalent.school.id = :schoolId")
    SchoolEquivalent findBySchool(Integer schoolId);

    @Query("SELECT COUNT(*) " +
            "FROM SchoolEquivalent equivalent " +
            "WHERE equivalent.school.id = :schoolId")
    Integer ifexistSchool(Integer schoolId);

    Integer countBySchool( School school);
}
