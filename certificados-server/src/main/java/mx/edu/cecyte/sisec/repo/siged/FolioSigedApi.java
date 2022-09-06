package mx.edu.cecyte.sisec.repo.siged;

import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.model.siged.SigedFolioApiResponse;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FolioSigedApi {

    @Autowired
    private PropertiesService propertiesService;

    public SigedFolioApiResponse getSigedFolioApiResponse( String folioNumber) {
        String prueba="G1";
        try {
            prueba="G2";
        String apiUrl = propertiesService.getSigedApiUrl() + folioNumber;
            prueba="G3";
        RestTemplate restTemplate = new RestTemplate();
            prueba="G4";
        ResponseEntity<SigedFolioApiResponse> response = restTemplate.getForEntity(apiUrl, SigedFolioApiResponse.class);
            prueba="G5";
        if (response.getStatusCode() != HttpStatus.OK){ throw new AppException(Messages.siged_cantConnect);}
        prueba="G6";
        return response.getBody();
        }catch (AppException exception){
            throw new AppException("Valor obtenido 1 sigedFolioData: "+prueba);
        } catch (Exception exception) {
            throw new AppException("Valor obtenido 2 sigedFolioData: "+prueba);
        }
    }
}

