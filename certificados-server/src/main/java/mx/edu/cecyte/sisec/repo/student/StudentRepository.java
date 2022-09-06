package mx.edu.cecyte.sisec.repo.student;

import mx.edu.cecyte.sisec.dto.masiveload.Periods;
import mx.edu.cecyte.sisec.dto.masiveload.graduates.ObtieneId;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    @Query("SELECT student " +
            "FROM Student student " +
            "WHERE student.user.username = :username")
    Optional<Student> getByUsername(String username);

    @Query("SELECT student " +
            "FROM Student student " +
            "WHERE student.user.username IN :usernames")
    List<Student> findAllByUsername(List<String> usernames);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.schoolCareer.school.city.state.id = :stateId " +
            "AND student.status IS TRUE " +
            "AND student.generation = :generation")
    Integer countActiveByStateId(Integer stateId, String generation);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.schoolCareer.school.id = :schoolId " +
            "AND student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.user.status = 1 ")
    Integer countActiveBySchoolId(Integer schoolId, String generation);

    @Query("SELECT student " +
            "FROM Student student " +
            "WHERE student.schoolCareer.school.id = :schoolId " +
            "AND student.status IS TRUE " +
            "AND student.generation = :generation")
    List<Student> findActiveBySchoolId(Integer schoolId, String generation);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.school.city.state.id = :stateId " +
            "AND student.status IS TRUE")
    Integer countActiveByStateIdOld(Integer stateId);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.school.id = :schoolId " +
            "AND student.status IS TRUE")
    Integer countActiveBySchoolIdOld(Integer schoolId);

    //actualiza campos en la carga del excel masive load cte
    @Modifying
    @Query(value="UPDATE sisec.alumno " +
            "SET es_bach_tec=0, calificacion=:calificacion, reprobado=:reprobado, "+
            "semestre=6, periodo_inicio=:periodo_inicio, periodo_termino=:periodo_termino, generacion=:generacion " +
            "WHERE " +
            "usuario_id= :student_id", nativeQuery = true)
    int updateStudenForMasiveLoad(@Param("student_id")Integer student_id, @Param("calificacion")Double calificacion,
                                   @Param("reprobado") Boolean reprobado, @Param("periodo_inicio") String periodo_inicio,
                                   @Param("periodo_termino") String periodo_termino, @Param("generacion") String generacion);


    @Query("SELECT student " +
            "FROM Student student " +
            "WHERE student.school.id IN :availableSchoolIds " +
            "AND student.school.city.state.id = :stateId")
    List< Student > findAllByIdAndStateIdAnswer( Integer stateId, Set<Integer> availableSchoolIds);

    List<Student> findBySchoolCareer ( SchoolCareer schoolCareer);

    Integer countBySchoolCareer(SchoolCareer schoolCareer);

    Optional<Student> findByUser( User user);


    //para carga masiva CTE
    @Query(value="SELECT periodo_inicio, periodo_termino FROM sisec.config_cte_periodo ccp, cat_generacion cg " +
            "WHERE " +
            "ccp.id_entidad = :entidad AND " +
            "ccp.id_generacion = cg.id AND " +
            "cg.generacion= :generacion", nativeQuery = true
    )
    Periods getPeriodosByStateGeneration(@Param("entidad")String entidad, @Param("generacion")String generacion);
    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation")
    Integer countByGeneration(String generation);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.gender  = :gender ")
    Integer countByGenerationAndGender(String generation,String gender);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.school.city.state.id = :stateId")
    Integer countByGenerationAndState(String generation,Integer stateId);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.school.city.state.id = :stateId "+
            "AND student.school.id = :schoolId")
    Integer countByGenerationAndStateAndSchool(String generation,Integer stateId,Integer schoolId);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.gender  = :gender " +
            "AND student.school.city.state.id = :stateId")
    Integer countByGenerationAndGenderAndState(String generation,String gender,Integer stateId);
    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.gender  = :gender " +
            "AND student.school.city.state.id = :stateId "+
            "AND student.school.id = :schoolId")
    Integer countByGenerationAndGenderAndStateAndSchool(String generation,String gender,Integer stateId,Integer schoolId);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.school.id = :schoolId")
    Integer countByGenerationAndSchool(String generation,Integer schoolId);

    @Query("SELECT COUNT(student) " +
            "FROM Student student " +
            "WHERE student.status IS TRUE " +
            "AND student.generation = :generation " +
            "AND student.gender  = :gender " +
            "AND student.school.id = :schoolId")
    Integer countByGenerationAndGenderAndSchool(String generation,String gender,Integer schoolId);

    Integer countByUser(User user);
}
