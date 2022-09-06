package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.CatSchoolCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatSchoolCycleRepository extends JpaRepository< CatSchoolCycle, Integer > {

    List< CatSchoolCycle > findAllByStatus(boolean status);
}
