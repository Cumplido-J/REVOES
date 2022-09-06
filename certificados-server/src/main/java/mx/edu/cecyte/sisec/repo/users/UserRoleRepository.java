package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.model.users.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
    @Query("SELECT ur " +
            "FROM UserRole ur " +
            "JOIN ur.role r " +
            "WHERE r.id = 1")
    List<UserRole> findAllDev();

    List<UserRole> findAllByRole(Role role);

    @Query("SELECT COUNT(*) " +
            "FROM UserRole ur " +
            "WHERE ur.user.id=:studentId")
    Integer countUserRol(Integer studentId);

}
