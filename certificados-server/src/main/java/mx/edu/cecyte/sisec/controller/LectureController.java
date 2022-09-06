package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.lecture.Lectures;
import mx.edu.cecyte.sisec.dto.lecture.LecturesCUAC;
import mx.edu.cecyte.sisec.log.CareerLogger;
import mx.edu.cecyte.sisec.log.CatalogLogger;
import mx.edu.cecyte.sisec.model.lecture.*;
import mx.edu.cecyte.sisec.service.LectureService;
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
@RequestMapping("/api/v1/lectures")
@Log4j
public class LectureController {
    @Autowired private LectureService lecturesService;

    @GetMapping("/lecturesCareer/{clave_carrera}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getLecturesByCareer(@LoggedUser UserSession userSession, @PathVariable String clave_carrera)
    {
        try {
            System.out.println("en controller /getLecturesByCareer_UAC/"+clave_carrera+"/");
            List<LecturesCUAC> ser = lecturesService.getLecturesByCareer(clave_carrera);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            CareerLogger.getLecturesByCareer(log, exception.getMessage(), userSession, clave_carrera);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            CareerLogger.getLecturesByCareer(log, exception.toString(), userSession, clave_carrera);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @GetMapping("/lecturesCareer/{busqueda}/{clave_carrera}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getLecturesByCareer_UAC(@LoggedUser UserSession userSession, @PathVariable String busqueda, @PathVariable String clave_carrera)
    {
        try {
            System.out.println("en controller /getLecturesByCareer_UAC/"+busqueda+"/"+clave_carrera+"/");
            List<LecturesCUAC> ser = lecturesService.getLecturesByCareer_UAC(busqueda,clave_carrera);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            CareerLogger.getLecturesByCareer_UAC(log, exception.getMessage(), userSession, busqueda, clave_carrera);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            CareerLogger.getLecturesByCareer_UAC(log, exception.toString(), userSession, busqueda, clave_carrera);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }


    @DeleteMapping("/lectureCareer/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> deleteLectureAssociationByCU_Id(@LoggedUser UserSession userSession, @PathVariable Integer id)
    {
        try {
            System.out.println("en controller /deleteLectureAssociationByCU_Id/"+id+"/");
            if(lecturesService.deleteLectureAssociationByCU_Id(id)>0)
            {
                return CustomResponseEntity.OK("La asociacion carrera/materia se borro correctamente");
            }else
            {
                return CustomResponseEntity.BAD_REQUEST("La asociacion carrera/uac no se pudo borrar");
            }
        } catch (AppException exception) {
            CareerLogger.deleteLectureAssociationByCU_Id(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            if(exception.toString().contains("org.springframework.dao"))
            {
                return CustomResponseEntity.OK("No se puede borrar la asociacion entre carrera y materia, ya existen calificaciones cargadas");
            } else {
                return CustomResponseEntity.BAD_REQUEST(exception.toString());
            }
        }
    }

    @GetMapping("/lectures/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_SEGUIMIENTO','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> getLectureById(@LoggedUser UserSession userSession, @PathVariable Integer id)
    {
        try {
            System.out.println("en controller /getLectureById/"+id+"/");
            List<Lectures> ser = lecturesService.getLectureById(id);
            return CustomResponseEntity.OK(ser);
        } catch (AppException exception) {
            CareerLogger.getLectureById(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        } catch (Exception exception) {
            CareerLogger.getLectureById(log, exception.toString(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.toString());
        }
    }

    @PutMapping("/lectures/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> updateLectureById(@LoggedUser UserSession userSession, @PathVariable Integer id, @Valid @RequestBody Lecture ser)
    {
        try {
            //grabamos
            if(lecturesService.updateLectureById(id, ser)>0)
            {
                return CustomResponseEntity.OK("Se actualizo la materia");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }
        } catch (AppException exception) {
            CareerLogger.updateLectureById(log, exception.getMessage(), userSession, id, ser);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.updateLectureById(log, exception.toString(), userSession, id, ser);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/lectureCareer")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> insertLectureCareerAssociation(@LoggedUser UserSession userSession, @Valid @RequestBody LectureCareerAssociation ser)
    {

        try {
            //grabamos
            if(lecturesService.insertLectureCareerAssociation(ser.getSemestre(), ser.getCarrera_id(), ser.getUac_id())>0)
            {
                return CustomResponseEntity.OK("Se inserto la uac/carrera correctamente");
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }

        } catch (AppException exception) {
            CareerLogger.insertLectureCareerAssociation(log, exception.getMessage(), userSession, ser);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.insertLectureCareerAssociation(log, exception.toString(), userSession, ser);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/lecture/{id_carrera}")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_PLANEACION')")
    public ResponseEntity<?> insertLecture(@LoggedUser UserSession userSession, @PathVariable int id_carrera, @Valid @RequestBody Lecture ser)
    {
        int id_lecture=0;
        try {
            //grabamos
            if(lecturesService.insertLecture(ser)>0)
            {
                //id_carrera
                id_lecture+=lecturesService.getInsertedLecture();
                if(id_lecture>0)
                {
                    if(lecturesService.insertLectureCareerAssociation(ser.getSemestre(),id_carrera,id_lecture)>0)
                    {
                        return CustomResponseEntity.OK("Se creó la materia y la asociación con la carrera correctamente");
                    }
                }
            }
            else{
                return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
            }
            return CustomResponseEntity.BAD_REQUEST("No se pudo insertar o actualizar la informacion");
        } catch (AppException exception) {
            CareerLogger.insertLecture(log, exception.getMessage(), userSession, id_carrera, ser);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            CareerLogger.insertLecture(log, exception.toString(), userSession, id_carrera, ser);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}