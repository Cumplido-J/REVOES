package mx.edu.cecyte.sisec.queries;


import mx.edu.cecyte.sisec.dto.reports.*;
import mx.edu.cecyte.sisec.model.reports.ScholarEnrollmentReports;
import mx.edu.cecyte.sisec.model.reports.GraduatesReports;
import mx.edu.cecyte.sisec.model.reports.EducationLevelReports;
import mx.edu.cecyte.sisec.model.reports.SchoolCycle;
import mx.edu.cecyte.sisec.repo.reports.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import java.util.*;


@Service
public class ScholarEnrollmentReportsQueries {

    @Autowired private ScholarEnrollmentReportsRepository reportsRepository;
    @Autowired private StateEnrollmentReportsRepository reportsERepository;
    @Autowired private SchoolCycles repoSchoolCycles;
    @Autowired private GraduatesReportsRepository graduatesReportsRepository;
    @Autowired private GraduatesStateReportsRepository graduatesStateRepository;
    @Autowired private EducationLevelReportsRepository educationLevelReportsRepository;
    @Autowired private EducationLevelStateReportsRepository educationLevelStateRepository;

    public boolean AddScholarEnrollment(List<ScholarEnrollmentReports> ser) {
        for (ScholarEnrollmentReports s : ser) {
            reportsRepository.saveAndFlush(s);
        }
        if(getScholarEnrollmentByIds(ser.get(0).getPlantelId(), ser.get(0).getCicloId(), ser.get(0).getMatricula(), ser.get(0).getCarreraId())!=null) {
            return true;
        }else
        {
            return false;
        }
    }


    public boolean updateScholarEnrollment(List<ScholarEnrollmentReports> ser)
    {
        if(ser.isEmpty())
        {
            return false;
        }
        else
        {
            for(ScholarEnrollmentReports s : ser)
            {
                reportsRepository.updateScholarEnrollment( s.getSemestre(), s.getTurno(), s.getNum_grupos(), s.getNum_h(), s.getNum_m(), s.getReportsId() );
            }
            if(getScholarEnrollmentByIds(ser.get(0).getPlantelId(), ser.get(0).getCicloId(), ser.get(0).getMatricula(), ser.get(0).getCarreraId())!=null) {
                return true;
            }else
            {
                return false;
            }
        }
    }

    public List<ScholarEnrollmentReports> getScholarEnrollmentByIds(Integer plantelId, String cicloId, String matricula, Integer carreraId) {
        List<ScholarEnrollmentReports> ser=null;
        ser=reportsRepository.getByIds(plantelId, cicloId, matricula, carreraId);
        return ser;
    }

    public List<ScholarStateReports> reportsETCEMSByState(String tipoPlantel,Integer cicloId,Integer matricula) {
        System.out.println("en queries  reportsETCEMSByState");
        List<ScholarStateReports> ser=null;
        ser=reportsERepository.reportsETCEMSByState(tipoPlantel,cicloId,matricula);
        return ser;
    }

    public List<ScholarSchoolReports> reportsEnrollmentBySchools(String tipoPlantel, Integer cicloId, Integer matricula, Integer estado) {
        List<ScholarSchoolReports> ser=null;
        ser=reportsERepository.reportsEnrollmentBySchools(tipoPlantel,cicloId,matricula,estado);
        return ser;
    }

    public List<ScholarCareerReports> reportsEnrollmentByCareer(Integer cicloId, Integer matricula, Integer plantel) {
        List<ScholarCareerReports> ser=null;
        ser=reportsERepository.reportsEnrollmentByCareer(cicloId, matricula, plantel);
        return ser;
    }

    public List<SchoolCycle> getSchoolCycle() {
        List<SchoolCycle> ser=null;
        ser=repoSchoolCycles.findAll();
        return ser;
    }
    /////////////////////////////////////////
    ////////////// egresados titulados
    ////////////////////////////////////////////
    public List<GraduatesReports> getGraduatesByIds(Integer plantelId, String cicloId, String matricula, Integer carreraId) {
        List<GraduatesReports> ser=null;
        ser= graduatesReportsRepository.getByIds(plantelId, cicloId, matricula, carreraId);
        return ser;
    }

    public boolean AddGraduates(List<GraduatesReports> ser) {
        for (GraduatesReports s : ser) {
            graduatesReportsRepository.saveAndFlush(s);
        }
        if(getGraduatesByIds(ser.get(0).getPlantelId(), ser.get(0).getCicloId(), ser.get(0).getMatricula(), ser.get(0).getCarreraId())!=null) {
            return true;
        }else
        {
            return false;
        }
    }


    public boolean updateGraduates(List<GraduatesReports> ser)
    {
        if(ser.isEmpty())
        {
            return false;
        }
        else
        {
            for(GraduatesReports s : ser)
            {
                graduatesReportsRepository.updateGraduatesReports(s.getEgr_h(),s.getEgr_m(),s.getTit_m(),s.getTit_m(),s.getReportsId());
            }
            if(getScholarEnrollmentByIds(ser.get(0).getPlantelId(), ser.get(0).getCicloId(), ser.get(0).getMatricula(), ser.get(0).getCarreraId())!=null) {
                return true;
            }else
            {
                return false;
            }
        }
    }

    public List<GraduatesStateReports> graduatesByState(String tipoPlantel, Integer cicloId, Integer matricula) {
        List<GraduatesStateReports> ser=null;
        ser=graduatesStateRepository.graduatesByState(tipoPlantel,cicloId,matricula);
        return ser;
    }

    public List<GraduatesSchoolReports> graduatesByStateSchool(String tipoPlantel, Integer cicloId, Integer matricula, Integer estado) {
        List<GraduatesSchoolReports> ser=null;
        ser=graduatesStateRepository.graduatesByStateSchool(tipoPlantel, cicloId, matricula, estado);
        return ser;
    }

    public List<GraduatesSchoolCareerReports> graduatesByStateSchoolCareer(Integer cicloId, Integer matricula, Integer plantelId) {
        List<GraduatesSchoolCareerReports> ser=null;
        ser=graduatesStateRepository.graduatesByStateSchoolCareer(cicloId, matricula, plantelId);
        return ser;
    }

    /////////////////////////////////////////
    ////////////// nivel estudios
    ////////////////////////////////////////////
    public List<EducationLevelReports> getEducationLevel(Integer stateId, Integer schoolId, Integer cicloId, String turn, String place) {
        List<EducationLevelReports> ser=null;
        System.out.println("en queri education");
        ser= educationLevelReportsRepository.getEducationLevel(stateId, schoolId, cicloId, turn, place);
        return ser;
    }

    public boolean addEducationLevel(List<EducationLevelReports> ser) {
        for (EducationLevelReports s : ser) {
            educationLevelReportsRepository.saveAndFlush(s);
        }
        if(getEducationLevel(ser.get(0).getEstado_id(), ser.get(0).getPlantel_id(), ser.get(0).getCiclo_id(), ser.get(0).getTurno(), ser.get(0).getPlaza())!=null) {
            return true;
        }else
        {
            return false;
        }
    }


    public boolean updateEducationLevel(List<EducationLevelReports> ser)
    {
        if(ser.isEmpty())
        {
            return false;
        }
        else
        {
            for(EducationLevelReports s : ser)
            {
                educationLevelReportsRepository.updateEducationLevelReports(
                        s.getDoc_t_m(),s.getDoc_ec_m(),s.getDoc_es_m(),s.getMia_t_m(),s.getMia_ec_m(),s.getMia_es_m(),
                        s.getEsp_t_m(),s.getEsp_ec_m(),s.getEsp_es_m(),s.getLic_t_m(),s.getLic_ec_m(),s.getLic_es_m(),
                        s.getSup_t_m(),s.getSup_ec_m(),s.getSup_es_m(),s.getMto_t_m(),s.getMto_ec_m(),s.getMto_es_m(),
                        s.getBac_t_m(),s.getBac_ec_m(),s.getBac_es_m(),s.getTec_t_m(),s.getTec_ec_m(),s.getTec_es_m(),
                        s.getCom_t_m(),s.getCom_ec_m(),s.getCom_es_m(),s.getSec_t_m(),s.getSec_ec_m(),s.getSec_es_m(),
                        s.getPia_t_m(),s.getPia_ec_m(),s.getPia_es_m(),s.getDoc_t(),s.getDoc_ec(),s.getDoc_es(),
                        s.getMia_t(),s.getMia_ec(),s.getMia_es(),s.getEsp_t(),s.getEsp_ec(),s.getEsp_es(),s.getLic_t(),
                        s.getLic_ec(),s.getLic_es(),s.getSup_t(),s.getSup_ec(),s.getSup_es(),s.getMto_t(),s.getMto_ec(),
                        s.getMto_es(),s.getBac_t(),s.getBac_ec(),s.getBac_es(),s.getTec_t(),s.getTec_ec(),s.getTec_es(),
                        s.getCom_t(),s.getCom_ec(),s.getCom_es(),s.getSec_t(),s.getSec_ec(),s.getSec_es(),s.getPia_t(),
                        s.getPia_ec(),s.getPia_es(),s.getReportes_id());
            }
            if(getEducationLevel(ser.get(0).getReportes_id(), ser.get(0).getPlantel_id(), ser.get(0).getCiclo_id(), ser.get(0).getTurno(), ser.get(0).getPlaza())!=null){
                return true;
            }else
            {
                return false;
            }
        }
    }

    public List<EducationLevelStateReports> getStateEducationLevel(Integer cicloId) {
        List<EducationLevelStateReports> ser=null;
        ser=educationLevelStateRepository.educationLevelByState(cicloId);
        return ser;
    }

    public List<EducationLevelSchoolsReports> getStateSchoolsEducationLevel(Integer cicloId, Integer idEntidad) {
        List<EducationLevelSchoolsReports> ser=null;
        ser=educationLevelStateRepository.educationLevelByStateSchools(cicloId, idEntidad);
        return ser;
    }

    public List<EducationLevelSchoolReports> getStateSchoolEducationLevel(Integer cicloId, Integer idEntidad) {
        List<EducationLevelSchoolReports> ser=null;
        ser=educationLevelStateRepository.educationLevelByStateSchool(cicloId, idEntidad);
        return ser;
    }
}
