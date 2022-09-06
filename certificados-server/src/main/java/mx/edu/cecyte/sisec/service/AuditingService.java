package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.queries.AuditingQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditingService {
    @Autowired private AuditingQueries auditingQueries;

}
