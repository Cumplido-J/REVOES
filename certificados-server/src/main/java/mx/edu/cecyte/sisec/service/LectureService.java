package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.lecture.Lectures;
import mx.edu.cecyte.sisec.dto.lecture.LecturesCUAC;
import mx.edu.cecyte.sisec.model.lecture.Lecture;
import mx.edu.cecyte.sisec.queries.LecturesQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LectureService {
    @Autowired private LecturesQueries lecturesQueries;

    public List<LecturesCUAC> getLecturesByCareer(String clave_carrera) {
        List<LecturesCUAC> ser=null;
        ser=lecturesQueries.getLecturesByCareer(clave_carrera);
        return ser;
    }

    public List<LecturesCUAC> getLecturesByCareer_UAC(String busqueda,String clave_carrera) {
        List<LecturesCUAC> ser=null;
        ser=lecturesQueries.getLecturesByCareer_UAC(busqueda,clave_carrera);
        return ser;
    }

    @Transactional
    public int deleteLectureAssociationByCU_Id(Integer id) {
        return lecturesQueries.deleteLectureAssociationByCU_Id(id);
    }

    public List<Lectures> getLectureById(Integer id) {
        List<Lectures> ser=null;
        ser=lecturesQueries.getLectureById(id);
        return ser;
    }

    @Transactional
    public int updateLectureById(int id, Lecture ser) {
        return lecturesQueries.updateLectureById(id,ser);
    }

    @Transactional
    public int insertLectureCareerAssociation(int semestre,int carrera_id,int uac_id) {
        return lecturesQueries.insertLectureCareerAssociation(semestre,carrera_id,uac_id);
    }

    @Transactional
    public int insertLecture(Lecture ser) {
        return lecturesQueries.insertLecture(ser);
    }

    public int getInsertedLecture(){
        return lecturesQueries.getInsertedLecture();
    }
}
