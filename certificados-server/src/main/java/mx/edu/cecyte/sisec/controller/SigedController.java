package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.certificado.CertificadosSicec;
import mx.edu.cecyte.sisec.dto.certificado.CertificateData;
import mx.edu.cecyte.sisec.dto.degree.DegreeSearchData;
import mx.edu.cecyte.sisec.log.SigedLogger;
import mx.edu.cecyte.sisec.model.siged.SigedFolioData;
import mx.edu.cecyte.sisec.service.CertificadoService;
import mx.edu.cecyte.sisec.service.SigedService;
import mx.edu.cecyte.sisec.service.degree.DegreeService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/siged")
@Log4j
public class SigedController {
    @Autowired private SigedService sigedService;
    @Autowired private CertificadoService certificadoService;
    @Autowired private DegreeService degreeService;
    @GetMapping("/{folioNumber}")
    public ResponseEntity<?> getFolioData(@PathVariable String folioNumber) {
        try {
            SigedFolioData folioData = sigedService.getFolioData(folioNumber);
            return CustomResponseEntity.OK(folioData);
        } catch (AppException exception) {
            SigedLogger.searchFolioData(log, exception.getMessage(), folioNumber);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SigedLogger.searchFolioData(log, exception.toString(), folioNumber);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
    @GetMapping("certificado/{folio}")
    public ResponseEntity<?> getCertificadoFolioData(@PathVariable String folio) {
        try {
            CertificadosSicec folioData2 = certificadoService.getFolioData(folio);
            return CustomResponseEntity.OK(folioData2);
        } catch (AppException exception) {
            SigedLogger.searchFolioData(log, exception.getMessage(), folio);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SigedLogger.searchFolioData(log, exception.toString(), folio);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }    
    ///codigo eugenio
    @GetMapping("consulta/{variableFolio}")
    public ResponseEntity<?> getDatFolio(@PathVariable String variableFolio) {
        try {
            CertificateData datoFolio = certificadoService.getDataFolio(variableFolio);
            System.out.println(datoFolio);
            return CustomResponseEntity.OK(datoFolio);
        } catch (AppException exception) {
            SigedLogger.getDatoFolio(log, exception.getMessage(), variableFolio);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SigedLogger.getDatoFolio(log, exception.toString(), variableFolio);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("searchFolioDegree/{folio}")
    public ResponseEntity<?> searchFolioDegree(@PathVariable String folio) {
        try {
            DegreeSearchData data = degreeService.searchFolioDegree(folio);
            return CustomResponseEntity.OK(data);
        } catch (AppException exception) {
            SigedLogger.searchFolioDegree(log, exception.getMessage(), folio);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            SigedLogger.searchFolioDegree(log, exception.toString(), folio);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
