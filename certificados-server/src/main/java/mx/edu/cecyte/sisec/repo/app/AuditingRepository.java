package mx.edu.cecyte.sisec.repo.app;

import mx.edu.cecyte.sisec.model.app.Auditing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditingRepository extends JpaRepository<Auditing, Integer> {

}
