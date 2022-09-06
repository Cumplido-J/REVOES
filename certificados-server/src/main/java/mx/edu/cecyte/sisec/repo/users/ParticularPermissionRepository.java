package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.ParticularPermission;
import mx.edu.cecyte.sisec.model.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticularPermissionRepository extends JpaRepository< ParticularPermission, Integer> {

    List<ParticularPermission> findByUserAndStatus( User user, boolean status);
}
