package mx.edu.cecyte.sisec.webservice;

import mx.edu.cecyte.sisec.classes.CustomFile;
import mx.edu.cecyte.sisec.model.met.MetCredentials;
import mx.edu.cecyte.titulows.*;
import org.springframework.ws.client.core.WebServiceTemplate;

import java.math.BigInteger;

public class DegreeClient {
    private final WebServiceTemplate webServiceTemplate;
    private final AutenticacionType autenticacionType;

    private String getEndpoint(boolean dev) {
        if (dev) return "https://metqa.siged.sep.gob.mx/met-ws/services/TitulosElectronicos.wsdl";
        return "https://met.sep.gob.mx/met-ws/services/TitulosElectronicos";
    }

    public DegreeClient(MetCredentials metCredentials, boolean dev) {
        String endpoint = getEndpoint(dev);
        webServiceTemplate = WSConfig.getWebServiceTemplate(endpoint, "mx.edu.cecyte.titulows");
        autenticacionType = new AutenticacionType();
        if (dev) {
            System.out.println("ESTADO DE PRUEBA: "+metCredentials.getUsernameQa());
            autenticacionType.setUsuario(metCredentials.getUsernameQa());
            autenticacionType.setPassword(metCredentials.getPasswordQa());
        } else {
            System.out.println("ESTADO PRODUCTIVO: "+metCredentials.getUsername());
            autenticacionType.setUsuario(metCredentials.getUsername());
            autenticacionType.setPassword(metCredentials.getPassword());
        }
    }

    public CargaTituloElectronicoResponse uploadRequest(CustomFile file) {
        System.out.println("-------------- CargaTituloElectronicoResponse ---------------------");
        CargaTituloElectronicoRequest request = new CargaTituloElectronicoRequest();
        request.setNombreArchivo(file.getFileNameWithExtension());
        request.setArchivoBase64(file.getBytes());
        request.setAutenticacion(autenticacionType);
        return (CargaTituloElectronicoResponse) webServiceTemplate.marshalSendAndReceive(request);
    }

    public ConsultaProcesoTituloElectronicoResponse batchStatusQuery(Integer batchNumber) {
        System.out.println("-------------- ConsultaProcesoTituloElectronicoResponse ---------------------");
        System.out.println("1.-NUMERO DE BATCH: "+batchNumber);
        ConsultaProcesoTituloElectronicoRequest request = new ConsultaProcesoTituloElectronicoRequest();
        request.setNumeroLote(new BigInteger(batchNumber.toString()));
        request.setAutenticacion(autenticacionType);
        return (ConsultaProcesoTituloElectronicoResponse) webServiceTemplate.marshalSendAndReceive(request);
    }

    public DescargaTituloElectronicoResponse downloadBatch(Integer batchNumber) {
        System.out.println("-------------- DescargaTituloElectronicoResponse ---------------------");
        System.out.println("1.-NUMERO DE BATCH: "+batchNumber);
        DescargaTituloElectronicoRequest request = new DescargaTituloElectronicoRequest();
        request.setNumeroLote(new BigInteger(batchNumber.toString()));
        request.setAutenticacion(autenticacionType);
        return (DescargaTituloElectronicoResponse) webServiceTemplate.marshalSendAndReceive(request);
    }

    public CancelaTituloElectronicoResponse cancelFolio(String folioNumber, String cancelationReason) {
        System.out.println("-------------- CancelaTituloElectronicoResponse ---------------------");
        System.out.println("1.-FOLIO: "+folioNumber);
        System.out.println("1.-FOLIO: "+cancelationReason);
        CancelaTituloElectronicoRequest request = new CancelaTituloElectronicoRequest();
        request.setFolioControl(folioNumber);
        request.setMotCancelacion(cancelationReason);
        request.setAutenticacion(autenticacionType);
        return (CancelaTituloElectronicoResponse) webServiceTemplate.marshalSendAndReceive(request);
    }
}
