package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.CatUserScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CatUserScopeRepository extends JpaRepository < CatUserScope, Integer> {

    Integer countByName(String name);

    Integer countByNameAndIdNot(String name,int id);
}
