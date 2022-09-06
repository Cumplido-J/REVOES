package mx.edu.cecyte.sisec.repo;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentCareerModuleRepository extends JpaRepository<StudentCareerModule, Integer> {
    @Query("SELECT scm " +
            "FROM StudentCareerModule scm " +
            "WHERE scm.student.id =:student_id")
    List<StudentCareerModule> findAllByID(Integer student_id);

    @Query("SELECT scm " +
            "FROM StudentCareerModule scm " +
            "WHERE scm.student.user.id=:studentId AND scm.careerModule.id=:scmId ")
    StudentCareerModule selectStudentCareerModule(Integer studentId, Integer scmId);

    @Query("SELECT scm " +
            "FROM StudentCareerModule scm " +
            "WHERE scm.student.user.id=:studentId ORDER BY scm.careerModule.order ASC")
    List<StudentCareerModule> selectStudentCareerModule(Integer studentId);

    @Query("SELECT COUNT(*) " +
            "FROM StudentCareerModule scm " +
            "WHERE scm.student.user.id=:studentId AND scm.careerModule.id=:scmId ")
    Integer countStudentCareerModule(Integer studentId, Integer scmId);

    @Query("SELECT COUNT(*) " +
            "FROM StudentCareerModule scm " +
            "WHERE scm.student.user.id=:studentId ")
    Integer countStudentCareerModule(Integer studentId);
}
