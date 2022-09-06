package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.model.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    Integer countByUsername(String username);
    Integer countByUsernameAndIdNot(String username, int id);

    @Query("SELECT u " +
            "FROM User u " +
            "JOIN u.student s " +
            "WHERE u.password = :temporalPassword")
    List<User> getStudentsWithTemporalPassword(String temporalPassword);

    @Query("SELECT COUNT(u) " +
            "FROM User u " +
            "JOIN u.student s " +
            "WHERE u.password = :temporalPassword")
    Integer getStudentsWithTemporalPasswordCount(String temporalPassword);

    @Modifying
    @Query("UPDATE User u " +
            "set u.name = :name, u.firstLastName = :firstLastName, u.secondLastName = :secondLastName " +
            "WHERE u.id = :id")
    void updateFullName(@Param("name") String name, @Param("firstLastName") String firstLastName, @Param("secondLastName") String secondLastName, Integer id);

    @Query("SELECT COUNT(u) " +
            "FROM User u " +
            "WHERE u.username = :username AND u.status = :status")
    Integer coutByUsernameIsActive(String username, Integer status);
}
