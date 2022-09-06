package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.queries.AdminListQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminListService {
    @Autowired private AdminListQueries adminListQueries;
}
