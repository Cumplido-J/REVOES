package mx.edu.cecyte.sisec.repo.degree.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeInstitute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DegreeInstituteRepository extends JpaRepository<CatDegreeInstitute, Integer> {
    @Query("SELECT institute " +
            "FROM CatDegreeInstitute institute " +
            "WHERE institute.id=:schoolId ")
    CatDegreeInstitute findSchoolById(Integer schoolId);

    @Query("SELECT COUNT(*) " +
            "FROM CatDegreeInstitute institute " +
            "WHERE institute.school.id=:schoolId ")
    Integer findCountSchoolById(Integer schoolId);
}
