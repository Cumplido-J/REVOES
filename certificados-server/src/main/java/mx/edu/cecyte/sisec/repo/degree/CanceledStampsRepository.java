package mx.edu.cecyte.sisec.repo.degree;

import mx.edu.cecyte.sisec.model.met.CanceledStamps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanceledStampsRepository extends JpaRepository<CanceledStamps, Integer> {
}
