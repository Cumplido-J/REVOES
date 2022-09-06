package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.student.StudentInfoDto;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.studentinfo.StudentInfo;
import mx.edu.cecyte.sisec.repo.student.StudentInfoRepository;
import mx.edu.cecyte.sisec.repo.student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentInfoQueries {

    @Autowired private StudentRepository studentRepository;
    @Autowired private StudentInfoRepository studentInfoRepository;

    public Student editStudentInfo(Student student, StudentInfoDto studentInfoDto) {
        StudentInfo studentInfo = student.getStudentInfo();
        if (studentInfo == null) {
            studentInfo = new StudentInfo(student, studentInfoDto);
            studentInfo = studentInfoRepository.save(studentInfo);
        } else {
            studentInfo.editStudentInfo(studentInfoDto);
        }
        student.setStudentInfo(studentInfo);
        return studentRepository.save(student);
    }
}
