package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.model.app.Auditing;
import mx.edu.cecyte.sisec.repo.app.AuditingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditingQueries {
    @Autowired private AuditingRepository auditingRepository;

    public void saveAudit(String callerClass, String callerMethod, Integer userIdCaller, Class<?> affectedTable, Integer affectedTableId, String description) {
        Auditing auditing = new Auditing(callerClass, callerMethod, userIdCaller, affectedTable.getSimpleName(), affectedTableId, description);
        auditingRepository.save(auditing);
    }

    public void saveAudits(String callerClass, String callerMethod, Integer userIdCaller, Class<?> affectedTable, List<Integer> affectedTableIds, String description) {
        List<Auditing> auditings = affectedTableIds.parallelStream()
                .map(affectedTableId -> new Auditing(callerClass, callerMethod, userIdCaller, affectedTable.getSimpleName(), affectedTableId, description))
                .collect(Collectors.toList());
        auditingRepository.saveAll(auditings);
    }
}
