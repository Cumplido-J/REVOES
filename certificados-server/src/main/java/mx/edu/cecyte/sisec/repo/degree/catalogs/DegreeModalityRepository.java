package mx.edu.cecyte.sisec.repo.degree.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeModality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DegreeModalityRepository extends JpaRepository<CatDegreeModality, Integer> {
}
