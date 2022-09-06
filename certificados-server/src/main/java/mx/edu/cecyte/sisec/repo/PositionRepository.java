package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PositionRepository extends JpaRepository<CatPosition, Integer> {
}
