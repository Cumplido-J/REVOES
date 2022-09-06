package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.dto.degree.DegreeQueryStudent;
import mx.edu.cecyte.sisec.dto.degree.DegreeValidationStudent;
import mx.edu.cecyte.sisec.model.met.*;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class DegreeFilter extends StudentDegreeSearchFilter {


    protected Predicate studentHasEndingCertificate(CriteriaBuilder builder, Root<DegreeData> degreeData, CriteriaQuery<DegreeValidationStudent> criteriaQuery) {
        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);
        Root<DegreeData> data = subquery.from(DegreeData.class);
        Join<DegreeData, Student> join = data.join(DegreeData_.student);
        subquery.select(builder.count(data.get(DegreeData_.id)));
        subquery.where(builder.and(
                builder.equal(data.get(DegreeData_.socialService), 1)
        ));
        return builder.equal(subquery, 1L); //Has one ending certificate certified
    }

    protected Predicate studentDontHaveDegree(CriteriaBuilder builder, Root<DegreeData> degreeData, CriteriaQuery<DegreeValidationStudent> criteriaQuery) {
        List<String> statusNo = new ArrayList<>();
        statusNo.add(DegreeStatus.validated);
        statusNo.add(DegreeStatus.degreed);
        statusNo.add(DegreeStatus.inProcess);

        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Degree> degree = subquery.from(Degree.class);
        Join<Degree, Student> degreeStudent = degree.join(Degree_.student);
        subquery.select(builder.count(degree.get(Degree_.id)));
        subquery.where(builder.and(
                builder.equal(degreeStudent.get(Student_.id), degreeData.get(DegreeData_.student).get(Student_.id)),
                degree.get(Degree_.status).in(statusNo)
        ));
        return builder.equal(subquery, 0L);
    }

    protected Predicate studentIsValidated(CriteriaBuilder builder, Root<DegreeData> degreeData, CriteriaQuery<DegreeValidationStudent> criteriaQuery) {
        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Degree> degree = subquery.from(Degree.class);
        Join<Degree, Student> degreeStudent = degree.join(Degree_.student);
        subquery.select(builder.count(degree.get(Degree_.id)));
        subquery.where(builder.and(
                builder.equal(degreeStudent.get(Student_.id), degreeData.get(DegreeData_.student).get(Student_.id)),
                builder.equal(degree.get(Degree_.status), DegreeStatus.validated)
        ));
        return builder.equal(subquery, 1L);
    }

    protected Predicate studentQuery(CriteriaBuilder builder, Path<Degree> degree, CriteriaQuery<DegreeQueryStudent> criteriaQuery) {
        List<String> statusYes = new ArrayList<>();
        statusYes.add(DegreeStatus.degreed);
        statusYes.add(DegreeStatus.inProcess);
        statusYes.add(DegreeStatus.validated);
        return degree.get(Degree_.status).in(statusYes);
    }

}
