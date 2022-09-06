package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.career.CareerData;
import mx.edu.cecyte.sisec.dto.career.CareerList;
import mx.edu.cecyte.sisec.dto.career.CareerModuleData;
import mx.edu.cecyte.sisec.dto.career.ModuleData;
import mx.edu.cecyte.sisec.log.CareerLogger;
import mx.edu.cecyte.sisec.service.CareerService;
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
@RequestMapping("/api/v1/career")
@Log4j
public class CareerController {

    @Autowired
    private CareerService careerService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> careerSearch( @LoggedUser UserSession userSession,
                                           @RequestParam(defaultValue = "") String searchText) {
        try {
            List< CareerList > careerList = careerService.careerSearch(searchText, userSession.getId());
            return CustomResponseEntity.OK(careerList);
        } catch (AppException exception) {
            CareerLogger.careerSearch(log, exception.getMessage(), userSession, searchText);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.careerSearch(log, exception.toString(), userSession, searchText);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/addCareer")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> addNewCareer(@LoggedUser UserSession userSession,
                                          @RequestBody CareerData careerData) {
        try {
            careerData = careerService.addNewCareer(careerData, userSession.getId());
            return CustomResponseEntity.OK(careerData);
        } catch (AppException exception) {
            CareerLogger.addNewCareer(log, exception.getMessage(), userSession,careerData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.addNewCareer(log, exception.toString(), userSession, careerData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/careers")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_SEGUIMIENTO', 'ROLE_CERTIFICACION')")
    public ResponseEntity<?> getAllCareer(@LoggedUser UserSession userSession){
        try {
            List<CareerList> careerList = careerService.getAllCareer(userSession.getId());

            return CustomResponseEntity.OK(careerList);
        } catch (AppException exception) {
            CareerLogger.getAllCareer(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.getAllCareer(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/{careerKey}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getCareerData(@LoggedUser UserSession userSession,
                                           @PathVariable String careerKey) {
        try {
            CareerData careerData = careerService.getCareerData(careerKey, userSession.getId());
            return CustomResponseEntity.OK(careerData);
        } catch (AppException exception) {
            CareerLogger.getCareerData(log, exception.getMessage(), userSession, careerKey);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.getCareerData(log, exception.toString(), userSession, careerKey);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/edit/{careerKey}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> editCareer(@LoggedUser UserSession userSession,
                                        @PathVariable String careerKey,
                                        @RequestBody CareerData careerData) {
        try {
            careerData = careerService.editCareer(careerData, careerKey, userSession.getId());
            return CustomResponseEntity.OK(careerData);
        } catch (AppException exception) {
            CareerLogger.editCareer(log, exception.getMessage(), userSession, careerData, careerKey);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.editCareer(log, exception.toString(), userSession, careerData, careerKey);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/addModule/{career}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> addModule(@LoggedUser UserSession userSession,
                                       @PathVariable Integer career,
                                       @RequestBody ModuleData moduleData) {
        try {
            moduleData = careerService.addModule(moduleData, career, userSession.getId());
            return CustomResponseEntity.OK(moduleData );
        } catch (AppException exception) {
            CareerLogger.addModule(log, exception.getMessage(), userSession, moduleData, career);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.addModule(log, exception.toString(), userSession, moduleData, career);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("/getModule/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> getModuleData(@LoggedUser UserSession userSession,
                                           @PathVariable Integer id) {
        //System.out.println(idcareerModule);
        try {
            ModuleData moduleData = careerService.getCareerModuleData(id, userSession.getId());
            return CustomResponseEntity.OK(moduleData);
        } catch (AppException exception) {
            CareerLogger.getCareerModuleData(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.getCareerModuleData(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/editModule/{id}/{career}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION')")
    public ResponseEntity<?> editCareerModule(@LoggedUser UserSession userSession,
                                              @PathVariable Integer id,
                                              @PathVariable Integer career,
                                              @RequestBody ModuleData moduleData) {
        try {
            moduleData = careerService.editCareerModule(moduleData, id,career, userSession.getId());
            return CustomResponseEntity.OK(moduleData);
        } catch (AppException exception) {
            CareerLogger.editCareerModule(log, exception.getMessage(), userSession, moduleData, id,career);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.editCareerModule(log, exception.toString(), userSession, moduleData, id,career);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @PostMapping("/deleteCompetences")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> deleteCompetences(@LoggedUser UserSession userSession,
                                               @RequestBody CareerModuleData ModuleData) {
        try {
            careerService.deleteCareerModule(ModuleData, userSession.getId());
            return CustomResponseEntity.OK("Registro eliminado");
        } catch (AppException exception) {
            CareerLogger.deleteCompetences(log, exception.getMessage(), userSession,ModuleData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.deleteCompetences(log, exception.toString(), userSession,ModuleData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
