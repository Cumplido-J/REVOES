package mx.edu.cecyte.sisec.repo.student;

import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordPartial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRecordPartialRepository extends JpaRepository<StudentRecordPartial, Integer> {
    @Query("SELECT COUNT(*) FROM StudentRecordPartial partial WHERE partial.user.id=:studentId ")
    Integer isExistRecordStudent(Integer studentId);

    @Query("SELECT partial FROM StudentRecordPartial partial WHERE partial.user.id = :id  ORDER BY partial.id DESC")
    List<StudentRecordPartial> findByStudentId(Integer id);

    @Query("SELECT partial FROM StudentRecordPartial partial  WHERE partial.id=:recordId")
    StudentRecordPartial findByRecordId(Integer recordId);
}
