package mx.edu.cecyte.sisec.repo.siged;
import mx.edu.cecyte.sisec.model.siged.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Integer>{
    Optional<Certification> findByFolio(String folio);
}
