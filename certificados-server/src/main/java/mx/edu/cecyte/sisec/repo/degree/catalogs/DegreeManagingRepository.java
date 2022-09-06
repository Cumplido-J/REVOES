package mx.edu.cecyte.sisec.repo.degree.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.degree.ManagingDirector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DegreeManagingRepository extends JpaRepository<ManagingDirector, Integer> {

}
