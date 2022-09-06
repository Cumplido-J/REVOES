package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.student.StudentSemesters;
import mx.edu.cecyte.sisec.dto.student.StudentSubject;
import mx.edu.cecyte.sisec.model.catalogs.CatSubjectType;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.repo.SubjectTypeRepository;
import mx.edu.cecyte.sisec.repo.subjects.SubjectRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SubjectQueries {

    @Autowired private SubjectRepository subjectRepository;
    @Autowired private SubjectTypeRepository subjectTypeRepository;

    public StudentSemesters getStudentSubjects(Student student) {
        List<Catalog> optionals = subjectRepository.findOptionals().stream().map(subject -> new Catalog(subject.getId(), subject.getName())).collect(Collectors.toList());

        Set<StudentSubjectPartial> subjectsSet = student.getSubjects();

        List<StudentSubjectPartial> subjectsList = new ArrayList<>(subjectsSet);
        subjectsList.sort(Comparator.comparing(StudentSubjectPartial::getId));

        List<StudentSubject> subjects = subjectsList.stream()
                .map(StudentSubject::new)
                .collect(Collectors.toList());
        return new StudentSemesters(student, subjects, optionals);
    }

    public StudentSemesters getAvailableStudentSubjects(Student student) {
        List<Catalog> optionals = subjectRepository.findOptionals().stream().map(subject -> new Catalog(subject.getId(), subject.getName())).collect(Collectors.toList());
        boolean cecyte = student.getSchoolCareer().getSchool().getSchoolType().getId().equals(AppCatalogs.SCHOOLTYPE_CECYTE);

        List<StudentSubject> subjects = subjectRepository.findNoOptionals(cecyte).stream().map(subject -> new StudentSubject(student, subject)).collect(Collectors.toList());
        List<StudentSubject> modules = student.getSchoolCareer().getCareer().getCareerModules().stream().map(
                careerModule -> new StudentSubject(student, careerModule, cecyte)
        ).collect(Collectors.toList());
        subjects.addAll(modules);
        return new StudentSemesters(student, subjects, optionals);
    }

    public CatSubjectType findBySubjectTypeId(Integer typeId) {
        return subjectTypeRepository.findAll().stream().filter(type->type.getId().equals(typeId)).findFirst().get();
    }

}
