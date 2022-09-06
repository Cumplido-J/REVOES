package mx.edu.cecyte.sisec.dto.user;

import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.users.ScopeDetail;

import java.util.Objects;
import java.util.function.Predicate;

public class ScopeDetailUtilFilter {

    public static boolean isSerch( ScopeDetail scopeDetail, CatState state, Integer schoolId ){
        Predicate<ScopeDetail> SB =  null;

        if (schoolId<1) {
            SB = ( ScopeDetail S ) -> Objects.equals(S.getState(), state);
        }
        else if (schoolId>0) {
            if (scopeDetail.getSchool()!=null) {
                SB = ( ScopeDetail S ) -> Objects.equals(S.getSchool().getId(), schoolId);
            }else{
                SB = ( ScopeDetail S ) -> Objects.equals(S.getState(), 0);
            }
        }

        Predicate<ScopeDetail> SR = SB;
        return SR.test(scopeDetail);
    }

}
