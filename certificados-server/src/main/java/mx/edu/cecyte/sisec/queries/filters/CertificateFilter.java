package mx.edu.cecyte.sisec.queries.filters;


import mx.edu.cecyte.sisec.classes.certificate.AbrogatedCertificateValidationStudent;
import mx.edu.cecyte.sisec.classes.certificate.CertificateQueryStudent;
import mx.edu.cecyte.sisec.classes.certificate.EndingCertificateValidationStudent;
import mx.edu.cecyte.sisec.classes.certificate.PartialCertificateValidationStudent;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule_;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.mec.CertificateStatus;
import mx.edu.cecyte.sisec.model.mec.Certificate_;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.student.Student_;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class CertificateFilter extends StudentSearchFilter {
    protected Predicate studentCanCertificate(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<EndingCertificateValidationStudent> criteriaQuery) {
        Double minScore = 6.0;

        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);
        Root<StudentCareerModule> studentCareerModule = subquery.from(StudentCareerModule.class);
        Join<StudentCareerModule, Student> join = studentCareerModule.join(StudentCareerModule_.student);

        subquery.select(builder.count(join.get(Student_.id)));
        subquery.where(builder.and(
                builder.equal(join.get(Student_.id), student.get(Student_.id)),
                builder.greaterThanOrEqualTo(studentCareerModule.get(StudentCareerModule_.score), 6.0)
        ));

        Expression<Integer> studentModulesCount = builder.size(student.get(Student_.studentCareerModules));

        return builder.and(
                builder.isNotNull(student.get(Student_.finalScore)),    //Final score not null
                builder.isNotNull(student.get(Student_.enrollmentStartDate)), //Start date not null
                builder.isNotNull(student.get(Student_.enrollmentEndDate)), //End date not null
                builder.isFalse(student.get(Student_.reprobate)), //Not reprobated
                builder.greaterThanOrEqualTo(student.get(Student_.finalScore), minScore), //Final score greather than 6.0
                builder.greaterThan(studentModulesCount, 0), //Has modules score
                builder.or(
                        builder.and(
                                builder.isTrue(student.get(Student_.isPortability)),
                                builder.greaterThan(subquery, 0L)
                        ),
                        builder.equal(subquery, studentModulesCount)   //is portability or has all scores from career modules
                )
        );
    }

    protected Predicate studentCanCertificateAbrogated(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<AbrogatedCertificateValidationStudent> criteriaQuery) {
        Double minScore = 6.0;

        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);
        Root<StudentCareerModule> studentCareerModule = subquery.from(StudentCareerModule.class);
        Join<StudentCareerModule, Student> join = studentCareerModule.join(StudentCareerModule_.student);

        subquery.select(builder.count(join.get(Student_.id)));
        subquery.where(builder.and(
                builder.equal(join.get(Student_.id), student.get(Student_.id)),
                builder.greaterThanOrEqualTo(studentCareerModule.get(StudentCareerModule_.score), 6.0)
        ));

        Expression<Integer> studentModulesCount = builder.size(student.get(Student_.studentCareerModules));

        return builder.and(
                builder.isNotNull(student.get(Student_.finalScore)),    //Final score not null
                builder.isNotNull(student.get(Student_.enrollmentStartDate)), //Start date not null
                builder.isNotNull(student.get(Student_.enrollmentEndDate)), //End date not null
                builder.isFalse(student.get(Student_.reprobate)), //Not reprobated
                builder.greaterThanOrEqualTo(student.get(Student_.finalScore), minScore), //Final score greather than 6.0
                builder.greaterThan(studentModulesCount, 0), //Has modules score
                builder.or(
                        builder.and(
                                builder.isTrue(student.get(Student_.isPortability)),
                                builder.greaterThan(subquery, 0L)
                        ),
                        builder.equal(subquery, studentModulesCount)   //is portability or has all scores from career modules
                )
        );
    }

    protected Predicate studentDontHaveEndingCertificate(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<EndingCertificateValidationStudent> criteriaQuery) {
        List<String> statusNo = new ArrayList<>();
        statusNo.add(CertificateStatus.validated);
        statusNo.add(CertificateStatus.certified);
        statusNo.add(CertificateStatus.inProcess);

        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Certificate> certificate = subquery.from(Certificate.class);
        Join<Certificate, Student> certificateStudent = certificate.join(Certificate_.student);
        subquery.select(builder.count(certificate.get(Certificate_.id)));
        subquery.where(builder.and(
                builder.equal(certificateStudent.get(Student_.id), student.get(Student_.id)),
                certificate.get(Certificate_.status).in(statusNo)
        ));
        return builder.equal(subquery, 0L);
    }

    protected Predicate studentDontHaveAbrogatedCertificate(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<AbrogatedCertificateValidationStudent> criteriaQuery) {
        List<String> statusNo = new ArrayList<>();
        statusNo.add(CertificateStatus.validated);
        statusNo.add(CertificateStatus.certified);
        statusNo.add(CertificateStatus.inProcess);

        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Certificate> certificate = subquery.from(Certificate.class);
        Join<Certificate, Student> certificateStudent = certificate.join(Certificate_.student);
        subquery.select(builder.count(certificate.get(Certificate_.id)));
        subquery.where(builder.and(
                builder.equal(certificateStudent.get(Student_.id), student.get(Student_.id)),
                certificate.get(Certificate_.status).in(statusNo)
        ));
        return builder.equal(subquery, 0L);
    }

    protected Predicate studentDontHavePartialCertificate(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<PartialCertificateValidationStudent> criteriaQuery) {
        List<String> statusNo = new ArrayList<>();
        statusNo.add(CertificateStatus.validated);
        statusNo.add(CertificateStatus.certified);
        statusNo.add(CertificateStatus.inProcess);

        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Certificate> certificate = subquery.from(Certificate.class);
        Join<Certificate, Student> certificateStudent = certificate.join(Certificate_.student);
        subquery.select(builder.count(certificate.get(Certificate_.id)));
        subquery.where(builder.and(
                builder.equal(certificateStudent.get(Student_.id), student.get(Student_.id)),
                certificate.get(Certificate_.status).in(statusNo)
        ));
        return builder.equal(subquery, 0L);
    }

    protected Predicate studentIsValidated(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<EndingCertificateValidationStudent> criteriaQuery) {
        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Certificate> certificate = subquery.from(Certificate.class);
        Join<Certificate, Student> certificateStudent = certificate.join(Certificate_.student);
        subquery.select(builder.count(certificate.get(Certificate_.id)));
        subquery.where(builder.and(
                builder.equal(certificateStudent.get(Student_.id), student.get(Student_.id)),
                builder.equal(certificate.get(Certificate_.status), CertificateStatus.validated)
        ));
        return builder.equal(subquery, 1L);
    }

    protected Predicate studentIsValidatedAbrogated(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<AbrogatedCertificateValidationStudent> criteriaQuery) {
        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Certificate> certificate = subquery.from(Certificate.class);
        Join<Certificate, Student> certificateStudent = certificate.join(Certificate_.student);
        subquery.select(builder.count(certificate.get(Certificate_.id)));
        subquery.where(builder.and(
                builder.equal(certificateStudent.get(Student_.id), student.get(Student_.id)),
                builder.equal(certificate.get(Certificate_.status), CertificateStatus.validated)
        ));
        return builder.equal(subquery, 1L);
    }

    protected Predicate studentIsValidatedPartial(CriteriaBuilder builder, Root<Student> student, CriteriaQuery<PartialCertificateValidationStudent> criteriaQuery) {
        Subquery<Long> subquery = criteriaQuery.subquery(Long.class);

        Root<Certificate> certificate = subquery.from(Certificate.class);
        Join<Certificate, Student> certificateStudent = certificate.join(Certificate_.student);
        subquery.select(builder.count(certificate.get(Certificate_.id)));
        subquery.where(builder.and(
                builder.equal(certificateStudent.get(Student_.id), student.get(Student_.id)),
                builder.equal(certificate.get(Certificate_.status), CertificateStatus.validated)
        ));
        return builder.equal(subquery, 1L);
    }

    protected Predicate studentQuery(CriteriaBuilder builder, Path<Certificate> certificate, CriteriaQuery<CertificateQueryStudent> criteriaQuery) {
        List<String> statusYes = new ArrayList<>();
        statusYes.add(CertificateStatus.certified);
        statusYes.add(CertificateStatus.inProcess);
        statusYes.add(CertificateStatus.validated);

        return certificate.get(Certificate_.status).in(statusYes);
    }

}
