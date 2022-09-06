package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.lecture.Lectures;
import mx.edu.cecyte.sisec.dto.lecture.LecturesCUAC;
import mx.edu.cecyte.sisec.model.lecture.Lecture;
import mx.edu.cecyte.sisec.model.lecture.LectureCareerAssociation;
import mx.edu.cecyte.sisec.repo.LecturesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LecturesQueries {

    @Autowired private LecturesRepository lecturesRepository;

    public List<LecturesCUAC> getLecturesByCareer(String clave_carrera) {
        List<LecturesCUAC> ser=null;
        return ser=lecturesRepository.getLecturesByCareer(clave_carrera);
    }

    public List<LecturesCUAC> getLecturesByCareer_UAC(String busqueda, String clave_carrera) {
        List<LecturesCUAC> ser=null;
        return ser=lecturesRepository.getLecturesByCareer_UAC(busqueda, clave_carrera);
    }

    public int deleteLectureAssociationByCU_Id(Integer id) {
        int result=0;
        result+=lecturesRepository.deleteLectureAssociationByCU_Id(id);
        return result;
    }

    public List<Lectures> getLectureById(Integer id) {
        List<Lectures> ser=null;
        return ser=lecturesRepository.getLectureById(id);
    }

    public int updateLectureById(int id, Lecture ser) {
        int result=0;
        //validar tipo bit
        Boolean optativaBit=false;
        if(ser.getOptativa().equals("false"))
        {
            optativaBit=false;
        }else if (ser.getOptativa().equals("true"))
        {
            optativaBit=true;
        }else{
            optativaBit=null;
        }
        //validar tipo bit
        Boolean cecyteBit=false;
        if(ser.getCecyte().equals("false"))
        {
            cecyteBit=false;
        }else if (ser.getCecyte().equals("true"))
        {
            cecyteBit=true;
        }else{
            cecyteBit=null;
        }

        System.out.println("ser.getModulo_id():"+ser.getModulo_id());
        result+=lecturesRepository.updateLectureById(id,ser.getNombre(), ser.getClave_uac(), ser.getMd(),
                ser.getEi(), ser.getHoras(), ser.getCreditos(), ser.getSemestre(), optativaBit,
                ser.getCampo_disciplinar_id(), ser.getTipo_uac_id(), cecyteBit/*, ser.getModulo_id()*/);
        return result;
    }

    public int insertLectureCareerAssociation(int semestre,int carrera_id,int uac_id) {
        int result=0;
        result+=lecturesRepository.insertLectureCareerAssociation(semestre, carrera_id, uac_id);
        return result;
    }

    public int insertLecture(Lecture ser) {
        int result=0;
        int id_lecture=0;
        Boolean optativaBit=false;
        if(ser.getOptativa().equals("false"))
        {
            optativaBit=false;
        }else if (ser.getOptativa().equals("true"))
        {
            optativaBit=true;
        }else{
            optativaBit=null;
        }
        //validar tipo bit
        Boolean cecyteBit=false;
        if(ser.getCecyte().equals("false"))
        {
            cecyteBit=false;
        }else if (ser.getCecyte().equals("true"))
        {
            cecyteBit=true;
        }else{
            cecyteBit=null;
        }
        result+=lecturesRepository.insertLecture(ser.getNombre(), ser.getClave_uac(), ser.getMd(),
                ser.getEi(), ser.getHoras(), ser.getCreditos(), ser.getSemestre(), optativaBit,
                ser.getCampo_disciplinar_id(), ser.getTipo_uac_id(), cecyteBit, ser.getModulo_id());

        return result;
    }

    public int getInsertedLecture()
    {
        int result=0;
        result+=lecturesRepository.insertedLecture().getId();
        System.out.println("el id uac insertado:"+result);
        return result;
    }

}
