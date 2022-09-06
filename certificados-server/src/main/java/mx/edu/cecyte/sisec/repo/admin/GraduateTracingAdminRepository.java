package mx.edu.cecyte.sisec.repo.admin;

import mx.edu.cecyte.sisec.model.users.GraduateTracingAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/*@Repository
public interface GraduateTracingAdminRepository extends JpaRepository<GraduateTracingAdmin, Integer> {

    @Query("SELECT admin " +
            "FROM GraduateTracingAdmin admin " +
            "WHERE (  :stateId = 0 OR ( admin.state IS NOT NULL AND admin.state.id = :stateId ) )  " +
            "AND ( :schoolId = 0 OR ( admin.school IS NOT NULL AND admin.school.id = :schoolId ) )"+
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<GraduateTracingAdmin> findByStateIdOrSchoolIdAndRole( Integer stateId, Integer schoolId, Integer role);

    @Query("SELECT admin " +
            "FROM GraduateTracingAdmin admin " +
            "WHERE admin.user.userRolesBCS.rolebcs.id =:role")
    List<GraduateTracingAdmin> findByStateAndSchoolAndRole(Integer role);

    @Query("SELECT admin " +
            "FROM GraduateTracingAdmin admin " +
            "WHERE  admin.state.id = :stateId " +
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<GraduateTracingAdmin> findByStateAndRole(Integer stateId,Integer role);

    @Query("SELECT admin " +
            "FROM GraduateTracingAdmin admin " +
            "WHERE  admin.school.city.state.id = :stateId "+
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<GraduateTracingAdmin> findByStateAndRole2(Integer stateId,Integer role);

    @Query("SELECT admin " +
            "FROM GraduateTracingAdmin admin " +
            "WHERE  admin.school.id = :schoolId "+
            "AND admin.user.userRolesBCS.rolebcs.id =:role")
    List<GraduateTracingAdmin> findBySchoolAndRole(Integer schoolId ,Integer role);
}*/

