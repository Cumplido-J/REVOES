package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSubjectPartialRepository extends JpaRepository<StudentSubjectPartial, Integer> {
    @Query("SELECT subject " +
            "FROM StudentSubjectPartial subject " +
            "WHERE subject.student.user.id = :studentId")
    StudentSubjectPartial findByStudentId(Integer studentId);

    @Query("SELECT COUNT(*) FROM StudentSubjectPartial subject WHERE subject.student.user.id=:studentId")
    Integer isExistSubject(Integer studentId);

    Integer countByStudent( Student student );

    List<StudentSubjectPartial> findAllByStudent( Student student);
}
