package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    @Query("SELECT r FROM Role r WHERE r.name=:roleName")
    Role selectRoleName(String roleName);
}
