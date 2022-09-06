package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.people.PersonaData;
import mx.edu.cecyte.sisec.dto.people.PersonaList;
import mx.edu.cecyte.sisec.log.PersonaLogger;
import mx.edu.cecyte.sisec.service.PersonaService;
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
@RequestMapping("/api/v1/persona")
@Log4j
public class PersonaController {
    @Autowired private PersonaService personaService;
    @GetMapping("/personas")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO', 'ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getAllPersona(@LoggedUser UserSession userSession){
        //@RequestParam(defaultValue = "0") Integer stateid
        try {
            //List<PersonaData> personaData = personaService.getAllPersona(stateid, userSession.getId());
            List<PersonaList> personaData = personaService.getAllPersona(userSession.getId());
            //List<PersonaList> personaData = personaService.getAllPersona(stateid, userSession.getId());
            return CustomResponseEntity.OK(personaData);
        } catch (AppException exception) {
            //PersonaLogger.getAllPersona(log, exception.getMessage(), userSession, stateid);
            PersonaLogger.getAllPersona(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            //PersonaLogger.getAllPersona(log, exception.toString(), userSession,stateid);
            PersonaLogger.getAllPersona(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/addPersona")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> addNewPersona(@LoggedUser UserSession userSession,
                                           @RequestBody PersonaData personaData) {
        try {
            personaData = personaService.addNewPersona(personaData, userSession.getId());
            return CustomResponseEntity.OK(personaData);
        } catch (AppException exception) {
            PersonaLogger.addNewPersona(log, exception.getMessage(), userSession,personaData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            PersonaLogger.addNewPersona(log, exception.toString(), userSession, personaData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/edit/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> editPersona(@LoggedUser UserSession userSession,
                                        @PathVariable String curp,
                                        @RequestBody PersonaData personaData) {
        try {
            personaData = personaService.editPersona(personaData, curp, userSession.getId());
            return CustomResponseEntity.OK(personaData);
        } catch (AppException exception) {
            PersonaLogger.editPersona(log, exception.getMessage(), userSession, personaData, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            PersonaLogger.editPersona(log, exception.toString(), userSession, personaData, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> getPersonaData(@LoggedUser UserSession userSession,
                                           @PathVariable String curp) {
        try {
            PersonaData personaData = personaService.getPersonaData(curp, userSession.getId());
            return CustomResponseEntity.OK(personaData);
        } catch (AppException exception) {
            PersonaLogger.getPersonaData(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            PersonaLogger.getPersonaData(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("delete/{curp}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> deletePersonaData(@LoggedUser UserSession userSession,
                                            @PathVariable String curp) {
        try {
            personaService.deleteData(curp, userSession.getId());
            return CustomResponseEntity.OK("Eliminado");
        } catch (AppException exception) {
            PersonaLogger.getDeleteData(log, exception.getMessage(), userSession, curp);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            PersonaLogger.getDeleteData(log, exception.toString(), userSession, curp);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
