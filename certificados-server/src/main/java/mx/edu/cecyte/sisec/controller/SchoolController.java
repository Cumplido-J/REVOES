package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.SchoolFilter;
import mx.edu.cecyte.sisec.dto.school.*;
import mx.edu.cecyte.sisec.log.SchoolLogger;
import mx.edu.cecyte.sisec.service.SchoolService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/school")
@Log4j
public class SchoolController {
    @Autowired private SchoolService schoolService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> schoolSearch(@LoggedUser UserSession userSession,
                                          @RequestParam(defaultValue = "0") Integer stateId,
                                          @RequestParam(defaultValue = "0") Integer careerId,
                                          @RequestParam(defaultValue = "0") Integer schoolTypeId,
                                          @RequestParam(defaultValue = "") String cct) {
        SchoolFilter schoolFilter = new SchoolFilter(stateId, careerId, schoolTypeId, cct);
        try {
            //List<SchoolSearchResult> resultList = schoolService.schoolSearch(schoolFilter, 1);
            List<SchoolSearchResult> resultList = schoolService.schoolSearch(schoolFilter, userSession.getId());
            return CustomResponseEntity.OK(resultList);
        } catch (AppException exception) {
            SchoolLogger.schoolSearch(log, exception.getMessage(), userSession, schoolFilter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.schoolSearch(log, exception.toString(), userSession, schoolFilter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{cct}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getSchoolData(@LoggedUser UserSession userSession,
                                           @PathVariable String cct) {
        try {
            SchoolData schoolData = schoolService.getSchoolData(cct, userSession.getId());
            return CustomResponseEntity.OK(schoolData);
        } catch (AppException exception) {
            SchoolLogger.getSchoolData(log, exception.getMessage(), userSession, cct);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.getSchoolData(log, exception.toString(), userSession, cct);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> addNewSchool(@LoggedUser UserSession userSession,
                                          @RequestBody SchoolData schoolData) {
        try {
            schoolData = schoolService.addNewSchool(schoolData, userSession.getId());
            return CustomResponseEntity.OK(schoolData);
        } catch (AppException exception) {
            SchoolLogger.addNewSchool(log, exception.getMessage(), userSession, schoolData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.addNewSchool(log, exception.toString(), userSession, schoolData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/edit/{cct}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> editSchool(@LoggedUser UserSession userSession,
                                        @PathVariable String cct,
                                        @RequestBody SchoolData schoolData) {
        try {
            schoolData = schoolService.editSchool(schoolData, cct, userSession.getId());
            return CustomResponseEntity.OK(schoolData);
        } catch (AppException exception) {
            SchoolLogger.editSchool(log, exception.getMessage(), userSession, schoolData, cct);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.editSchool(log, exception.toString(), userSession, schoolData, cct);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addCareerSchool")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addCareerSchool(@LoggedUser UserSession userSession,
                                             @RequestBody SchoolCareerData schoolData) {
        try {
            schoolService.addNewCareerSchool(schoolData, userSession.getId());
            return CustomResponseEntity.OK("Registro exitoso");
        } catch (AppException exception) {
            SchoolLogger.addNewSchoolCareer(log, exception.getMessage(), userSession, schoolData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.addNewSchoolCareer(log, exception.toString(), userSession, schoolData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteCareerSchool")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deleteCareerSchool(@LoggedUser UserSession userSession,
                                                @RequestBody SchoolCareerData schoolData) {
        try {
            schoolService.deleteCareerSchool(schoolData, userSession.getId());
            return CustomResponseEntity.OK("Registro exitoso");
        } catch (AppException exception) {
            SchoolLogger.deleteSchoolCareer(log, exception.getMessage(), userSession, schoolData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.deleteSchoolCareer(log, exception.toString(), userSession, schoolData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/show/{careerId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getTotal(@LoggedUser UserSession userSession,
                                      @PathVariable Integer careerId) {
        try {
            Integer resultado= schoolService.getTotal(careerId,userSession.getId());
            return CustomResponseEntity.OK(resultado);
        } catch (AppException exception) {
            SchoolLogger.getTotal(log, exception.getMessage(), userSession, careerId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.getTotal(log, exception.toString(), userSession,careerId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteCareer/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deleteCareer(@LoggedUser UserSession userSession,
                                          @PathVariable Integer id,
                                          @RequestBody SchoolDto schoolDto) {
        try {
            schoolService.deleteCareer(id,schoolDto,userSession.getId());
            return CustomResponseEntity.OK("Registro exitoso");
        } catch (AppException exception) {
            SchoolLogger.deleteCareer(log, exception.getMessage(), userSession, id,schoolDto);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.deleteCareer(log, exception.toString(), userSession,id,schoolDto);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addchoolEquivaalent")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addchoolEquivaalent(@LoggedUser UserSession userSession,
                                                 @RequestBody SchoolEquivalentData schoolEquivalentData) {
        try {
            SchoolEquivalentData add = schoolService.addchoolEquivalent(schoolEquivalentData, userSession.getId());
            return  CustomResponseEntity.OK(add);
        } catch (AppException exception) {
            SchoolLogger.addchoolEquivaalent(log, exception.getMessage(), userSession, schoolEquivalentData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.addchoolEquivaalent(log, exception.toString(), userSession, schoolEquivalentData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/selectSchoolEquivalent/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> selectSchoolEquivalent(@LoggedUser UserSession userSession,
                                                    @PathVariable Integer schoolId) {
        try {
            List<SchoolEquivalentData> select = schoolService.selectSchoolEquivalent(schoolId, userSession.getId());
            return CustomResponseEntity.OK(select);
        } catch (AppException exception) {
            SchoolLogger.selectSchoolEquivalent(log, exception.getMessage(), userSession, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.selectSchoolEquivalent(log, exception.toString(), userSession, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/updateSchoolEquivalent")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> updateSchoolEquivalent(@LoggedUser UserSession userSession,
                                                    @RequestBody SchoolEquivalentData schoolEquivalentData) {
        try {
            SchoolEquivalentData update = schoolService.updateSchoolEquivalent(schoolEquivalentData, userSession.getId());
            return CustomResponseEntity.OK(update);
        } catch (AppException exception) {
            SchoolLogger.updateSchoolEquivalent(log, exception.getMessage(), userSession, schoolEquivalentData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.updateSchoolEquivalent(log, exception.toString(), userSession, schoolEquivalentData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteSchoolEquivalent/{equivalentId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deleteSchoolEquivalent(@LoggedUser UserSession userSession,
                                                    @PathVariable Integer equivalentId) {
        try {
            schoolService.deleteSchoolEquivalent(equivalentId, userSession.getId());
            return CustomResponseEntity.OK("Regisstro eliminado exitosamente");
        } catch (AppException exception) {
            SchoolLogger.deleteSchoolEquivalent(log, exception.getMessage(), userSession, equivalentId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.deleteSchoolEquivalent(log, exception.toString(), userSession, equivalentId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/schoolEquivalentSearch")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> schoolEquivalentSearch(@LoggedUser UserSession userSession,
                                                    @RequestParam(defaultValue = "0") Integer stateId,
                                                    @RequestParam(defaultValue = "0") Integer careerId,
                                                    @RequestParam(defaultValue = "0") Integer schoolTypeId,
                                                    @RequestParam(defaultValue = "") String cct){
        SchoolFilter schoolFilter = new SchoolFilter(stateId, careerId, schoolTypeId, cct);
        try {
            List<SchoolEquivalentSearchResult> select = schoolService.schoolEquivalentSearch(schoolFilter, userSession.getId());
            return CustomResponseEntity.OK(select);
        } catch (AppException exception) {
            SchoolLogger.schoolEquivalentSearch(log, exception.getMessage(), userSession, schoolFilter);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.schoolEquivalentSearch(log, exception.toString(), userSession, schoolFilter);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    ///codigo eugenio mapa
    @GetMapping("/schoolByState/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> schoolByState(@LoggedUser UserSession userSession,
                                           @PathVariable Integer stateId) {
        try {
            List<SchoolSearchResult> resultList = schoolService.schoolByState(stateId, userSession.getId());
            return CustomResponseEntity.OK(resultList);
        } catch (AppException exception) {
            SchoolLogger.schoolByState(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SchoolLogger.schoolByState(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
