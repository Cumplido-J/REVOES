package mx.edu.cecyte.sisec.repo;

import mx.edu.cecyte.sisec.dto.LectureInserted;
import mx.edu.cecyte.sisec.dto.lecture.Lectures;
import mx.edu.cecyte.sisec.dto.lecture.LecturesCUAC;
import mx.edu.cecyte.sisec.model.lecture.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturesRepository extends JpaRepository<Lecture, Integer> {


    @Query(value="SELECT DISTINCT cu.id, u.id uac_id,  u.nombre, u.clave_uac, u.horas, u.creditos credits, u.campo_disciplinar_id  " +
            "FROM sisec.carrera c, sisec.carrera_uac cu, sisec.uac u " +
            "WHERE " +
            "cu.carrera_id=c.id " +
            "AND  " +
            "cu.uac_id=u.id " +
            "AND " +
            "c.clave_carrera = :clave_carrera", nativeQuery = true)
    List<LecturesCUAC> getLecturesByCareer( @Param("clave_carrera") String clave_carrera);


    @Query(value="SELECT cu.id, u.id uac_id, u.nombre, u.clave_uac, u.horas, u.creditos credits, u.campo_disciplinar_id  " +
            "FROM sisec.carrera c, sisec.carrera_uac cu, sisec.uac u " +
            "WHERE " +
            "cu.carrera_id=c.id " +
            "AND  " +
            "cu.uac_id=u.id " +
            "AND(u.nombre like %:busqueda% OR u.clave_uac like %:busqueda%) " +
            "AND " +
            "c.clave_carrera = :clave_carrera", nativeQuery = true)
    List<LecturesCUAC> getLecturesByCareer_UAC(@Param("busqueda") String busqueda, @Param("clave_carrera") String clave_carrera);

    @Modifying
    @Query(value="DELETE FROM sisec.carrera_uac cu " +
            "WHERE  cu.id=:id ", nativeQuery = true)
    int deleteLectureAssociationByCU_Id(@Param("id") Integer id);

    @Query(value="select u.id, u.nombre, u.clave_uac, u.md, u.ei, u.horas, u.creditos credits, u.semestre, u.optativa optativa, " +
            "       u.campo_disciplinar_id, u.tipo_uac_id, u.cecyte, u.modulo_id  " +
            "from sisec.uac u  " +
            "where u.id=:id", nativeQuery = true)
    List<Lectures> getLectureById(@Param("id") Integer id);

    @Modifying
    @Query(value="update sisec.uac " +
            "set nombre=:nombre, clave_uac=:clave_uac, md=:md, ei=:ei, horas=:horas, creditos=:creditos, semestre=:semestre, " +
            "optativa=:optativa, campo_disciplinar_id=:campo_disciplinar_id, tipo_uac_id=:tipo_uac_id, cecyte=:cecyte " +
            "where id=:id", nativeQuery = true)
    int updateLectureById(@Param("id")int id, @Param("nombre")String nombre, @Param("clave_uac")String clave_uac, @Param("md")int md,
                          @Param("ei")int ei, @Param("horas")int  horas, @Param("creditos")int creditos, @Param("semestre")int semestre,
                          @Param("optativa")Boolean optativa,@Param("campo_disciplinar_id") int campo_disciplinar_id,
                          @Param("tipo_uac_id") int tipo_uac_id, @Param("cecyte") Boolean cecyte);

    @Modifying
    @Query(value="insert into sisec.carrera_uac (semestre,carrera_id,uac_id) values (:semestre,:carrera_id,:uac_id)", nativeQuery = true)
    int insertLectureCareerAssociation(@Param("semestre") Integer semestre,@Param("carrera_id") Integer  carrera_id, @Param("uac_id") Integer uac_id);


    @Modifying
    @Query(value="insert into sisec.uac (nombre, clave_uac, md, ei, horas, creditos, semestre, optativa, " +
            "       campo_disciplinar_id, tipo_uac_id, cecyte, modulo_id) " +
            "values (:nombre, :clave_uac, :md, :ei, :horas, :creditos, :semestre, :optativa, " +
            "        :campo_disciplinar_id, :tipo_uac_id, :cecyte, :modulo_id)", nativeQuery = true)
    int insertLecture(@Param("nombre")String nombre, @Param("clave_uac")String clave_uac, @Param("md")int md,
                      @Param("ei")int ei, @Param("horas")int  horas, @Param("creditos")int creditos, @Param("semestre")int semestre,
                      @Param("optativa")Boolean optativa,@Param("campo_disciplinar_id") int campo_disciplinar_id,
                      @Param("tipo_uac_id") int tipo_uac_id, @Param("cecyte") Boolean cecyte, @Param("modulo_id") int modulo_id);

    @Query(value="SELECT distinct @@IDENTITY id FROM sisec.uac", nativeQuery = true)
    LectureInserted insertedLecture();
}







