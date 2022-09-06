package mx.edu.cecyte.sisec.repo.catalogs;

import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiciplinaryRepository extends JpaRepository< CatDisciplinaryField,Integer> {

    List< CatDisciplinaryField > findByStudyAreaIsNotNull();

    Integer countByIdAndStudyAreaIsNotNull(int id);

    @Query("SELECT COUNT(*) FROM CatDisciplinaryField cde WHERE cde.id=:id AND cde.studyArea != null")
    Integer isExistDiciplinary(Integer id);
    @Query("SELECT cde FROM CatDisciplinaryField cde WHERE cde.id=:id AND cde.studyArea != null")
    CatDisciplinaryField selectWhereId(Integer id);
}
