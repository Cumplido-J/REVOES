package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.reports.*;
import mx.edu.cecyte.sisec.model.reports.GraduatesReports;
import mx.edu.cecyte.sisec.model.reports.EducationLevelReports;
import mx.edu.cecyte.sisec.model.reports.ScholarEnrollmentReports;
import mx.edu.cecyte.sisec.model.reports.SchoolCycle;
import mx.edu.cecyte.sisec.queries.ScholarEnrollmentReportsQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@Service
public class ScholarEnrollmentReportsService {
    @Autowired private ScholarEnrollmentReportsQueries enrollQueries;

    //servicio para actualizar o insertar el reporte de schollar enrollment
    @Transactional
    public boolean insertEnrolmentReports(List<ScholarEnrollmentReports> ser) {
        if(enrollQueries.AddScholarEnrollment(ser))
        {
            return true;
        }else
        {
            return false;
        }
    }
    //servicio para actualizar o insertar el reporte de schollar enrollment
    @Transactional
    public boolean updateEnrolmentReports(List<ScholarEnrollmentReports> ser) {
        if(enrollQueries.updateScholarEnrollment(ser))
        {
            return true;
        }else
        {
            return false;
        }
    }
    public List<ScholarEnrollmentReports> getScholarEnrollmentByIds(Integer plantelId, String cicloId, String matricula, Integer carreraId) {
        List<ScholarEnrollmentReports> ser=null;
        ser = enrollQueries.getScholarEnrollmentByIds(plantelId, cicloId, matricula, carreraId);
        return ser;
    }

    public List<ScholarStateReports> reportsETCEMSByState(String tipoPlantel,Integer cicloId,Integer matricula){
        System.out.println("en queries  service");
        List<ScholarStateReports> ser=null;
        ser = enrollQueries.reportsETCEMSByState(tipoPlantel, cicloId, matricula);
        return ser;
    }

    public List<ScholarSchoolReports> reportsEnrollmentBySchools(String tipoPlantel, Integer cicloId, Integer matricula, Integer estado){
        List<ScholarSchoolReports>  ser=null;
        ser = enrollQueries.reportsEnrollmentBySchools(tipoPlantel,cicloId,matricula,estado);
        return ser;
    }

    public List<ScholarCareerReports> reportsEnrollmentByCareer(Integer cicloId, Integer matricula, Integer plantel){
        List<ScholarCareerReports>  ser=null;
        ser = enrollQueries.reportsEnrollmentByCareer(cicloId, matricula, plantel);
        return ser;
    }

    public List<SchoolCycle> getSchoolCycle(){
        List<SchoolCycle>  ser=null;
        ser = enrollQueries.getSchoolCycle();
        return ser;
    }
    ////////////////////////////////////////////////////
    //////////////egresados titulados
    //////////////////////////////////////////////////////
    public List<GraduatesReports> getGraduatesByIds(Integer plantelId, String cicloId, String matricula, Integer carreraId) {
        List<GraduatesReports> ser=null;
        ser = enrollQueries.getGraduatesByIds(plantelId, cicloId, matricula, carreraId);
        return ser;
    }
    @Transactional
    public boolean insertGraduatesReports(List<GraduatesReports> ser) {
        if(enrollQueries.AddGraduates(ser))
        {
            return true;
        }else
        {
            return false;
        }
    }

    @Transactional
    public boolean updateGraduatesReports(List<GraduatesReports> ser) {
        if(enrollQueries.updateGraduates(ser))
        {
            return true;
        }else
        {
            return false;
        }
    }

    public List<GraduatesStateReports> graduatesByState(String tipoPlantel, Integer cicloId, Integer matricula){
        List<GraduatesStateReports> ser=null;
        ser = enrollQueries.graduatesByState(tipoPlantel, cicloId, matricula);
        return ser;
    }

    public List<GraduatesSchoolReports> graduatesByStateSchool(String tipoPlantel, Integer cicloId, Integer matricula, Integer estado){
        List<GraduatesSchoolReports>  ser=null;
        ser = enrollQueries.graduatesByStateSchool(tipoPlantel, cicloId, matricula, estado);
        return ser;
    }

    public List<GraduatesSchoolCareerReports> graduatesByStateSchoolCareer(Integer cicloId, Integer matricula, Integer plantelId){
        List<GraduatesSchoolCareerReports>  ser=null;
        ser = enrollQueries.graduatesByStateSchoolCareer(cicloId, matricula, plantelId);
        return ser;
    }
    ////////////////////////////////////////////////////
    //////////////nivel estudios
    //////////////////////////////////////////////////////
    public List<EducationLevelReports> getEducationLevel(Integer stateId, Integer schoolId, Integer cicloId, String turn, String place) {
        List<EducationLevelReports> ser=null;
        ser = enrollQueries.getEducationLevel(stateId,schoolId,cicloId,turn,place);
        return ser;
    }
    @Transactional
    public boolean insertEducationLevel(List<EducationLevelReports> ser) {
        if(enrollQueries.addEducationLevel(ser))
        {
            return true;
        }else
        {
            return false;
        }
    }

    @Transactional
    public boolean updateEducationLevel(List<EducationLevelReports> ser) {
        if(enrollQueries.updateEducationLevel(ser))
        {
            return true;
        }else
        {
            return false;
        }
    }

    public List<EducationLevelStateReports> getStateEducationLevel(Integer cicloId){
        List<EducationLevelStateReports> ser=null;
        ser = enrollQueries.getStateEducationLevel(cicloId);
        return ser;
    }

    public List<EducationLevelSchoolsReports> getStateSchoolsEducationLevel(Integer cicloId, Integer idEntidad){
        List<EducationLevelSchoolsReports>  ser=null;
        ser = enrollQueries.getStateSchoolsEducationLevel(cicloId,idEntidad);
        return ser;
    }

    public List<EducationLevelSchoolReports> getStateSchoolEducationLevel(Integer cicloId, Integer idEntidad){
        List<EducationLevelSchoolReports>  ser=null;
        ser = enrollQueries.getStateSchoolEducationLevel(cicloId,idEntidad);
        return ser;
    }
}
