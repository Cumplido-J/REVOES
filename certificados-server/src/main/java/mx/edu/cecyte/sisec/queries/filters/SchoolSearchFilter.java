package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatSchoolType_;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.education.Career_;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.SchoolCareer_;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.shared.AppCatalogs;

import javax.persistence.criteria.*;
import java.util.Set;

public class SchoolSearchFilter {
    protected Predicate careerFilter(CriteriaBuilder builder, Root<School> school, Integer careerId) {
        Path<Integer> pathCareerIds = school.join(School_.schoolCareers, JoinType.LEFT)
                .get(SchoolCareer_.career).get(Career_.id);
        return builder.equal(pathCareerIds, careerId);
    }

    protected Predicate stateFilter(CriteriaBuilder builder, Root<School> school, Integer stateId) {
        return builder.equal(school.get(School_.city)
                .get(CatCity_.state)
                .get(CatState_.id), stateId);
    }

    protected Predicate schoolTypeFilter(CriteriaBuilder builder, Root<School> school, Integer schoolTypeId) {
        return builder.equal(school.get(School_.schoolType)
                .get(CatSchoolType_.id), schoolTypeId);
    }

    protected Predicate availableSchoolsFilter(Set<Integer> availableSchoolIds, Root<School> school) {
        return school.get(School_.id).in(availableSchoolIds);
    }

    protected Predicate isCecyte(CriteriaBuilder builder, Root<School> school) {
        return builder.equal(school.get(School_.schoolType).get(CatSchoolType_.id), AppCatalogs.SCHOOLTYPE_CECYTE);
    }

    protected Predicate cctFilter(CriteriaBuilder builder, Root<School> school, String cct) {
        Expression<String> expression = builder.concat(school.get(School_.cct), "");
        expression = builder.concat(expression, school.get(School_.cct));
        return builder.like(expression, "%" + cct + "%");
    }
}
