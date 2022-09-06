package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.student.StudentSemesters;
import mx.edu.cecyte.sisec.dto.student.StudentSubjectUpdate;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.SubjectQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubjectService {
    @Autowired private UserQueries userQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private SubjectQueries subjectQueries;
    @Autowired private AuditingQueries auditingQueries;

    public StudentSemesters getStudentSubjects(String studentCurp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(studentCurp);

        if (!userQueries.isStudentAvailableForAdmin(adminUser, student))
            throw new AppException(Messages.student_noEditPermissions);

        return subjectQueries.getStudentSubjects(student);
    }

    public void addStudentSubjects(String curp, StudentSemesters semesters, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(curp);

        if (!userQueries.isStudentAvailableForAdmin(adminUser, student))
            throw new AppException(Messages.student_noEditPermissions);

        studentQueries.addStudentSubjects(student, semesters);

        auditingQueries.saveAudit("SubjectService", "addStudentSubjects", adminId, Student.class, student.getId(), "Edited student subjects, " + semesters);
    }

    public StudentSemesters getAvailableStudentSubjects(String studentCurp, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Student student = studentQueries.getStudentByUsername(studentCurp);

        if (!userQueries.isStudentAvailableForAdmin(adminUser, student))
            throw new AppException(Messages.student_noEditPermissions);

        return subjectQueries.getAvailableStudentSubjects(student);
    }

    public StudentSubjectUpdate getUpdateStudentSubject(StudentSubjectUpdate subject, Integer adminId) {
        Student student = new Student();
        student.setId(subject.getStudentId());
        CatSubjectType subjectType = new CatSubjectType();
        subjectType.setId(subject.getSubjectTypeId());

        studentQueries.getUpdateStudentSubject(student, subject, subjectType);
        return  subject;
    }
}
