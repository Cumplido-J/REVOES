package mx.edu.cecyte.sisec.devfunctions;

import mx.edu.cecyte.sisec.classes.certificate.StudentPartialDecData;
import mx.edu.cecyte.sisec.classes.certificate.StudentPartialDecDataUac;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.CareerQueries;
import mx.edu.cecyte.sisec.queries.SchoolSearchQueries;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DevNayaritService {
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private CareerQueries careerQueries;
    @Autowired private StudentQueries studentQueries;

    public void generateStudents() {
        StudentPartialDecData TEPIC_1_FOES991214HJCLSG03 = getData("ROMR030909MNTBRSA9");

    }


    public StudentPartialDecData getData(String curp) {
        Student student = studentQueries.getStudentByUsername(curp);
        User user = student.getUser();
        School school = student.getSchoolCareer().getSchool();
        Career career = student.getSchoolCareer().getCareer();

        String name = user.getName();
        String firstLastName = user.getFirstLastName();
        String secondLastName = user.getSecondLastName();
        String enrollmentKey = student.getEnrollmentKey();
        Date enrollmentStartDate = student.getEnrollmentStartDate();
        Date enrollmentEndDate = student.getEnrollmentEndDate();
        Double finalScore = student.getFinalScore();
        Integer totalCredits = student.getSchoolCareer().getCareer().getTotalCredits();
        Integer obtainedCredits = student.getObtainedCredits();


        String pdfName = school.getPdfName();
        String pdfNumber = school.getPdfNumber();
        String pdfFinalName = school.getPdfFinalName();
        String cct = school.getCct();
        Integer schoolTypeId = school.getSchoolType().getId();
        Integer iemsId = school.getIems().getId();
        Integer educationalOptionId = school.getEducationalOption().getId();
        Integer stateId = school.getCity().getState().getId();
        String localityId = school.getCity().getLocalityId();
        Integer studyTypeId = career.getStudyType().getId();
        String careerName = career.getName();
        String profileType = career.getProfileType().getName();
        String careerKey = career.getName();
        StudentPartialDecData studentPartialDecData = new StudentPartialDecData(curp, name, firstLastName, secondLastName, enrollmentKey, enrollmentStartDate, enrollmentEndDate, finalScore, pdfName, pdfNumber, pdfFinalName, cct, schoolTypeId, iemsId, educationalOptionId, stateId, localityId, studyTypeId, careerName, careerKey, totalCredits, obtainedCredits, profileType);
        List<StudentPartialDecDataUac> uacs = new ArrayList<>();
        for (StudentSubjectPartial subject : student.getSubjects()) {
            StudentPartialDecDataUac uac = new StudentPartialDecDataUac(subject);
            uacs.add(uac);
        }
        studentPartialDecData.setUacs(uacs);
        return studentPartialDecData;
    }
}
