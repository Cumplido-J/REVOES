package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportCountry;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportStateSchool;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportStudent;
import mx.edu.cecyte.sisec.dto.degree.DgpSchoolSelect;
import mx.edu.cecyte.sisec.model.catalogs.degree.*;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.degree.DegreeCatalogQueries;
import mx.edu.cecyte.sisec.repo.degree.DegreeRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeInstituteRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeStateRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class DegreeReportQueries {
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private DegreeRepository degreeRepository;
    @Autowired private DegreeCatalogQueries degreeCatalogQueries;
    @Autowired private DegreeStateRepository degreeStateRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private EntityManager entityManager;
    @Autowired private DegreeInstituteRepository degreeInstituteRepository;
    public List<CertifiedReportCountry> degreeCountryReport(String generation, User user, Set<Integer> availableStateIds) {
        List<CertifiedReportCountry> result = new ArrayList<>();
        List<Catalog> states = degreeCatalogQueries.degreeAllStates(availableStateIds);
        states.forEach(row->{
            Integer totalFinished = degreeRepository.degreeeCountCountry(row.getId(), generation);
            result.add(new CertifiedReportCountry( generation, row.getId(), row.getDescription1(), totalFinished, 0,0));
        });
        return result;
    }

    public Integer getStateId(User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getState().getId())
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceState));
    }

    public CatDegreeState getSatateById(Integer stateId) {
        return degreeStateRepository.findById(stateId).get();
    }

    public List<CertifiedReportStateSchool> degreeStateReport(CatDegreeState degreeState, Set<Integer> availableSchoolIds, String generation) {
        List<CertifiedReportStateSchool> result = new ArrayList<>();
        List<DgpSchoolSelect> institute = degreeCatalogQueries.getDegreeSchools(degreeState.getId(), availableSchoolIds);
        List<DgpSchoolSelect> schools = new ArrayList<>();
        availableSchoolIds.forEach(school->{
            Integer countSchool = degreeInstituteRepository.findCountSchoolById(school.intValue());
            if (countSchool > 0) {
                DgpSchoolSelect inst = degreeCatalogQueries.getDegreeSchools2(degreeState.getId(), school.intValue());
                schools.add(new DgpSchoolSelect(inst.getId(), inst.getClave(), inst.getName(), inst.isHasACareer(), inst.getTotalCareer()));
            }
        });
        schools.forEach(row->{
            CatDegreeInstitute schoolDgp = degreeInstituteRepository.findSchoolById(row.getId());
            Integer totalFinished = degreeRepository.degreeCountSchool(degreeState.getId(), schoolDgp.getSchool().getId(), generation);
            result.add(new CertifiedReportStateSchool(generation, row.getId(), row.getClave(), row.getName(), totalFinished, 0,0));
        });

        return result;
    }

    public Integer getSchoolId(User userId){
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter(scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getSchool().getId() )
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceSchool));
    }

    public CatDegreeInstitute findSchoolById(Integer schoolId) {
        return degreeInstituteRepository.findSchoolById(schoolId);
    }

    public List<CertifiedReportStudent> degreeSchoolReport(Integer schoolId, String generation) {
        List<CertifiedReportStudent> result = new ArrayList<>();
        List<Object[]> students = degreeRepository.degreeSchoolReport(schoolId, generation);
        students.forEach(studen->{
            studen[6] = studen[6] != null ? studen[6].toString() : "";
            studen[10] = studen[10] != null ? studen[10].toString() : "";
            result.add(new CertifiedReportStudent(studen[0].toString(), studen[1].toString(), studen[2].toString(), studen[3].toString(),
                    studen[4].toString(), studen[5].toString(), studen[6].toString(), studen[7].toString(), studen[8].toString(),
                    studen[9].toString(), studen[10].toString(),studen[11].toString(),studen[12].toString()));
        });
        return  result;
    }
}
