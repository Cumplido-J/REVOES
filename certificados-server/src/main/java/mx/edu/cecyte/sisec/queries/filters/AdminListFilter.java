package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.model.users.*;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class AdminListFilter {

    protected Predicate stateFilterCertificationAdmin(CriteriaBuilder builder, Root<CertificationAdmin> certificationAdmin, Integer stateId) {
        //return builder.equal(certificationAdmin.get(CertificationAdmin_.state).get(CatState_.id), stateId);
        return null;
    }

    protected Predicate stateFilterSchoolControlAdmin(CriteriaBuilder builder, Root<SchoolControlAdmin> schoolControlAdmin, Integer stateId) {
        //return builder.equal(schoolControlAdmin.get(SchoolControlAdmin_.school).get(School_.city).get(CatCity_.state).get(CatState_.id), stateId);
        return null;
    }

    protected Predicate schoolFilterSchoolControlAdmin(CriteriaBuilder builder, Root<SchoolControlAdmin> schoolControlAdmin, Integer schoolId) {
        //return builder.equal(schoolControlAdmin.get(SchoolControlAdmin_.school).get(School_.id), schoolId);
        return null;
    }

    protected Predicate stateFilterTracingAdmin(CriteriaBuilder builder, Root<GraduateTracingAdmin> graduateTracingAdmin, Integer stateId) {
        //return builder.equal(graduateTracingAdmin.get(GraduateTracingAdmin_.state).get(CatState_.id), stateId);
        return null;
    }

    protected Predicate stateFillterDegreeAdmin(CriteriaBuilder builder, Root<DegreeAdmim> degreeAdmim, Integer stateId) {
        //return builder.equal(degreeAdmim.get(DegreeAdmim_.state).get(CatState_.id), stateId);
        return null;
    }

    protected  Predicate adminType(CriteriaBuilder builder, Root<UserRole> userRole, Integer adminTypeId) {
        return builder.equal(userRole.get(UserRole_.role).get(Role_.id), adminTypeId);
    }

}
