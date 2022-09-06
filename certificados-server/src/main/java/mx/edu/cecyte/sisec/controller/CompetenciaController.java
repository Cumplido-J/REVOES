package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.competence.CompetenceData;
import mx.edu.cecyte.sisec.dto.competence.CompetenceList;
import mx.edu.cecyte.sisec.log.CompetenceLogger;
import mx.edu.cecyte.sisec.service.CompetenceService;
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
@RequestMapping("/api/v1/competencia")
@Log4j
public class CompetenciaController {

    @Autowired
    private CompetenceService competenceService;

    @PostMapping("/addCompetencia")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> addCompetencia( @LoggedUser UserSession userSession,
                                             @RequestBody CompetenceData competenceData) {
        try {
            competenceData = competenceService.addCompetence(competenceData, userSession.getId());
            return CustomResponseEntity.OK(competenceData);
        } catch (AppException exception) {
            CompetenceLogger.addCompetencia(log, exception.getMessage(), userSession,competenceData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CompetenceLogger.addCompetencia(log, exception.toString(), userSession, competenceData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/competencias")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO', 'ROLE_CERTIFICACION')")
    public ResponseEntity<?> getAllCompetencia(@LoggedUser UserSession userSession){
        try {
            List< CompetenceList > lista =competenceService.getAllCompetence(userSession.getId());
            return CustomResponseEntity.OK(lista);
        } catch (AppException exception) {
            CompetenceLogger.getAllCompetence(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CompetenceLogger.getAllCompetence(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getCompetenceData(@LoggedUser UserSession userSession,
                                               @PathVariable Integer id) {
        try {

            CompetenceData competenceData = competenceService.getCompetenceData(id, userSession.getId());
            //System.out.println(competenceData);
            return CustomResponseEntity.OK(competenceData );
        } catch (AppException exception) {
            CompetenceLogger.getCompetenceData(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CompetenceLogger.getCompetenceData(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> editCompetence(@LoggedUser UserSession userSession,
                                            @PathVariable Integer id,
                                            @RequestBody CompetenceData competenceData) {
        try {
            competenceData = competenceService.editCompetence(competenceData, id, userSession.getId());
            return CustomResponseEntity.OK(competenceData);
        } catch (AppException exception) {
            CompetenceLogger.editCompetence(log, exception.getMessage(), userSession, competenceData, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CompetenceLogger.editCompetence(log, exception.toString(), userSession, competenceData, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> moduleSearch(@LoggedUser UserSession userSession,
                                          @RequestParam(defaultValue = "") String searchText) {
        try {
            List<CompetenceList> lista = competenceService.moduleSearch(searchText, userSession.getId());
            return CustomResponseEntity.OK(lista);
        } catch (AppException exception) {
            CompetenceLogger.moduleSearch(log, exception.getMessage(), userSession, searchText);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CompetenceLogger.moduleSearch(log, exception.toString(), userSession, searchText);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}

