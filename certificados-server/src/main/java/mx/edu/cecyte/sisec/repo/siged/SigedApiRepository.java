package mx.edu.cecyte.sisec.repo.siged;

import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.model.siged.SigedFolioApiResponse;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
public class SigedApiRepository {
    @Autowired private PropertiesService propertiesService;

    public SigedFolioApiResponse getSigedFolioApiResponse(String folioNumber) {
        String apiUrl = propertiesService.getSigedApiUrl() + folioNumber;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<SigedFolioApiResponse> response = restTemplate.getForEntity(apiUrl, SigedFolioApiResponse.class);
        if (response.getStatusCode() != HttpStatus.OK) throw new AppException(Messages.siged_cantConnect);
        return response.getBody();
    }
}
