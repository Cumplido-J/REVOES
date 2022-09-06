package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatSchoolType_;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial_;
import mx.edu.cecyte.sisec.model.users.User_;

import javax.persistence.criteria.*;
import java.util.Set;

public class StudentSearchFilter {
    protected Predicate textFilter(CriteriaBuilder builder, Path<Student> student, String sarchText) {
        Path<String> secondLastName = student.get(Student_.user).get(User_.secondLastName);
        Expression<String> secondLastNameExp = builder.<String>selectCase()
                .when(builder.isNull(secondLastName), "")
                .otherwise(secondLastName);

        Expression<String> expression = builder.concat(student.get(Student_.enrollmentKey), " ");
        expression = builder.concat(expression, student.get(Student_.user).get(User_.name));
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, student.get(Student_.user).get(User_.firstLastName));
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, secondLastNameExp);
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, student.get(Student_.user).get(User_.username));
        expression = builder.concat(expression, " ");
        return builder.like(expression, "%" + sarchText + "%");
    }

    protected Predicate generationFilter(CriteriaBuilder builder, Path<Student> student, String generation) {
        return builder.equal(student.get(Student_.generation), generation);
    }

    protected Predicate careerFilter(CriteriaBuilder builder, Path<Student> student, Integer careerId) {
        return builder.equal(student.get(Student_.schoolCareer).get(SchoolCareer_.career).get(Career_.id), careerId);
    }

    protected Predicate schoolFilter(CriteriaBuilder builder, Path<Student> student, Integer schoolId) {
        return builder.equal(student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.id), schoolId);
    }

    protected Predicate stateFilter(CriteriaBuilder builder, Path<Student> student, Integer stateId) {
        return builder.equal(student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.state).get(CatState_.id), stateId);
    }

    protected Predicate studentStatusFilter(CriteriaBuilder builder, Path<Student> student, Integer studentStatus) {
        return builder.equal(student.get(Student_.status), studentStatus);
    }

    protected Predicate availableSchoolsFilter(Set<Integer> availableSchoolIds, Path<Student> student) {
        return student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.id).in(availableSchoolIds);
    }

    protected Predicate availableSchoolsFilterOld(Set<Integer> availableSchoolIds, Path<Student> student) {
        return student.get(Student_.school).get(School_.id).in(availableSchoolIds);
    }

    protected Predicate studentIdFilter(CriteriaBuilder builder, Path<Student> student, Integer studentId) {
        return builder.equal(student.get(Student_.id), studentId);
    }

    protected Predicate studentCareerIdFilter(CriteriaBuilder builder, Path<StudentCareerModule> studentCareerModule, Integer studentId) {
        return builder.equal(studentCareerModule.get(StudentCareerModule_.student).get(Student_.id), studentId);
    }

    protected Predicate partialUacStudentFilter(CriteriaBuilder builder, Root<StudentSubjectPartial> studentSubjectPartial, Integer studentId) {
        return builder.equal(studentSubjectPartial.get(StudentSubjectPartial_.student).get(Student_.id), studentId);
    }

    protected Predicate schoolTypeFilter(CriteriaBuilder builder, Path<Student> student, Integer schoolTypeId) {
        return builder.equal(student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.schoolType).get(CatSchoolType_.id), schoolTypeId);
    }

    protected Predicate schoolIdFilter(CriteriaBuilder builder, Path<Student> student, Integer schoolId) {
        return builder.equal(student.get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.schoolEquivalents).get(SchoolEquivalent_.school).get(School_.id), schoolId);
    }
    protected Predicate curpFilter(CriteriaBuilder builder, Path<Student> student, String curp) {
        return builder.equal(student.get(Student_.user).get(User_.username),curp);
    }
    protected Predicate nuControlFilter(CriteriaBuilder builder, Path<Student> student, String texto) {
        return builder.equal(student.get(Student_.enrollmentKey),texto);
    }
    protected Predicate textFilterCopy(CriteriaBuilder builder, Path<Student> student, String sarchText) {
        Path<String> secondLastName = student.get(Student_.user).get(User_.secondLastName);
        Expression<String> secondLastNameExp = builder.<String>selectCase()
                .when(builder.isNull(secondLastName), "")
                .otherwise(secondLastName);

        Expression<String> expression = builder.concat(student.get(Student_.user).get(User_.name), " ");
        expression = builder.concat(expression, student.get(Student_.user).get(User_.firstLastName));
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, secondLastNameExp);
        return builder.like(expression, sarchText + "%");
    }
}
