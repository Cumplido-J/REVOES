package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {
    @Autowired private UserQueries userQueries;
    @Autowired private AuditingQueries auditingQueries;

    public void updateTemporalPasswords(Integer adminId) {
        List<User> studentsWithTemporalPassword = userQueries.getStudentsWithTemporalPassword();
        userQueries.updateTemporalPasswords(studentsWithTemporalPassword);
        List<Integer> usersId = studentsWithTemporalPassword.parallelStream().map(User::getId).collect(Collectors.toList());
        auditingQueries.saveAudits("AdminService", "updateTemporalPasswords", adminId, User.class, usersId, "Updated temporal password.");
    }

    public Integer getStudentsWithTemporalPasswordCount() {
        return userQueries.getStudentsWithTemporalPasswordCount();
    }
}
