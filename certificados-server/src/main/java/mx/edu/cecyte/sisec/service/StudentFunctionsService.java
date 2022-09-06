package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.SchoolCareerQueries;
import mx.edu.cecyte.sisec.queries.SchoolSearchQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentFunctionsService {
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private SchoolCareerQueries schoolCareerQueries;

    public void acceptPrivacy(Integer studentId) {
        Student student = studentQueries.getStudentById(studentId);
        student = studentQueries.acceptPrivacy(student);
        auditingQueries.saveAudit("StudentFunctionsService", "acceptPrivacy", student.getId(), Student.class, studentId, "Accepted privacy message");
    }

    public void updateStudentCareer(Integer studentId, Integer schoolCareerId) {
        SchoolCareer schoolCareer = schoolCareerQueries.getById(schoolCareerId);
        Student student = studentQueries.getStudentById(studentId);
        student = studentQueries.updateStudentCareer(student, schoolCareer);
        auditingQueries.saveAudit("StudentFunctionsService", "updateCareer", student.getId(), Student.class, studentId, "Updated student career, " + schoolCareerId);
    }

    public List<Catalog> getAvailableSchoolCareer(Integer studentId) {
        Student student = studentQueries.getStudentById(studentId);
        if (student.getSchool() == null) throw new AppException(Messages.student_hasSchoolCareer);
        return student.getSchool()
                .getSchoolCareers()
                .stream()
                .map(schoolCareer -> new Catalog(schoolCareer.getId(), schoolCareer.getCareer().getCareerKey(), schoolCareer.getCareer().getName()))
                .collect(Collectors.toList());
    }
}
