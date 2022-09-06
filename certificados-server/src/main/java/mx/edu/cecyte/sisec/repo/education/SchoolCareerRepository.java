package mx.edu.cecyte.sisec.repo.education;

import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolCareerRepository extends JpaRepository<SchoolCareer, Integer> {

    @Query("SELECT schoolCareer " +
            "FROM SchoolCareer schoolCareer " +
            "WHERE schoolCareer.school.id = :schoolId " +
            "AND schoolCareer.career.id = :careerId")
    Optional<SchoolCareer> getBySchoolIdAndCareerId(Integer schoolId, Integer careerId);

    @Query("SELECT schoolCareer " +
            "FROM SchoolCareer schoolCareer " +
            "WHERE schoolCareer.career.id IN :career "+
            "AND schoolCareer.school.id = :id")
    List<SchoolCareer> findListByCareer(List<Integer> career, Integer id);

    @Query("SELECT schoolCareer " +
            "FROM SchoolCareer schoolCareer " +
            "WHERE schoolCareer.school.cct = :cct")
    List<SchoolCareer> findListBySchool(String cct);

    @Query("SELECT schoolCareer " +
            "FROM SchoolCareer schoolCareer " +
            "WHERE schoolCareer.school.cct = :schoolCCT " +
            "AND schoolCareer.career.careerKey = :careerKEY")
    Optional<SchoolCareer> getBySchoolIdAndCareerIdByCCTAndClave(String schoolCCT, String careerKEY);

    @Query("SELECT COUNT(schoolCareer) " +
            "FROM SchoolCareer schoolCareer " +
            "WHERE schoolCareer.school.cct = :schoolCCT " +
            "AND schoolCareer.career.careerKey = :careerKEY " +
            "AND schoolCareer.school.city.state.id = :stateId")
    Integer getBySchoolIdAndCareerIdAndState(String schoolCCT, String careerKEY, Integer stateId);

    @Query("SELECT sc " +
            "FROM SchoolCareer sc " +
            "WHERE sc.school.cct=:cct AND sc.career.careerKey=:claveCareer")
    SchoolCareer findByCctAndClaveCareer(String cct, String claveCareer);
}
