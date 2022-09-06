package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.classes.CertifiedFilter;
import mx.edu.cecyte.sisec.dto.certified.*;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeInstitute;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.users.AdminUserScope;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.CatalogQueries;
import mx.edu.cecyte.sisec.queries.DegreeReportQueries;
import mx.edu.cecyte.sisec.queries.SchoolSearchQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.queries.degree.DegreeCatalogQueries;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class DegreeReportService {
    @Autowired private UserQueries userQueries;
    @Autowired private DegreeReportQueries degreeReportQueries;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private DegreeCatalogQueries degreeCatalogQueries;
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    public List<CertifiedReportCountry> degreeCountryReport(String genertion, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        Set<Integer> availableStateIds = userQueries.getAvailableStateIdsByAdminUser(userAdmin);
        List<CertifiedReportCountry> certified = new ArrayList<>();
        if (!genertion.isEmpty()) {
            certified = degreeReportQueries.degreeCountryReport(genertion, userAdmin, availableStateIds);
        }
        return certified;
    }

    public CertifiedReportState degreeStateReport(CertifiedFilter certifiedFilter, Integer id) {
        Integer stateId = certifiedFilter.getTypeId();
        User userAdmin = userQueries.getUserById(id);
        if (stateId == 0) {
            stateId = degreeReportQueries.getStateId(userAdmin);
        }

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if (adminUserScope != null) {
            stateId = catalogQueries.getSearchAndComparabilityTheStateById(stateId, userAdmin);
        }
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,userAdmin, AppCatalogs.isState);
        CatDegreeState degreeState = degreeReportQueries.getSatateById(stateId);

        List<CertifiedReportStateSchool> degree = new ArrayList<>();
        if (!certifiedFilter.getGeneration().isEmpty()) {
            degree = degreeReportQueries.degreeStateReport(degreeState, availableSchoolIds, certifiedFilter.getGeneration());

        }
        return new CertifiedReportState(degreeState.getId(), degreeState.getName(), degree);
    }

    public CertifiedReportSchool degreeSchoolReport(String generation, Integer schoolId, Integer adminId) {
        CatDegreeInstitute schoolDgp = degreeReportQueries.findSchoolById(schoolId);
        schoolId = schoolDgp.getSchool().getId();
        User userAdmin = userQueries.getUserById(adminId);
        if (schoolId == 0){
            schoolId = degreeReportQueries.getSchoolId(userAdmin);
        }

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if ( adminUserScope != null ) {
            schoolId = catalogQueries.getSearchAndComparabilityTheSchoolById(schoolId,userAdmin);
        }

        School school = schoolSearchQueries.getSchoolById(schoolId);
        List<CertifiedReportStudent> students = new ArrayList<>();
        if (!generation.isEmpty()) {
            students = degreeReportQueries.degreeSchoolReport(schoolId, generation);
        }
        return new CertifiedReportSchool(schoolId, school.getCct(), school.getName(), students);
    }
}
