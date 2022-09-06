package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.users.ScopeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScopeDetailRepository extends JpaRepository < ScopeDetail, Integer> {

    //Integer countByName(String name);

    //Integer countByNameAndIdNot(String name,int id);
    Integer countByStateAndSchool( CatState state, School school);
    Integer countByStateAndSchoolAndIdNot( CatState state, School school, Integer id);
    List< ScopeDetail > findByIdNotIn( List< Integer > id );

    List< ScopeDetail > findAllByCatUserScopeIsNull();
    List< ScopeDetail > findAllByCatUserScopeIsNullAndIdNotIn(List< Integer > id);

    List< ScopeDetail > findAllByState(CatState state);
    List< ScopeDetail > findAllByStateAndSchool(CatState state,School school);
}
