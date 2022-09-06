package mx.edu.cecyte.sisec.repo.mec;

import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.student.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Integer> {

    @Query("SELECT certificate " +
            "FROM Certificate certificate " +
            "WHERE certificate.fileName IN :fileNames")
    List<Certificate> findAllByFileName(List<String> fileNames);

    @Query("SELECT certificate " +
            "FROM Certificate certificate " +
            "WHERE certificate.fileName = :fileName " +
            "AND certificate.status = :status")
    Optional<Certificate> findInProcessByFileName(String fileName, String status);

    @Query("SELECT certificate " +
            "FROM Certificate certificate " +
            "WHERE certificate.student.user.username = :username " +
            "AND certificate.status = :status")
    Optional<Certificate> findByUsernameAndStatus(String username, String status);

    @Query("SELECT certificate " +
            "FROM Certificate certificate " +
            "WHERE certificate.student.user.username IN :usernames " +
            "AND certificate.status = :status")
    List<Certificate> findListByStatusAndUsername(List<String> usernames, String status);

    Optional<Certificate> findByFolio(String folioNumber);

    @Query("SELECT COUNT(cer) " +
            "FROM Certificate cer " +
            "WHERE cer.student.schoolCareer.school.city.state.id = :stateId " +
            "AND cer.status = :status")
    Integer countInProcessByStateId(Integer stateId, String status);

    @Query("SELECT cer " +
            "FROM Certificate cer " +
            "WHERE cer.student.schoolCareer.school.city.state.id = :stateId " +
            "AND cer.status = :status")
    List<Certificate> findInProcessByStateId(Integer stateId, String status);

    List<Certificate> findByMecBatchNumber(Integer mecBatchNumber);

    Optional<Certificate> getByStudentAndCertificateTypeIdAndStatus(Student student, Integer certificateType, String status);


    Optional<Certificate> findFirstByStudentOrderByIdDesc(Student student);

    Integer countByStudent(Student student);

    @Query("SELECT COUNT(*) " +
            "FROM Certificate cer " +
            "WHERE cer.student.user.id=:studentId " +
            "AND cer.certificateTypeId=:certificateType " +
            "AND cer.status='CERTIFICADO'")
    Integer countCertificateTypeeAndStudent(Integer certificateType, Integer studentId);

    @Query("SELECT cer " +
            "FROM Certificate cer " +
            "WHERE cer.student.user.id=:studentId " +
            "AND cer.certificateTypeId=:certificateType " +
            "AND cer.status='CERTIFICADO'")
    List<Certificate> selectRowFindByType(Integer studentId, Integer certificateType);
}