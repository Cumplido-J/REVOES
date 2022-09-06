package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.student.StudentInfoDto;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.StudentInfoQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;

@Service
public class StudentInfoService {
    @Autowired private StudentInfoQueries studentInfoQueries;
    @Autowired private UserQueries userQueries;
    @Autowired private AuditingQueries auditingQueries;

    public StudentInfoDto getStudentInfo(Integer studentUserId) {
        User studentUser = userQueries.getUserById(studentUserId);
        return new StudentInfoDto(studentUser.getStudent());
    }

    public StudentInfoDto editStudentInfo(Integer studentUserId, StudentInfoDto studentInfoDto) {
        studentInfoDto.setUpdateDate(Calendar.getInstance().getTime());
        User studentUser = userQueries.getUserById(studentUserId);
        Student updatedStudent = studentInfoQueries.editStudentInfo(studentUser.getStudent(), studentInfoDto);
        auditingQueries.saveAudit("StudentInfoService", "editStudentInfo", studentUserId, Student.class, studentUserId, "Updated user info: " + studentInfoDto);

        return new StudentInfoDto(updatedStudent);
    }
}
