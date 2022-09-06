package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.ComponentPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComponentPermissionRepository extends JpaRepository< ComponentPermission, Integer > {
}
