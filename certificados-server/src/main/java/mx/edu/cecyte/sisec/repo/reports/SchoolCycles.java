package mx.edu.cecyte.sisec.repo.reports;

import mx.edu.cecyte.sisec.model.reports.SchoolCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolCycles extends JpaRepository<SchoolCycle, Integer> {
}
