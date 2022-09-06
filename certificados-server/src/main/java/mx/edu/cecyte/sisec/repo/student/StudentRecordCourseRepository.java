package mx.edu.cecyte.sisec.repo.student;

import mx.edu.cecyte.sisec.model.student.studentRecord.StudentRecordCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRecordCourseRepository extends JpaRepository<StudentRecordCourse, Integer> {
    @Query("SELECT subject " +
            "FROM StudentRecordCourse subject " +
            "WHERE subject.studentRecordPartial.id = :subjectId")
    StudentRecordCourse findByStudentId(Integer subjectId);
}
