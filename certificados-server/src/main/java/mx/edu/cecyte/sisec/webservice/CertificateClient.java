package mx.edu.cecyte.sisec.webservice;

import mx.edu.cecyte.certificadows.*;
import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import org.springframework.ws.client.core.WebServiceTemplate;

import java.math.BigInteger;

public class CertificateClient {
    private final WebServiceTemplate webServiceTemplate;
    private final AutenticacionType autenticacionType;

    private String getEndpoint(boolean dev) {
        if (dev) return "https://mecqa.siged.sep.gob.mx/mec-ws/services/CertificadosIEMS.wsdl";
        return "https://mec.sep.gob.mx/mec-ws/services/CertificadosIEMS";
    }

    public CertificateClient(MecCredentials mecCredentials, boolean dev) {
        String endpoint = getEndpoint(dev);
        webServiceTemplate = WSConfig.getWebServiceTemplate(endpoint, "mx.edu.cecyte.certificadows");
        autenticacionType = new AutenticacionType();
        if (dev) {
            autenticacionType.setUsuario(mecCredentials.getUsernameQa());
            autenticacionType.setPassword(mecCredentials.getPasswordQa());
        } else {
            autenticacionType.setUsuario(mecCredentials.getUsername());
            autenticacionType.setPassword(mecCredentials.getPassword());
        }
    }

    public CargaCertificadosIEMSResponse uploadRequest(CustomFile file) {
        CargaCertificadosIEMSRequest request = new CargaCertificadosIEMSRequest();
        request.setNombreArchivo(file.getFileNameWithExtension());
        request.setArchivoBase64(file.getBytes());
        request.setAutenticacion(autenticacionType);

        return (CargaCertificadosIEMSResponse) webServiceTemplate.marshalSendAndReceive(request);
    }

    public ConsultaCertificadosIEMSResponse batchStatusQuery(Integer batchNumber) {
        ConsultaCertificadosIEMSRequest request = new ConsultaCertificadosIEMSRequest();
        request.setNumeroLote(new BigInteger(batchNumber.toString()));
        request.setAutenticacion(autenticacionType);
        return (ConsultaCertificadosIEMSResponse) webServiceTemplate.marshalSendAndReceive(request);
    }

    public DescargaCertificadosIEMSResponse downloadBatch(Integer batchNumber) {
        DescargaCertificadosIEMSRequest request = new DescargaCertificadosIEMSRequest();
        request.setNumeroLote(new BigInteger(batchNumber.toString()));
        request.setAutenticacion(autenticacionType);

        return (DescargaCertificadosIEMSResponse) webServiceTemplate.marshalSendAndReceive(request);
    }

    public CancelarCertificadosIEMSResponse cancelFolio(String folioNumber) {
        CancelarCertificadosIEMSRequest request = new CancelarCertificadosIEMSRequest();
        request.setFolioCertificado(folioNumber);
        request.setAutenticacion(autenticacionType);
        return (CancelarCertificadosIEMSResponse) webServiceTemplate.marshalSendAndReceive(request);
    }
}
