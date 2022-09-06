package mx.edu.cecyte.sisec.repo.catalogs;
import mx.edu.cecyte.sisec.model.catalogs.CatProfileType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerfilTypeRepository extends JpaRepository<CatProfileType, Integer> {
    @Query("SELECT p FROM CatProfileType p WHERE p.id = 3 OR p.id = 5")
    List<CatProfileType>findAll();
}
