package mx.edu.cecyte.sisec.repo.siged;

import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MecCredentialsRepository extends JpaRepository<MecCredentials, Integer> {
    List<MecCredentials> findByState(CatState state);
}
