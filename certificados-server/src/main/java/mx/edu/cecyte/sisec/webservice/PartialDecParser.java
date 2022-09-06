package mx.edu.cecyte.sisec.webservice;

import mx.edu.cecyte.decparcial.Dec;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class PartialDecParser {
    public static Dec   xmlToClass(byte[] xmlBytes) {
        ByteArrayInputStream bais = new ByteArrayInputStream(xmlBytes);
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Dec.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            return (Dec) jaxbUnmarshaller.unmarshal(bais);
        } catch (Exception ex) {
            throw new AppException(Messages.decParser_xmlError);
        }
    }

    public static String classToXml(Dec dec) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Dec.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(dec, baos);
            return new String(baos.toByteArray());
        } catch (Exception ex) {
            throw new AppException(Messages.decParser_xmlError);
        }
    }
}
