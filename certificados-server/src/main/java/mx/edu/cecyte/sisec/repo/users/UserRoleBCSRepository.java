package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.UserRoleBCS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleBCSRepository extends JpaRepository< UserRoleBCS, Integer> {
}
