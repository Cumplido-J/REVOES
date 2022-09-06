package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatSchoolType_;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeCareerDgp;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeCombinationDgp_;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeInstitute_;
import mx.edu.cecyte.sisec.model.education.*;
import mx.edu.cecyte.sisec.model.met.DegreeData;
import mx.edu.cecyte.sisec.model.met.DegreeData_;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial_;
import mx.edu.cecyte.sisec.model.users.User_;

import javax.persistence.criteria.*;
import java.util.Set;

public class StudentDegreeSearchFilter {
    protected Predicate textFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, String sarchText) {
        Path<String> secondLastName = degreeData.get(DegreeData_.student).get(Student_.user).get(User_.secondLastName);
        Expression<String> secondLastNameExp = builder.<String>selectCase()
                .when(builder.isNull(secondLastName), "")
                .otherwise(secondLastName);

        Expression<String> expression = builder.concat(degreeData.get(DegreeData_.student).get(Student_.enrollmentKey), " ");
        expression = builder.concat(expression, degreeData.get(DegreeData_.student).get(Student_.user).get(User_.name));
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, degreeData.get(DegreeData_.student).get(Student_.user).get(User_.firstLastName));
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, secondLastNameExp);
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, degreeData.get(DegreeData_.student).get(Student_.user).get(User_.username));
        expression = builder.concat(expression, " ");
        return builder.like(expression, "%" + sarchText + "%");
    }

    protected Predicate generationFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, String generation) {
        return builder.equal(degreeData.get(DegreeData_.student).get(Student_.generation), generation);
    }

    protected Predicate careerFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, Integer careerId) {
        return builder.equal(degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.id), careerId);
    }

    protected Predicate schoolFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, Integer schoolId) {
        return builder.equal(degreeData.get(DegreeData_.carrerId).get(CatDegreeCombinationDgp_.institute).get(CatDegreeInstitute_.id), schoolId);
    }

    protected Predicate stateFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, Integer stateId) {
        return builder.equal(degreeData.get(DegreeData_.student).get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.city).get(CatCity_.state).get(CatState_.id), stateId);
    }

    protected Predicate studentStatusFilter(CriteriaBuilder builder, Path<Student> student, Integer studentStatus) {
        return builder.equal(student.get(Student_.status), studentStatus);
    }

    protected Predicate availableSchoolsFilter(Set<Integer> availableSchoolIds, Path<DegreeData> degreeData) {
        return degreeData.get(DegreeData_.student).get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.id).in(availableSchoolIds);
    }

    protected Predicate availableSchoolsFilterOld(Set<Integer> availableSchoolIds, Path<Student> student) {
        return student.get(Student_.school).get(School_.id).in(availableSchoolIds);
    }

    protected Predicate studentIdFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, Integer studentId) {
        return builder.equal(degreeData.get(DegreeData_.student).get(Student_.id), studentId);
    }

    protected Predicate studentCareerIdFilter(CriteriaBuilder builder, Path<StudentCareerModule> studentCareerModule, Integer studentId) {
        return builder.equal(studentCareerModule.get(StudentCareerModule_.student).get(Student_.id), studentId);
    }

    protected Predicate partialUacStudentFilter(CriteriaBuilder builder, Root<StudentSubjectPartial> studentSubjectPartial, Integer studentId) {
        return builder.equal(studentSubjectPartial.get(StudentSubjectPartial_.student).get(Student_.id), studentId);
    }

    protected Predicate schoolTypeFilter(CriteriaBuilder builder, Path<DegreeData> degreeData, Integer schoolTypeId) {
        return builder.equal(degreeData.get(DegreeData_.student).get(Student_.schoolCareer).get(SchoolCareer_.school).get(School_.schoolType).get(CatSchoolType_.id), schoolTypeId);
    }
}
