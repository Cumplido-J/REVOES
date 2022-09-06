package mx.edu.cecyte.sisec.business;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class PropertiesService {
    @Value("${endingCertificateDirectory}") private String endingCertificateDirectory;
    @Value("${abrogatedCertificateDirectory}") private String abrogatedCertificateDirectory;
    @Value("${partialCertificateDirectory}") private String partialCertificateDirectory;
    @Value("${pdfResourceDirectory}") private String pdfResourceDirectory;
    @Value("${montserrat}") private String montserrat;
    @Value("${montserratBold}") private String montserratBold;
    @Value("${barraAguilas}") private String barraAguilas;
    @Value("${logoCecyte}") private String logoCecyte;
    @Value("${logoSinems}") private String logoSinems;
    @Value("${logoEducacion}") private String logoEducacion;
    @Value("${sigedApiUrl}") private String sigedApiUrl;
    @Value("${degreeDirectory}") private String degreeDirectory;
    @Value("${backgroundCecyte}") private String backgroundCecyte;
    @Value("${degreeOvalo}") private String degreeOvalo;
    @Value("${logoEducacionTemporary}") private String logoEducacionTemporary;
    @Value("${marcoTemporary}") private String marcoTemporary;
    @Value("${escudoTemporary}") private String escudoTemporary;
    @Value("${logoEducacionTemporary}") private String logoEducationHeadTemp;
}
