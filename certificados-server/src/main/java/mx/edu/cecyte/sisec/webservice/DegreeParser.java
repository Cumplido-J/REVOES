package mx.edu.cecyte.sisec.webservice;

import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import mx.edu.cecyte.titulo.TituloElectronico;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class DegreeParser {
    public static TituloElectronico xmlToClass(byte[] xmlBytes) {
        ByteArrayInputStream bais = new ByteArrayInputStream(xmlBytes);
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(TituloElectronico.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            return (TituloElectronico) jaxbUnmarshaller.unmarshal(bais);
        } catch (Exception ex) {
            throw new AppException(Messages.degreeParser_error);
        }
    }

    public static String classToXml(TituloElectronico tituloElectronico) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(TituloElectronico.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(tituloElectronico, baos);
            return new String(baos.toByteArray());
        } catch (Exception ex) {
            throw new AppException(Messages.degreeParser_error);
        }
    }
}
