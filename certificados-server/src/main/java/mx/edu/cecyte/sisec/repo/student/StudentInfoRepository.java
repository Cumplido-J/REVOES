package mx.edu.cecyte.sisec.repo.student;

import mx.edu.cecyte.sisec.model.student.studentinfo.StudentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentInfoRepository extends JpaRepository<StudentInfo, Integer> {
}
