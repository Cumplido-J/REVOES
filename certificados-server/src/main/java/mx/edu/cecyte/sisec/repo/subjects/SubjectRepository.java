package mx.edu.cecyte.sisec.repo.subjects;

import mx.edu.cecyte.sisec.model.subjects.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    @Query("SELECT sub " +
            "FROM Subject sub " +
            "WHERE sub.optional = TRUE " +
            "AND sub.subjectType != 4 " +
            "AND sub.subjectType != 3 " +
            "AND sub.subjectType != 10 ")
    List<Subject> findOptionals();

    @Query("SELECT sub " +
            "FROM Subject sub " +
            "WHERE sub.optional = FALSE " +
            "AND sub.subjectType != 4 " +
            "AND sub.subjectType != 3 " +
            "AND sub.subjectType != 10 " +
            "AND sub.cecyte = :cecyte")
    List<Subject> findNoOptionals(Boolean cecyte);

}


