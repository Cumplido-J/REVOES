package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.reports.*;
import mx.edu.cecyte.sisec.model.reports.GraduatesReports;
import mx.edu.cecyte.sisec.model.reports.ScholarEnrollmentReports;
import mx.edu.cecyte.sisec.model.reports.SchoolCycle;
import mx.edu.cecyte.sisec.model.reports.EducationLevelReports;
import mx.edu.cecyte.sisec.service.ScholarEnrollmentReportsService;

import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/v1/reports")
@Log4j
public class ReportsController {
    @Autowired private ScholarEnrollmentReportsService reportsService;
    @PostMapping("/scholarEnrollment")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> insertScholarEnrollmentReports(@LoggedUser UserSession userSession, @Valid @RequestBody List<ScholarEnrollmentReports> ser)
    {

        try {
            //grabamos
            if(reportsService.insertEnrolmentReports(ser))
            {
                return CustomResponseEntity.OK("{Todos los reportes han sido insertados}");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }

        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PutMapping("/scholarEnrollment")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> updateScholarEnrollmentReports(@LoggedUser UserSession userSession, @Valid @RequestBody List<ScholarEnrollmentReports> ser)
    {
        try {
            //grabamos
            if(reportsService.updateEnrolmentReports(ser))
            {
                return CustomResponseEntity.OK("{Todos los reportes han sido insertados}");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/scholarEnrollment/{plantelId}/{cicloId}/{matricula}/{carreraId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getEnrollReports(@LoggedUser UserSession userSession, @PathVariable Integer plantelId, @PathVariable String cicloId,
                                              @PathVariable String matricula, @PathVariable Integer carreraId)
    {
        try {
            List<ScholarEnrollmentReports> ser = reportsService.getScholarEnrollmentByIds(plantelId, cicloId, matricula, carreraId);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/stateEnrollment/{tipoPlantel}/{cicloId}/{matricula}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getReportsETCEMSByState(@LoggedUser UserSession userSession, @PathVariable String tipoPlantel, @PathVariable Integer cicloId,
                                              @PathVariable Integer matricula)
    {
        try {
            System.out.println("en controller /stateEnrollment/"+tipoPlantel+"/"+cicloId+"/"+matricula+"}");
            List<ScholarStateReports> ser = reportsService.reportsETCEMSByState(tipoPlantel,cicloId,matricula);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/stateSchoolsEnrollment/{tipoPlantel}/{cicloId}/{matricula}/{estado}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getReportsETCEMSBySchools(@LoggedUser UserSession userSession, @PathVariable String tipoPlantel, @PathVariable Integer cicloId, @PathVariable Integer matricula, @PathVariable Integer estado)
    {
        try {
            System.out.println("en controller /stateSchoolsEnrollment/"+tipoPlantel+"/"+cicloId+"/"+matricula+"/"+estado+"}");
            List<ScholarSchoolReports> ser = reportsService.reportsEnrollmentBySchools(tipoPlantel,cicloId,matricula,estado);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/stateSchoolCareerEnrollment/{cicloId}/{matricula}/{plantel}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getReportsETCEMSByCareer(@LoggedUser UserSession userSession, @PathVariable Integer cicloId, @PathVariable Integer matricula, @PathVariable Integer plantel)
    {
        try {
            System.out.println("en controller /stateSchoolCareerEnrollment/"+cicloId+"/"+matricula+","+plantel+"}");
            List<ScholarCareerReports> ser = reportsService.reportsEnrollmentByCareer(cicloId, matricula, plantel);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }



    @GetMapping("/schoolCycle")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getSchoolCycle(@LoggedUser UserSession userSession)
    {
        try {
            List<SchoolCycle> ser = reportsService.getSchoolCycle();
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    //////////////////////////////////////////////////////////////////
    //////////// egresados titulados
    //////////////////////////////////////////////////////////////////
    @GetMapping("/graduates/{plantelId}/{cicloId}/{matricula}/{carreraId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getGraduates(@LoggedUser UserSession userSession, @PathVariable Integer plantelId, @PathVariable String cicloId,
                                              @PathVariable String matricula, @PathVariable Integer carreraId)
    {
        try {
            List<GraduatesReports> ser = reportsService.getGraduatesByIds(plantelId, cicloId, matricula, carreraId);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/graduates")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> insertGraduates(@LoggedUser UserSession userSession, @Valid @RequestBody List<GraduatesReports> ser)
    {

        try {
            //grabamos
            if(reportsService.insertGraduatesReports(ser))
            {
                return CustomResponseEntity.OK("{Todos los reportes han sido insertados}");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }

        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PutMapping("/graduates")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> updateGraduates(@LoggedUser UserSession userSession, @Valid @RequestBody List<GraduatesReports> ser)
    {
        try {
            //grabamos
            if(reportsService.updateGraduatesReports(ser))
            {
                return CustomResponseEntity.OK("{Todos los reportes han sido insertados}");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/stateGraduates/{tipoPlantel}/{cicloId}/{matricula}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getGraduatesByState(@LoggedUser UserSession userSession, @PathVariable String tipoPlantel, @PathVariable Integer cicloId,
                                                     @PathVariable Integer matricula)
    {
        try {
            System.out.println("en controller /stateGraduates/"+tipoPlantel+"/"+cicloId+"/"+matricula+"}");
            List<GraduatesStateReports> ser = reportsService.graduatesByState(tipoPlantel,cicloId,matricula);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/stateSchoolGraduates/{tipoPlantel}/{cicloId}/{matriculaId}/{idEntidad}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getGraduatesByStateSchool(@LoggedUser UserSession userSession, @PathVariable String tipoPlantel, @PathVariable Integer cicloId,
                                                           @PathVariable Integer matriculaId, @PathVariable Integer idEntidad)
    {
        try {
            System.out.println("en controller /getGraduatesByStateSchool/"+tipoPlantel+"/"+cicloId+"/"+matriculaId+","+idEntidad+"}");
            List<GraduatesSchoolReports> ser = reportsService.graduatesByStateSchool(tipoPlantel,cicloId,matriculaId,idEntidad);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/stateSchoolCareerGraduates/{cicloId}/{matricula}/{plantelId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getGraduatesByStateSchoolCareer(@LoggedUser UserSession userSession, @PathVariable Integer cicloId,
                                                       @PathVariable Integer matricula, @PathVariable Integer plantelId)
    {
        try {
            System.out.println("en controller /stateSchoolCareerGraduates/"+cicloId+"/"+matricula+","+plantelId+"}");
            List<GraduatesSchoolCareerReports> ser = reportsService.graduatesByStateSchoolCareer(cicloId,matricula,plantelId);
            System.out.println("despues");
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            System.out.println("error ap"+exception.toString());
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            System.out.println("error ex"+exception.toString());
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    //////////////////////////////////////////////////////////////////
    //////////// Nivel de estudios
    //////////////////////////////////////////////////////////////////
    @GetMapping("/educationLevel/{stateId}/{schoolId}/{cicloId}/{turn}/{place}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getEducationLevel(@LoggedUser UserSession userSession, @PathVariable Integer stateId, @PathVariable Integer schoolId, @PathVariable Integer cicloId,
                                          @PathVariable String turn, @PathVariable String place)
    {
        try {
            List<EducationLevelReports> ser = reportsService.getEducationLevel(stateId,schoolId,cicloId,turn,place);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/educationLevel")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> insertEducationLevel(@LoggedUser UserSession userSession, @Valid @RequestBody List<EducationLevelReports> ser)
    {

        try {
            //grabamos
            if(reportsService.insertEducationLevel(ser))
            {
                return CustomResponseEntity.OK("{Todos los reportes han sido insertados}");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }

        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PutMapping("/educationLevel")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> updateEducationLevel(@LoggedUser UserSession userSession, @Valid @RequestBody List<EducationLevelReports> ser)
    {
        try {
            //grabamos
            if(reportsService.updateEducationLevel(ser))
            {
                return CustomResponseEntity.OK("{Todos los reportes han sido insertados}");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/stateEducationLevel/{cicloId}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getStateEducationLevel(@LoggedUser UserSession userSession, @PathVariable Integer cicloId)
    {
        try {
            System.out.println("en controller /getStateEducationLevel/"+cicloId+"}");
            List<EducationLevelStateReports> ser = reportsService.getStateEducationLevel(cicloId);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/stateSchoolsEducationLevel/{cicloId}/{idEntidad}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getStateSchoolsEducationLevel(@LoggedUser UserSession userSession, @PathVariable Integer cicloId, @PathVariable Integer idEntidad)
    {
        try {
            System.out.println("en controller /getStateSchoolsEducationLevel/"+cicloId+"/"+idEntidad+"}");
            List<EducationLevelSchoolsReports> ser = reportsService.getStateSchoolsEducationLevel(cicloId,idEntidad);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/stateSchoolEducationLevel/{cicloId}/{idPlantel}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getStateSchoolEducationLevel(@LoggedUser UserSession userSession, @PathVariable Integer cicloId, @PathVariable Integer idPlantel)
    {
        try {
            System.out.println("en controller /getStateSchoolEducationLevel/"+cicloId+"/"+idPlantel+"}");
            List<EducationLevelSchoolReports> ser = reportsService.getStateSchoolEducationLevel(cicloId,idPlantel);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }
}