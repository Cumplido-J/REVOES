package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.catalogs.*;
import mx.edu.cecyte.sisec.log.CatalogLogger;
import mx.edu.cecyte.sisec.service.CatalogService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalogs")
@Log4j
public class CatalogController {
    @Autowired private CatalogService catalogService;

    @GetMapping("/states")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getStateCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> states = catalogService.getStateCatalogs(userSession.getUsername());
            return CustomResponseEntity.OK(states);
        } catch (AppException exception) {
            CatalogLogger.getStateCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getStateCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/schools/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getSchoolCatalogs(@LoggedUser UserSession userSession,
                                               @PathVariable Integer stateId) {
        try {
            List<Catalog> schools = catalogService.getSchoolCatalogs(stateId, userSession.getUsername());
            return CustomResponseEntity.OK(schools);
        } catch (AppException exception) {
            CatalogLogger.getSchoolCatalogs(log, exception.getMessage(), userSession, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getSchoolCatalogs(log, exception.toString(), userSession, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/allcareers")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getAllCareersCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> careers = catalogService.getAllCareersCatalogs();
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getAllCareersCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getAllCareersCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/modulesbycareer/{careerId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getModulesByCareer(@LoggedUser UserSession userSession,
                                                @PathVariable Integer careerId) {
        try {
            List<Catalog> careers = catalogService.getModulesByCareer(careerId);
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getModulesByCareer(log, exception.getMessage(), userSession, careerId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getModulesByCareer(log, exception.toString(), userSession, careerId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    /*@GetMapping("/careers/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCareerCatalogs(@LoggedUser UserSession userSession,
                                               @PathVariable Integer schoolId) {
        try {
            List<Catalog> careers = catalogService.getCareerCatalogs(schoolId);
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getCareerCatalogs(log, exception.getMessage(), userSession, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCareerCatalogs(log, exception.toString(), userSession, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }*/

    @GetMapping("/careersByState/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCareerCatalogsByState(@LoggedUser UserSession userSession,
                                                      @PathVariable Integer stateId) {
        try {
            List<Catalog> careers = catalogService.getCareerCatalogsByState(stateId);
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getCareerCatalogsByState(log, exception.getMessage(), userSession, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCareerCatalogsByState(log, exception.toString(), userSession, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/cities/{stateId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCityCatalogs(@LoggedUser UserSession userSession,
                                             @PathVariable Integer stateId) {
        try {
            List<Catalog> cities = catalogService.getCityCatalogs(stateId);
            return CustomResponseEntity.OK(cities);
        } catch (AppException exception) {
            CatalogLogger.getCityCatalogs(log, exception.getMessage(), userSession, stateId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCityCatalogs(log, exception.toString(), userSession, stateId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/generations")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getAllGenerations(@LoggedUser UserSession userSession) {
        try {
            List<GenerationCatalog> generation = catalogService.getAllGenerationDes();
            return CustomResponseEntity.OK(generation);
        } catch (AppException exception) {
            CatalogLogger.getAllCareersCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getAllCareersCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/prueba")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> prueba(@LoggedUser UserSession userSession) {
        try {
            return CustomResponseEntity.OK("Esta es una prueba del funcionamiento de Java");
        } catch (AppException exception) {
            CatalogLogger.getStateCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getStateCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/role")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getRoleCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> role = catalogService.getRoleCatalogs(userSession.getUsername());
            return CustomResponseEntity.OK(role);
        } catch (AppException exception) {
            CatalogLogger.getStateCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getStateCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/cargo")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCargoCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> cargo = catalogService.getCargoCatalogs(userSession.getUsername());
            return CustomResponseEntity.OK(cargo);
        } catch (AppException exception) {
            CatalogLogger.getStateCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getStateCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/cargos")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCargosCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<CargoCatalog> cargos = catalogService.getCargosCatalogs();
            return CustomResponseEntity.OK(cargos);
        } catch (AppException exception) {
            CatalogLogger.getCargosCatalogs(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCargosCatalogs(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/getRoleUser")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getRoleUser(@LoggedUser UserSession userSession) {
        try {
            CargoCatalog rol = catalogService.getRoleUser(userSession.getUsername());
            return CustomResponseEntity.OK(rol);
        } catch (AppException exception) {
            CatalogLogger.getRoleUser(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getRoleUser(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @GetMapping("/personalRole")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getPersonalRole(@LoggedUser UserSession userSession) {
        try {
            List< Catalog > roles = catalogService.getPersonalRole(userSession.getUsername());
            return CustomResponseEntity.OK(roles);
        } catch (AppException exception) {
            CatalogLogger.getPersonalRole(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getPersonalRole(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/perfilTypo")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getPerfilCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> perfiles = catalogService.getPerfilCatalogs();
            return CustomResponseEntity.OK(perfiles);
        } catch (AppException exception) {
            CatalogLogger.getPerfilCatalogs(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getPerfilCatalogs(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/estudioTypo")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getEstudioCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> estudios = catalogService.getEstudioCatalogs();
            return CustomResponseEntity.OK(estudios);
        } catch (AppException exception) {
            CatalogLogger.getEstudioCatalogs(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getEstudioCatalogs(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/diciplinar")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getDiciplinarCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> diciplinary = catalogService.getDiciplinarCatalogs();
            return CustomResponseEntity.OK(diciplinary);
        } catch (AppException exception) {
            CatalogLogger.getDiciplinarCatalogs(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getDiciplinarCatalogs(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/subject")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getSubjectCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> subjects = catalogService.getSubjectCatalogs();
            return CustomResponseEntity.OK(subjects);
        } catch (AppException exception) {
            CatalogLogger.getSubjectCatalogs(log, exception.getMessage(),userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getSubjectCatalogs(log, exception.toString(),userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/competencias/{careerKey}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getCompetencias(@LoggedUser UserSession userSession,
                                             @PathVariable String careerKey) {
        try {
            ///List<Catalog> competList = catalogService.getCompetencias(careerId);
            List<CareerModuleCatalog> competList = catalogService.getCompetencias(careerKey);
            return CustomResponseEntity.OK(competList);
        } catch (AppException exception) {
            CatalogLogger.getCompetencias(log, exception.getMessage(), userSession, careerKey);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCompetencias(log, exception.toString(), userSession, careerKey);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/competencias")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getCompetenciasCatalogs(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> competencias = catalogService.getCompetenciaCatalogs();
            return CustomResponseEntity.OK(competencias);
        } catch (AppException exception) {
            CatalogLogger.getCompetenciaCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCompetenciaCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/careers/{schoolId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getCareerCatalogs(@LoggedUser UserSession userSession,
                                               @PathVariable Integer schoolId) {
        try {
            List< Catalogdos > careers = catalogService.getCareerCatalogsdos(schoolId);
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getCareerCatalogs(log, exception.getMessage(), userSession, schoolId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getCareerCatalogs(log, exception.toString(), userSession, schoolId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/subjectType")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getSubjectType(@LoggedUser UserSession userSession) {
        try {
            List<Catalog> subjectType = catalogService.getSubjectType();
            return CustomResponseEntity.OK(subjectType);
        } catch (AppException exception) {
            CatalogLogger.getSubjectType(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getSubjectType(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/diciplinaryCompentence")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getDiciplinaryCompentenceCatalogs(@LoggedUser UserSession userSession) {
        try {
            List< Catalog > careers = catalogService.getDiciplinaryCompentenceIsNotNullTrayecto();
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getDiciplinaryCompentenceCatalogs(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getDiciplinaryCompentenceCatalogs(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getAllGroups")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getAllGroups(@LoggedUser UserSession userSession) {
        try {
            List< Catalog > careers = catalogService.getAllGroups();
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getAllGroups(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getAllGroups(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getAllPermissions")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getAllPermissions(@LoggedUser UserSession userSession) {
        try {
            List< Catalog > careers = catalogService.getAllPermissions();
            return CustomResponseEntity.OK(careers);
        } catch (AppException exception) {
            CatalogLogger.getAllPermissions(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getAllPermissions(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getSchoolCycle")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> getSchoolCycle(@LoggedUser UserSession userSession) {
        try {
            List< Catalog > schoolCycle = catalogService.getSchoolCycle();
            return CustomResponseEntity.OK(schoolCycle);
        } catch (AppException exception) {
            CatalogLogger.getSchoolCycle(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.getSchoolCycle(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/selectPeriodFinished/{stateId}/{generationId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION','ROLE_TITULACION')")
    public ResponseEntity<?> selectPeriodFinished(@LoggedUser UserSession userSession,
                                                  @PathVariable Integer stateId,
                                                  @PathVariable String generationId) {
        try {
            List<Catalog> catalog = catalogService.selectPeriodFinished(stateId, generationId);
            return CustomResponseEntity.OK(catalog);
        } catch (AppException exception) {
            CatalogLogger.selectPeriodFinished(log, exception.getMessage(), userSession, stateId, generationId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CatalogLogger.selectPeriodFinished(log, exception.toString(), userSession, stateId, generationId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
