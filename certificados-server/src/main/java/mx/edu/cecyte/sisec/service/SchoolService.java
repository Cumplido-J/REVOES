package mx.edu.cecyte.sisec.service;

import io.swagger.models.auth.In;
import mx.edu.cecyte.sisec.classes.SchoolFilter;
import mx.edu.cecyte.sisec.dto.school.*;
import mx.edu.cecyte.sisec.model.catalogs.CatCity;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.education.SchoolEquivalent;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SchoolService {

    @Autowired private SchoolSearchQueries schoolSearchQueries;
    @Autowired private UserQueries userQueries;
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private SchoolCareerQueries schoolCareerQueries;
    @Autowired private StudentQueries studentQueries;

    public List<SchoolSearchResult> schoolSearch(SchoolFilter schoolFilter, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(schoolFilter.getStateId(),adminUser,AppCatalogs.isState);
        return schoolSearchQueries.schoolSearch(schoolFilter, availableSchoolIds);
    }

    public SchoolData addNewSchool(SchoolData schoolData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);

        boolean stateAvailableForAdmin = userQueries.isStateAvailableForAdmin(adminUser, schoolData.getStateId());
        if (!stateAvailableForAdmin) throw new AppException(Messages.state_noEditPermissions);

        boolean cctExists = schoolSearchQueries.cctExists(schoolData.getCct());
        if (cctExists) throw new AppException(Messages.school_cctIsInUse);

        School school = schoolSearchQueries.addNewSchool(schoolData);
        auditingQueries.saveAudit("StudentService", "addNewSchool", adminId, School.class, school.getId(), "Added new school, " + schoolData);
        return new SchoolData(school);
    }

    public SchoolData getSchoolData(String cct, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        School school = schoolSearchQueries.getSchoolByCct(cct);
        boolean schoolAvailableForAdmin = userQueries.isStateAvailableForAdmin(adminUser, school.getCity().getState().getId());
        //boolean schoolAvailableForAdmin = userQueries.isSchoolAvailableForAdmin(adminUser, school.getId());
        if (!schoolAvailableForAdmin) throw new AppException(Messages.school_noEditPermissions);

        return new SchoolData(school);
    }

    public SchoolData editSchool(SchoolData schoolData, String cct, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        School school = schoolSearchQueries.getSchoolByCct(cct);

        //boolean isStateAvailableForAdmin = userQueries.isStateAvailableForAdmin(adminUser, schoolData.getCityId());
        boolean isStateAvailableForAdmin = userQueries.isStateAvailableForAdmin(adminUser, schoolData.getStateId());
        if (!isStateAvailableForAdmin) throw new AppException(Messages.state_noEditPermissions);

        if (!cct.equalsIgnoreCase(schoolData.getCct())) {
            if (userQueries.isDevAdmin(adminUser)) {
                boolean cctExists = schoolSearchQueries.cctExists(schoolData.getCct());
                if (cctExists) throw new AppException(Messages.school_cctIsInUse);
            } else {
                schoolData.setCct(cct);
            }
        }

        school = schoolSearchQueries.editSchool(school, schoolData);
        auditingQueries.saveAudit("SchoolService", "editSchool", adminId, School.class, school.getId(), "Edited school, " + schoolData);
        return new SchoolData(school);
    }

    public void addNewCareerSchool(SchoolCareerData schoolData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        schoolCareerQueries.getBySchoolCctList(schoolData.getCct()).forEach(item->
        {
            schoolData.getCareerTypeId().forEach(career -> {
                if (career.equals(item.getCareer().getId())){
                    throw new AppException("carrera "+item.getCareer().getName()+" asignada anteriormente al plantel");
                }
            });
        });
        List<Integer> schoolCareers = schoolSearchQueries.addNewSchoolCareer(schoolData)
                .parallelStream()
                .map(schoolCareer -> schoolCareer.getId()).collect(Collectors.toList());
        auditingQueries.saveAudits("SchoolService", "addNewCareerSchool", adminId, School.class, schoolCareers, "Added new career at school");

    }
    public void deleteCareerSchool(SchoolCareerData schoolData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        schoolSearchQueries.deleteSchoolCareer(schoolData);
        auditingQueries.saveAudits("SchoolService", "deleteCareerSchool", adminId, School.class, schoolData.getCareerTypeId(), "delete career at school");
    }

    public Integer getTotal(Integer id,Integer adminId){
        SchoolCareer schoolCareer=schoolCareerQueries.getById(id);
        return studentQueries.getCountBySchoolCareer(schoolCareer);
    }

    public void deleteCareer( Integer id, SchoolDto schoolDto, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        SchoolCareer schoolCareer=schoolCareerQueries.getById(id);
        //pase de parametro para actualizar alumno.plantel_carrera_id
        SchoolCareer schoolCareerChange=schoolCareerQueries.getById(schoolDto.getCareerId());
        //lista de alumnos;
        List< Student > student=studentQueries.getByStudentSchoolCareer(schoolCareer);
        //llamar el metodo de actualizar.
        studentQueries.careerChange(student,schoolCareerChange);
        //Eliminar el id de plantel carrera despues de actualizar
        schoolSearchQueries.deleteCareer(id);
        auditingQueries.saveAudit("SchoolService", "deleteCareer", adminId, School.class, id, "Career delete");

    }

    public SchoolEquivalentData addchoolEquivalent(SchoolEquivalentData schoolData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        //boolean cctExists = schoolSearchQueries.schooEquivalentExist(schoolData.getCct());
        //if (cctExists) throw new AppException(Messages.school_cctIsInUse);


        School school = new School(); school.setId(schoolData.getSchoolId());
        boolean schooEquivalentExist = schoolSearchQueries.hasSchoolEquivalent(school);
        if (schooEquivalentExist) throw new AppException(Messages.school_idIsInUse);
        CatCity city = new CatCity(); city.setId(schoolData.getCityId());
        SchoolEquivalent equivalent = new SchoolEquivalent(schoolData, school, city);
        schoolSearchQueries.addSchoolEquivalent(equivalent);
        return new SchoolEquivalentData(equivalent);
    }

    public List<SchoolEquivalentData> selectSchoolEquivalent(Integer schoolId, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        List<SchoolEquivalentData> school = schoolSearchQueries.selectSchoolEquivalent(schoolId);
        return school;
    }

    public SchoolEquivalentData updateSchoolEquivalent(SchoolEquivalentData schoolData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        SchoolEquivalent equivalent =  schoolSearchQueries.findBySchool(schoolData.getSchoolId());
        School school = new School(); school.setId(schoolData.getSchoolId());
        CatCity city = new CatCity(); city.setId(schoolData.getCityId());
        equivalent.setSchool(school); equivalent.setCity(city); equivalent.setPdfName(schoolData.getPdfName());
        equivalent.setCct(schoolData.getCct()); equivalent.setGender(schoolData.getGender());
        schoolSearchQueries.addSchoolEquivalent(equivalent);
        return new SchoolEquivalentData(equivalent);
    }

    public void deleteSchoolEquivalent(Integer equivalentId, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        SchoolEquivalent equivalent =  schoolSearchQueries.findBySchool(equivalentId);
        schoolSearchQueries.deleteSchoolEquivalent(equivalent);
    }

    public List<SchoolEquivalentSearchResult> schoolEquivalentSearch(SchoolFilter schoolFilter, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(schoolFilter.getStateId(),adminUser, AppCatalogs.isState);
        return schoolSearchQueries.schoolEquivalentSearch(schoolFilter, availableSchoolIds);
    }
    public List<SchoolSearchResult> schoolByState(Integer stateId, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,adminUser,AppCatalogs.isState);
        return schoolSearchQueries.schoolSearchByState(stateId, availableSchoolIds);
    }
}
