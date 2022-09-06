package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.education.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository< Module,Integer> {
    Optional<Module> findByModule( String module);
    Integer countByModule(String module);
    Integer countByModuleAndIdNot(String module, int id);

}
