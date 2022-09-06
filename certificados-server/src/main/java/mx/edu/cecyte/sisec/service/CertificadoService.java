package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.certificado.CertificadosSicec;
import mx.edu.cecyte.sisec.dto.certificado.CertificateData;
import mx.edu.cecyte.sisec.model.siged.Certification;
import mx.edu.cecyte.sisec.queries.CertificationQueries;
import mx.edu.cecyte.sisec.queries.CertificateQueries;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CertificadoService {
    @Autowired private CertificationQueries queries;
    @Autowired private CertificateQueries certificateQueries;
    public CertificateData getDataFolio(String variableFolio) {
        Certification certification = queries.getDatoFolio(variableFolio);
        return new CertificateData(certification);
    }
    public CertificadosSicec getFolioData(String folio) {
        Certificate certificat = certificateQueries.findByFolioNumber(folio);
        ///System.out.println(certificat.getStatus());
        return new CertificadosSicec(certificat);
    }   
}

