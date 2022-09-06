package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerModuleRepository extends JpaRepository<CareerModule, Integer> {

    Integer countByModuleAndCareer( Module module, Career career);
    Integer countByModuleAndCareerAndIdNot(Module module, Career career,Integer id);
    Integer countByCareer(Career career);
    @Query ("SELECT careerModule " +
            "FROM CareerModule careerModule " +
            "WHERE careerModule.id IN :module ")
    List<CareerModule> findListByModule( List<Integer> module);

}
