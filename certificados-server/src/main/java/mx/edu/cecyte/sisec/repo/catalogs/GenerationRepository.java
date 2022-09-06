package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.CatGeneration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GenerationRepository extends JpaRepository<CatGeneration, Integer> {
    @Query("SELECT cg " +
            "FROM CatGeneration cg " +
            "WHERE cg.generation=:generation")
    CatGeneration findCatGeneration(String generation);
}
