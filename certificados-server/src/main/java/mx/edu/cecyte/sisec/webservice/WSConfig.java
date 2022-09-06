package mx.edu.cecyte.sisec.webservice;

import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.WebServiceTemplate;

public class WSConfig {
    public static WebServiceTemplate getWebServiceTemplate(String endpoint, String contextPath) {
        Jaxb2Marshaller jaxb2Marshaller = new Jaxb2Marshaller();
        jaxb2Marshaller.setContextPath(contextPath);

        WebServiceTemplate webServiceTemplate = new WebServiceTemplate();
        webServiceTemplate.setMarshaller(jaxb2Marshaller);
        webServiceTemplate.setUnmarshaller(jaxb2Marshaller);
        webServiceTemplate.setDefaultUri(endpoint);

        return webServiceTemplate;
    }
}
