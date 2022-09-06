package mx.edu.cecyte.sisec.devfunctions;

import mx.edu.cecyte.sisec.business.pdfgenerator.certificate.partialcertificate.PartialCertificatePdfService;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.CatalogQueries;
import mx.edu.cecyte.sisec.queries.MecCredentialsQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.webservice.CertificateClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DevPartialCertificateAllService {
    @Autowired private PartialCertificatePdfService partialCertificatePdfService;
    @Autowired private UserQueries userQueries;
    @Autowired private MecCredentialsQueries mecCredentialsQueries;
    @Autowired private CatalogQueries catalogQueries;

    public void buildAll() {
        User user = userQueries.getUserById(1);
        //MecCredentials mecCredentials = mecCredentialsQueries.getCredentialsByState(user.getCertificationAdmin().getState());
        MecCredentials mecCredentials = mecCredentialsQueries.getCredentialsByState(catalogQueries.getStateModel(user));
        CertificateClient certificateClient = new CertificateClient(mecCredentials, true);

    }

    public void generateXmlCecyte() {

    }
}
