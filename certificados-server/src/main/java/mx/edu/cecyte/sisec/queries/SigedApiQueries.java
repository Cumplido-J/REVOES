package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.model.siged.SigedFolioApiResponse;
import mx.edu.cecyte.sisec.model.siged.SigedFolioData;
import mx.edu.cecyte.sisec.repo.siged.FolioSigedApi;
import mx.edu.cecyte.sisec.repo.siged.SigedApiRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SigedApiQueries {

    //@Autowired private SigedApiRepository sigedApiRepository;
    @Autowired private FolioSigedApi folioSigedApi;

    public SigedFolioData getFolioData(String folioNumber) {
        SigedFolioApiResponse apiResponse = folioSigedApi.getSigedFolioApiResponse(folioNumber);

        if (apiResponse == null || apiResponse.getDatos() == null || apiResponse.getDatos().size() == 0){ return null;}

        return apiResponse.getDatos().get(0);

    }

}
