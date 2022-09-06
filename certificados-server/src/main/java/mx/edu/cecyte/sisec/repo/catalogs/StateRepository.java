package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.CatState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateRepository extends JpaRepository<CatState, Integer> {
    @Query("SELECT s FROM CatState s WHERE s.id != 6 AND s.id != 9")
    List<CatState> findAll();
    @Query("SELECT state FROM CatState state WHERE state.id=:id")
    CatState findByStateId(Integer id);
}
