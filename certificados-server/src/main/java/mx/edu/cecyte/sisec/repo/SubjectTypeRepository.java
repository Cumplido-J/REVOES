package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectTypeRepository extends JpaRepository<CatSubjectType, Integer> {


    Integer countById(int id);
}
