package mx.edu.cecyte.sisec.repo.admin;

import mx.edu.cecyte.sisec.model.users.SchoolControlAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/*@Repository
public interface SchoolControlAdminRepository extends JpaRepository<SchoolControlAdmin, Integer> {
    @Query("SELECT admin " +
            "FROM SchoolControlAdmin admin " +
            "WHERE (  :stateId = 0 OR ( admin.state IS NOT NULL AND admin.state.id = :stateId ) )  " +
            "AND ( :schoolId = 0 OR ( admin.school IS NOT NULL AND admin.school.id = :schoolId ) )")
    List<SchoolControlAdmin> findByStateIdOrSchoolId(Integer stateId, Integer schoolId);

    @Query("SELECT admin " +
            "FROM SchoolControlAdmin admin " +
            "WHERE admin.user.userRolesBCS.rolebcs.id =:role")
    List<SchoolControlAdmin> findByStateAndSchoolAndRole(Integer role);

    @Query("SELECT admin " +
            "FROM SchoolControlAdmin admin " +
            "WHERE  admin.state.id = :stateId " +
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<SchoolControlAdmin> findByStateAndRole(Integer stateId,Integer role);

    @Query("SELECT admin " +
            "FROM SchoolControlAdmin admin " +
            "WHERE  admin.school.city.state.id = :stateId "+
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<SchoolControlAdmin> findByStateAndRole2(Integer stateId,Integer role);

    @Query("SELECT admin " +
            "FROM SchoolControlAdmin admin " +
            "WHERE  admin.school.id = :schoolId "+
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<SchoolControlAdmin> findBySchoolAndRole(Integer schoolId ,Integer role);
}*/
