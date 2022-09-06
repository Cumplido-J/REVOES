package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.ConfigPeriodCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigPeriodCertificateRepository extends JpaRepository<ConfigPeriodCertificate, Integer> {
    @Query("SELECT COUNT(*) " +
            "FROM ConfigPeriodCertificate cpc " +
            "WHERE cpc.state.id=:stateId AND cpc.generation.generation=:generation")
    Integer isExistStateAndGeneration(Integer stateId, String generation);

    @Query("SELECT cpc " +
            "FROM ConfigPeriodCertificate cpc " +
            "WHERE cpc.state.id=:stateId AND cpc.generation.generation=:generation")
    ConfigPeriodCertificate selectPeriodFinished(Integer stateId, String generation);
}
