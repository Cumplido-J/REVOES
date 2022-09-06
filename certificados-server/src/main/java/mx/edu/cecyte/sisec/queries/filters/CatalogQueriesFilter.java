package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.model.catalogs.CatCity_;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.education.*;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Set;

public class CatalogQueriesFilter {

    protected Predicate filterStateByAvailableStateIds(Set<Integer> availableStateIds, Root<CatState> state) {
        return state.get(CatState_.id).in(availableStateIds);
    }

    protected Predicate filterSchoolByAvailableSchoolIds(Set<Integer> availableSchoolIds, Root<School> school) {
        return school.get(School_.id).in(availableSchoolIds);
    }

    protected Predicate filterSchoolsByStateId(CriteriaBuilder builder, Root<School> school, Integer stateId) {
        return builder.equal(school.get(School_.city)
                .get(CatCity_.state)
                .get(CatState_.id), stateId);
    }

    protected Predicate filterCareersBySchoolId(CriteriaBuilder builder, Root<SchoolCareer> schoolCareer, Integer schoolId) {
        return builder.equal(schoolCareer.get(SchoolCareer_.school)
                .get(School_.id), schoolId);
    }

    protected Predicate filterCareersByStateId(CriteriaBuilder builder, Root<SchoolCareer> schoolCareer, Integer stateId) {
        return builder.equal(schoolCareer.get(SchoolCareer_.school)
                .get(School_.city).get(CatCity_.state).get(CatState_.id), stateId);
    }

    protected Predicate filterCompetenciasByCareerId( CriteriaBuilder builder, Root< CareerModule > careerModule, Integer careerId) {
        return builder.equal( careerModule.get(CareerModule_.career)
                .get(Career_.id), careerId);
    }

}
