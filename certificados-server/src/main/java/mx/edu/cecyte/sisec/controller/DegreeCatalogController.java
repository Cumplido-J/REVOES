package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.degree.StudentPeriodDate;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.degree.DgpSchoolSelect;
import mx.edu.cecyte.sisec.log.DegreeCatalogsLogger;
import mx.edu.cecyte.sisec.service.degree.DegreeCatalogService;
import mx.edu.cecyte.sisec.shared.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/degreeCatalogs")
@Log4j
public class DegreeCatalogController {
    @Autowired private DegreeCatalogService catalogService;

    @GetMapping("/antecedents")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getAntecedents(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> states = catalogService.getAntecedents();
            return CustomResponseEntity.OK(states);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getAntecedents(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getAntecedents(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/reasons")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getReasons(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> reasons = catalogService.getReasons();
            return CustomResponseEntity.OK(reasons);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getReasons(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getReasons(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/auths")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getAuths(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> auths = catalogService.getAuths();
            return CustomResponseEntity.OK(auths);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getAuths(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getAuths(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/modalities")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getModalities(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> modalities = catalogService.getModalities();
            return CustomResponseEntity.OK(modalities);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getModalities(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getModalities(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/signers")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getSigners(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> signers = catalogService.getSigners();
            return CustomResponseEntity.OK(signers);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getSigners(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getSigners(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/socialService")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getSocialService(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> socialService = catalogService.getSocialService();
            return CustomResponseEntity.OK(socialService);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getSocialService(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getSocialService(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    
    @GetMapping("/degreeStates")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getDegreeStates(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> degreestates = catalogService.getDegreeStates(userSession.getUsername());
            return CustomResponseEntity.OK(degreestates);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getDegreeStates(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getDegreeStates(log, exception.toString(), userSession);
            return  CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/degreeCarrer/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> getDegreeCarrer(@LoggedUser UserSession userSession,
                                             @PathVariable String studentCurp) {
        try {
            List<Catalog> degreeCarrer = catalogService.getDegreeCarrer(studentCurp);
            return CustomResponseEntity.OK(degreeCarrer);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getDegreeCarrer(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getDegreeCarrer(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/degreSchools/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public  ResponseEntity<?> getDegreeSchools(@LoggedUser UserSession userSession,
                                               @PathVariable Integer stateId) {
        try {
            List<DgpSchoolSelect> degreeSchools = catalogService.getDegreeSchools(stateId, userSession.getUsername());
            return CustomResponseEntity.OK(degreeSchools);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getDegreeSchools(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch(Exception exception) {
            DegreeCatalogsLogger.getDegreeSchools(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/degreeCarrers/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> degreeCarrers(@LoggedUser UserSession userSession,
                                           @PathVariable Integer schoolId) {
        try {
            List<Catalog> degreeCarrers = catalogService.getDegreeCarrers(schoolId);
            return CustomResponseEntity.OK(degreeCarrers);
        } catch (AppException exception) {
            DegreeCatalogsLogger.getDegreeCarrers(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.getDegreeCarrers(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/degreeAllStates")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> degreeAllStates(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> degreeStates = catalogService.degreeAllStates(userSession.getUsername());
            return CustomResponseEntity.OK(degreeStates);
        } catch (AppException exception) {
            DegreeCatalogsLogger.degreeAllStates(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.degreeAllStates(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/careerAllDgp")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> careerAllDgp(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> career = catalogService.careerAllDgp();
            return CustomResponseEntity.OK(career);
        } catch (AppException exception) {
            DegreeCatalogsLogger.careerAllDgp(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.careerAllDgp(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/schoolsNormalAll")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> schoolsNormalAll(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> school = catalogService.schoolsNormalAll();
            return CustomResponseEntity.OK(school);
        } catch (AppException exception) {
            DegreeCatalogsLogger.schoolsNormalAll(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.schoolsNormalAll(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/searSchoolDgp/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> searSchoolDgp(@LoggedUser UserSession userSession,
                                          @PathVariable Integer schoolId) {
        try {
            List<Catalog> school = catalogService.searSchoolDgpFindById(schoolId);
            return CustomResponseEntity.OK(school);
        } catch (AppException exception) {
            DegreeCatalogsLogger.searSchoolDgp(log, exception.getMessage(), userSession, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.searSchoolDgp(log, exception.toString(), userSession, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/studentPeriodDate/{studentCurp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> studentPeriodDate(@LoggedUser UserSession userSession,
                                               @PathVariable String studentCurp) {
        try {
            List<StudentPeriodDate> student = catalogService.studentPeriodDate(studentCurp);
            return CustomResponseEntity.OK(student);
        } catch (AppException exception) {
            DegreeCatalogsLogger.studentPeriodDate(log, exception.getMessage(), userSession, studentCurp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.studentPeriodDate(log, exception.toString(), userSession, studentCurp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/stateListAll")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION', 'ROLE_TITULACION')")
    public ResponseEntity<?> stateListAll(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> states = catalogService.stateListAll(userSession);
            return CustomResponseEntity.OK(states);
        } catch (AppException exception) {
            DegreeCatalogsLogger.stateListAll(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            DegreeCatalogsLogger.stateListAll(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
