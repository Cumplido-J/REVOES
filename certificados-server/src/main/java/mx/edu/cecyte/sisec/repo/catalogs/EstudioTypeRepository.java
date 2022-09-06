package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.CatStudyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudioTypeRepository extends JpaRepository<CatStudyType, Integer>{
    @Query("SELECT s FROM CatStudyType s WHERE s.id = 29 OR s.id = 30")
    List<CatStudyType>findAll();
}
