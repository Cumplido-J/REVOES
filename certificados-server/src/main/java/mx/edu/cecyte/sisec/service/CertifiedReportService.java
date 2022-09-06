package mx.edu.cecyte.sisec.service;


import mx.edu.cecyte.sisec.classes.CertifiedFilter;
import mx.edu.cecyte.sisec.dto.certified.*;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.users.AdminUserScope;
import mx.edu.cecyte.sisec.model.users.GraduateTracingAdmin;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.repo.catalogs.GenerationRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class CertifiedReportService {
    @Autowired private UserQueries userQueries;
    @Autowired private StateQueries stateQueries;
    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private CertifiedReportQueries certifiedReportQueries;
    @Autowired private GenerationRepository generationRepository;
    @Autowired private CatalogQueries catalogQueries;

    public List<CertifiedReportCountry> getCountryReport(String genertion, Integer adminId){
        User userAdmin = userQueries.getUserById(adminId);
        //if (!userQueries.isDevAdmin(userAdmin)) throw new AppException("No tienes permiso para ver este reporte");

        List<CertifiedReportCountry> certified = new ArrayList<>();
        if (!genertion.isEmpty()){
            certified = certifiedReportQueries.getCertifiedNational(genertion, userAdmin);
        }
        return certified;
    }


    public CertifiedReportState getStateReport(CertifiedFilter certifiedFilter, Integer adminId) {
        Integer stateId = certifiedFilter.getTypeId();
        User userAdmin = userQueries.getUserById(adminId);
        if (stateId == 0){
            stateId = certifiedReportQueries.getStateId(userAdmin);
        }
        certifiedReportQueries.getRolesIdByUser(userAdmin);
        /*GraduateTracingAdmin graduateTracingAdmin = userAdmin.getGraduateTracingAdmin();
        if (graduateTracingAdmin != null) {
            if (graduateTracingAdmin.getState() != null) {
                stateId = graduateTracingAdmin.getState().getId();
            } else {
                stateId = graduateTracingAdmin.getSchool().getCity().getState().getId();
            }
        }*/

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if ( adminUserScope != null ) {
            stateId = catalogQueries.getSearchAndComparabilityTheStateById(stateId, userAdmin);
            //stateId = catalogQueries.getStateId(userAdmin);
        }
        CatState state = stateQueries.getById(stateId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,userAdmin, AppCatalogs.isState);

        List<CertifiedReportStateSchool> certified = new ArrayList<>();
        if (!certifiedFilter.getGeneration().isEmpty()) {
            certified = certifiedReportQueries.getStateReport(state, availableSchoolIds, certifiedFilter.getGeneration());
        }
        return new CertifiedReportState(state.getId(), state.getName(), certified);
    }

    public CertifiedReportSchool getSchoolReport(String certifiedType, Integer schoolId, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        if (schoolId == 0){
            schoolId = certifiedReportQueries.getSchoolId(userAdmin);
        }
        /*GraduateTracingAdmin graduateTracingAdmin = userAdmin.getGraduateTracingAdmin();
        if (graduateTracingAdmin != null)
            if (graduateTracingAdmin.getSchool() != null)
                schoolId = graduateTracingAdmin.getSchool().getId();*/

        AdminUserScope adminUserScope = userAdmin.getAdminUserScope();
        if ( adminUserScope != null ) {
            //schoolId = catalogQueries.getSchoolId(userAdmin);
            schoolId = catalogQueries.getSearchAndComparabilityTheSchoolById(schoolId,userAdmin);
        }
        School school = schoolSearchQueries.getSchoolById(schoolId);
        List<CertifiedReportStudent> students = new ArrayList<>();
        if (!certifiedType.isEmpty()) {
            students = certifiedReportQueries.getSchoolReport(schoolId, certifiedType);
        }
        return new CertifiedReportSchool(schoolId, school.getCct(), school.getName(), students);
    }

}
