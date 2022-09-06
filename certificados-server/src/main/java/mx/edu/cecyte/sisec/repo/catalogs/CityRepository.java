package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.CatCity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends JpaRepository<CatCity, Integer> {
}
