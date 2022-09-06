package mx.edu.cecyte.sisec.service.degree;

import mx.edu.cecyte.sisec.classes.degree.StudentPeriodDate;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.degree.DgpSchoolSelect;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.queries.degree.DegreeCatalogQueries;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class DegreeCatalogService {
    @Autowired private UserQueries userQueries;
    @Autowired private DegreeCatalogQueries catalogQueries;

    public List<Catalog> getAntecedents() {
        return catalogQueries.getAntecedents();
    }

    public List<Catalog> getReasons() {
        return catalogQueries.getReasons();
    }

    public List<Catalog> getAuths() {
        return catalogQueries.getAuths();
    }

    public List<Catalog> getModalities() {
        return catalogQueries.getModalities();
    }

    public List<Catalog> getSigners() {
        return catalogQueries.getSigners();
    }

    public List<Catalog> getSocialService() {
        return catalogQueries.getSocialService();
    }

    public List<Catalog> getDegreeStates(String username) {
        User user = userQueries.getUserByUsername(username);
        Set<Integer> availableStateIds = userQueries.getAvailableStateIdsByAdminUser(user);
        return catalogQueries.getDegreeStates(availableStateIds);
    }

    public List<Catalog> getDegreeCarrer(String curp) {
        Integer schoolId = catalogQueries.getchooltId(curp);
        return catalogQueries.getDegreeCarrer(schoolId);
    }

    public List<DgpSchoolSelect> getDegreeSchools(Integer stateId, String username) {
        User user = userQueries.getUserByUsername(username);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,user, AppCatalogs.isState);
        return catalogQueries.getDegreeSchools(stateId, availableSchoolIds);
    }

    public List<Catalog> getDegreeCarrers(Integer schoolId) { return catalogQueries.getDegreeCarrers(schoolId); }

    public List<Catalog> degreeAllStates(String username) {
        User user = userQueries.getUserByUsername(username);

        Set<Integer> availableStateIds = userQueries.getAvailableStateIdsByAdminUser(user);
        return catalogQueries.degreeAllStates(availableStateIds);
    }

    public List<Catalog> careerAllDgp() {
        return catalogQueries.careerAllDgp();
    }

    public List<Catalog> schoolsNormalAll() {
        return catalogQueries.schoolsNormalAll();
    }

    public List<Catalog> searSchoolDgpFindById(Integer schoolId) {
        return catalogQueries.searSchoolDgpFindById(schoolId);
    }

    public List<StudentPeriodDate> studentPeriodDate(String curp) {
        User user = userQueries.getUserByUsername(curp);
        return catalogQueries.studentPeriodDate(user.getStudent().getId());
    }

    public List<Catalog> stateListAll(UserSession userSession) {
        return catalogQueries.stateListAll();
    }
}
