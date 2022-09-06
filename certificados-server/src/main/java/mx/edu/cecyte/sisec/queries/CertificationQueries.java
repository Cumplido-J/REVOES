package mx.edu.cecyte.sisec.queries;
import mx.edu.cecyte.sisec.model.siged.Certification;
import mx.edu.cecyte.sisec.repo.siged.CertificationRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class CertificationQueries {
    @Autowired  CertificationRepository certificationRepository;

    public Certification getDatoFolio(String variableFolio){
        return certificationRepository.findByFolio(variableFolio).orElseThrow(() -> new AppException("El registro no existe en la base de datos"));
    }
}
