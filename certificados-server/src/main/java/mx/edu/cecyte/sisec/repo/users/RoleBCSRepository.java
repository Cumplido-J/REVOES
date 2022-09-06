package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.Permissions;
import mx.edu.cecyte.sisec.model.users.RolesBCS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleBCSRepository extends JpaRepository< RolesBCS,Integer> {

    Integer countByName(String name);

    Integer countByNameAndIdNot(String name,int id);

    Integer countById(Integer id);


}
