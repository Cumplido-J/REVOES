package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.certified.CertifiedReportCountry;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportStateSchool;
import mx.edu.cecyte.sisec.dto.certified.CertifiedReportStudent;
import mx.edu.cecyte.sisec.dto.dashboard.CountCertified;
import mx.edu.cecyte.sisec.dto.dashboard.TotalList;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.model.users.ScopeDetail;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.repo.CertifiedReportRepository;
//import mx.edu.cecyte.sisec.repo.admin.SchoolControlAdminRepository;
import mx.edu.cecyte.sisec.repo.catalogs.GenerationRepository;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.repo.education.SchoolRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CertifiedReportQueries {
    @Autowired private StateRepository stateRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private CertifiedReportRepository certifiedReportRepository;
    @Autowired private GenerationRepository generationRepository;
    //@Autowired private SchoolControlAdminRepository schoolControlAdminRepository;
    @Autowired private EntityManager entityManager;
    @Autowired private CatalogQueries catalogQueries;

    public List<CertifiedReportCountry> getCertifiedNational(String generation, User user) {
        List<CertifiedReportCountry> result = new ArrayList<>();
        List<CatState> states = catalogQueries.getAllStateModel(user);
        //List<CatState> states = stateRepository.findAll();
        for(CatState state: states){
            Integer stateId = state.getId();
            String stateName = state.getName();

            Integer totalFinished = certifiedReportRepository.getCountCertified(stateId, generation, 1);

            Integer totalPartial = certifiedReportRepository.getCountCertified(stateId, generation, 2);
            Integer totalAbrogado = certifiedReportRepository.getCountCertified(stateId, generation, 3);
            result.add(new CertifiedReportCountry( generation, stateId, stateName, totalFinished, totalPartial,totalAbrogado));

        }
        return result;
    }

    public List<CertifiedReportStateSchool> getStateReport(CatState state, Set<Integer> availableSchoolIds, String generation) {
        List<CertifiedReportStateSchool> result = new ArrayList<>();

        List<School>  schools = schoolRepository.findAllByIdAndStateId(state.getId(), availableSchoolIds);
        for (School school : schools){
            Integer schoolId = school.getId();
            String cct = school.getCct();
            String schoolName = school.getName();

            Integer totalFinished = certifiedReportRepository.getCountSchool(state.getId(), schoolId, generation, 1);
            Integer totalPartial = certifiedReportRepository.getCountSchool(state.getId(), schoolId, generation, 2);
            Integer totalAbrogado= certifiedReportRepository.getCountSchool(state.getId(), schoolId, generation, 3);
            result.add(new CertifiedReportStateSchool(generation, schoolId, cct, schoolName, totalFinished, totalPartial,totalAbrogado));
        }
        return result;
    }

    public List<CertifiedReportStudent> getSchoolReport(Integer schoolId, String certifiedType) {
        List<CertifiedReportStudent> result = new ArrayList<>();
        List<Object[]> students = certifiedReportRepository.getCertifiedStudents(schoolId, certifiedType);
        for(Object[] studen : students){
            if (studen[6] != null) {
                studen[6] = studen[6].toString();
            } else {
                studen[6] = "";
            }
            //if (studen[10] != null || studen[11] != null || studen[12] != null) {
            if (studen[10] != null) {
                studen[10] = studen[10].toString();
                //studen[11] = studen[11].toString();
                ///studen[12] = studen[12].toString();
            } else {
                studen[10] = "";
                //studen[11] = "";
                //studen[12] = "";
            }
            result.add(new CertifiedReportStudent(studen[0].toString(), studen[1].toString(), studen[2].toString(), studen[3].toString(),
                    studen[4].toString(), studen[5].toString(), studen[6].toString(), studen[7].toString(), studen[8].toString(),
                    studen[9].toString(), studen[10].toString(),studen[11].toString(),studen[12].toString()));
        }
        return  result;
    }

    public Set<Integer> getRolesIdByUser(User user) {
        return user.getUserRoles().stream().map(UserRole::getRole).map(Role::getId).collect(Collectors.toSet());
    }

    public Integer getStateId(User userId){
        //return userId.getSchoolControlAdmin().getState().getId();
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter( scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getState().getId())
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceState));
    }

    public Integer getSchoolId(User userId){
        //return userId.getSchoolControlAdmin().getSchool().getId();
        return userId.getAdminUserScope().getCatUserScope().getScopeDetails()
                .stream()
                .filter(scopeDetail -> scopeDetail.getStatus() == true )
                .map( scopeDetail -> scopeDetail.getSchool().getId() )
                .findFirst()
                .orElseThrow(() -> new AppException(Messages.cantFindResourceSchool));
    }

    public List<CountCertified> getCountCertified() {
        List<CountCertified> result = new ArrayList<>();
        Integer termino = certifiedReportRepository.countByTypeCertified(1);
        Integer parcial = certifiedReportRepository.countByTypeCertified(2);
        Integer abrogado = certifiedReportRepository.countByTypeCertified(3);
        result.add(new CountCertified(termino, parcial, abrogado));
        return result;
    }

    public List<CountCertified> getCountCertifiedState(Integer stateId) {
        List<CountCertified> result = new ArrayList<>();
        Integer termino = certifiedReportRepository.countByIdAndTypeCertifiedAndState(1, stateId, "CERTIFICADO");
        Integer parcial = certifiedReportRepository.countByIdAndTypeCertifiedAndState(2, stateId, "CERTIFICADO");
        Integer abrogado = certifiedReportRepository.countByIdAndTypeCertifiedAndState(3, stateId, "CERTIFICADO");
        result.add(new CountCertified(termino, parcial, abrogado));
        return result;
    }

    public List<CountCertified> getCountCertifiedStateAndSchool(Integer schoolId, Integer stateId) {
        List<CountCertified> result = new ArrayList<>();
        Integer termino = certifiedReportRepository.countByStateAndSchool(1, schoolId, stateId, "CERTIFICADO");
        Integer parcial = certifiedReportRepository.countByStateAndSchool(2, schoolId, stateId, "CERTIFICADO");
        Integer abrogado = certifiedReportRepository.countByStateAndSchool(3, schoolId, stateId, "CERTIFICADO");
        result.add(new CountCertified(termino, parcial, abrogado));
        return result;
    }

    public List<CountCertified> getCountCertifiedSchoolById(Integer schoolId) {
        List<CountCertified> result = new ArrayList<>();
        Integer termino = certifiedReportRepository.countTypeCertifiedAndSchool(1, schoolId, "CERTIFICADO");
        Integer parcial = certifiedReportRepository.countTypeCertifiedAndSchool(2, schoolId, "CERTIFICADO");
        Integer abrogado = certifiedReportRepository.countTypeCertifiedAndSchool(3, schoolId, "CERTIFICADO");
        result.add(new CountCertified(termino, parcial, abrogado));
        return result;
    }

    public List<TotalList> getCountCertifiedStateHM(Integer stateId) {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = certifiedReportRepository.countBySexoAndState(stateId, "CERTIFICADO", "H");
        Integer mujer = certifiedReportRepository.countBySexoAndState(stateId, "CERTIFICADO", "M");
        result.add(new TotalList(hombre, mujer));
        return result;
    }

    public List<TotalList> getCountCertifiedStateAndSchoolHM(Integer schoolId, Integer stateId) {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = certifiedReportRepository.countBySexoStateAndSchool(schoolId, stateId, "CERTIFICADO", "H");
        Integer mujer = certifiedReportRepository.countBySexoStateAndSchool(schoolId, stateId, "CERTIFICADO", "M");
        result.add(new TotalList(hombre, mujer));
        return result;
    }
    public List<TotalList> getCountCertifiedSchoolHM(Integer schoolId) {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = certifiedReportRepository.countBySexoAndSchool(schoolId,"CERTIFICADO", "H");
        Integer mujer = certifiedReportRepository.countBySexoAndSchool(schoolId,"CERTIFICADO", "M");
        result.add(new TotalList(hombre, mujer));
        return result;
    }
    public List<TotalList> getCountCertifiedHM() {
        List<TotalList> result = new ArrayList<>();
        Integer hombre = certifiedReportRepository.countBySexo("CERTIFICADO", "H");
        Integer mujer = certifiedReportRepository.countBySexo("CERTIFICADO", "M");
        result.add(new TotalList(hombre, mujer));
        return result;
    }


}
