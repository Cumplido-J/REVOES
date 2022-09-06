package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.dto.degree.DegreeIntituteDgp;
import mx.edu.cecyte.sisec.dto.degree.DgpCombinationCareer;
import mx.edu.cecyte.sisec.dto.degree.DgpSelectCareer;
import mx.edu.cecyte.sisec.log.DgpLogger;
import mx.edu.cecyte.sisec.service.degree.DgpServices;
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
@RequestMapping("/api/v1/dgps")
@Log4j
public class DgpController {
    @Autowired private DgpServices dgpServices;

    @GetMapping("/selectSchool/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> selectSchoolDgp(@LoggedUser UserSession userSession,
                                             @PathVariable Integer schoolId) {
        try {
            DegreeIntituteDgp school = dgpServices.selectSchoolDgp(schoolId);
            return CustomResponseEntity.OK(school);
        } catch (AppException exception) {
            DgpLogger.selectSchoolDgp(log, exception.getMessage(), userSession, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.selectSchoolDgp(log, exception.toString(), userSession, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/updateSchoolDgp")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> updateSchoolDgp(@LoggedUser UserSession userSession,
                                             @RequestBody DegreeIntituteDgp degreeIntituteDgp) {
        try {
            dgpServices.updateSchoolDgp(degreeIntituteDgp);
            return CustomResponseEntity.OK("Los datos del Plantel han sido cambiados");
        } catch (AppException exception) {
            DgpLogger.updateSchoolDgp(log, exception.getMessage(), userSession, degreeIntituteDgp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.updateSchoolDgp(log, exception.toString(), userSession, degreeIntituteDgp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addNewSchoolDgp")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> addNewSchoolDgp(@LoggedUser UserSession userSession,
                                             @RequestBody DegreeIntituteDgp degreeIntituteDgp){
        try {
            degreeIntituteDgp = dgpServices.addNewSchoolDgp(degreeIntituteDgp);
            return CustomResponseEntity.OK(degreeIntituteDgp);
        } catch (AppException exception) {
            DgpLogger.addNewSchoolDgp(log, exception.getMessage(), userSession, degreeIntituteDgp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.addNewSchoolDgp(log, exception.toString(), userSession, degreeIntituteDgp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addCombinationCareer")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> addCombinationCareer(@LoggedUser UserSession userSession,
                                                  @RequestBody DgpCombinationCareer dgpCombinationCareer) {
        try {
            DgpCombinationCareer combination = dgpServices.DgpCombinationCareer(dgpCombinationCareer);
            return CustomResponseEntity.OK(combination);
        } catch (AppException exception) {
            DgpLogger.DgpCombinationCareer(log, exception.getMessage(), userSession, dgpCombinationCareer);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.DgpCombinationCareer(log, exception.toString(), userSession, dgpCombinationCareer);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addNewCareerDgp")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> addNewCareerDgp(@LoggedUser UserSession userSession,
                                             @RequestBody DgpSelectCareer dgpSelectCareer) {
        try {
            DgpSelectCareer add = dgpServices.addNewCareerDgp(dgpSelectCareer);
            return CustomResponseEntity.OK(add);
        } catch (AppException exception) {
            DgpLogger.addNewCareerDgp(log, exception.getMessage(), userSession, dgpSelectCareer);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.addNewCareerDgp(log, exception.toString(), userSession, dgpSelectCareer);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("selectAllCareerDgp")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> selectAllCareerDgp(@LoggedUser UserSession userSession) {
        try {
            List<DgpSelectCareer> select = dgpServices.selectAllCareerDgp();
            return CustomResponseEntity.OK(select);
        } catch (AppException exception) {
            DgpLogger.selectAllCareerDgp(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.selectAllCareerDgp(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/selectAllDecree/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> selectAllDecree(@LoggedUser UserSession userSession,
                                             @PathVariable Integer stateId) {
        try {
            List<DecreeSelect> decree = dgpServices.selectAllDecree(stateId);
            return CustomResponseEntity.OK(decree);
        } catch (AppException exception) {
            DgpLogger.selectAllDecree(log, exception.getMessage(), userSession, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.selectAllDecree(log, exception.toString(), userSession, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/updateStateDecree")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> updateStateDecree(@LoggedUser UserSession userSession,
                                               @RequestBody DecreeSelect decreeSelect) {
        try {
            DecreeSelect update = dgpServices.updateStateDecree(decreeSelect);
            return CustomResponseEntity.OK(update);
        } catch (AppException exception) {
            DgpLogger.updateStateDecree(log, exception.getMessage(), userSession, decreeSelect);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.updateStateDecree(log, exception.toString(), userSession, decreeSelect);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/deleteCombinationCareer/{combinationId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> deleteCombinationCareer(@LoggedUser UserSession userSession,
                                                     @PathVariable Integer combinationId) {
        try {
            String delete = dgpServices.deleteCombinationCareer(combinationId);
            return CustomResponseEntity.OK(delete);
        } catch (AppException exception) {
            DgpLogger.deleteCombinationCareer(log, exception.getMessage(), userSession, combinationId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DgpLogger.deleteCombinationCareer(log, exception.toString(), userSession, combinationId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
