package mx.edu.cecyte.sisec.repo.degree.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DegreeReasonRepository extends JpaRepository<CatDegreeReason, Integer> {
}
