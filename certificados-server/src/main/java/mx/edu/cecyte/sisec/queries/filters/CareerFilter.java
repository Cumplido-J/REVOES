package mx.edu.cecyte.sisec.queries.filters;

import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.Career_;
import mx.edu.cecyte.sisec.model.education.Module;
import mx.edu.cecyte.sisec.model.education.Module_;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import java.util.Set;

public class CareerFilter {

    protected Predicate textFilter( CriteriaBuilder builder, Path< Career > career, String sarchText) {
        Path<String> careerKey = career.get(Career_.careerKey);
        Expression<String> careerKeyExp = builder.<String>selectCase()
                .when(builder.isNull(careerKey ), "")
                .otherwise(careerKey);

        Expression<String> expression = builder.concat(career.get(Career_.careerKey), " ");
        expression = builder.concat(expression, career.get(Career_.name));
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, careerKeyExp );
        return builder.like(expression, "%" + sarchText + "%");
    }
    protected Predicate textFilter2( CriteriaBuilder builder, Path< Module > module, String searchText) {
        Path<String> mod= module.get(Module_.module);
        Expression<String> modExp= builder.<String>selectCase()
                .when(builder.isNull(mod ), "")
                .otherwise(mod);

        Expression<String> expression = builder.concat(module.get(Module_.module), " ");
        expression = builder.concat(expression, " ");
        expression = builder.concat(expression, modExp );
        return builder.like(expression, "%" + searchText + "%");
    }
    protected Predicate availableSchoolIds( Set<Integer> availableCareerIds, Path<Career> career) {
        return career.get(Career_.id).in(availableCareerIds);
    }
}
