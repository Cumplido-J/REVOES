package mx.edu.cecyte.sisec.repo.degree.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeCombinationDgp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DegreeCombinationDgpRepository extends JpaRepository<CatDegreeCombinationDgp, Integer> {
    @Query("SELECT cdcdgp " +
            "FROM CatDegreeCombinationDgp cdcdgp " +
            "WHERE cdcdgp.id=:combinationId")
    CatDegreeCombinationDgp findByIdDgp(Integer combinationId);
}
