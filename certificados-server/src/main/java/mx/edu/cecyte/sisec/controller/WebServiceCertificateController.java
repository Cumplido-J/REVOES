package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurpsFiel;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.AnswerCertificate;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.AnswerEndPointPrimary;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.EndPointPrimary;
import mx.edu.cecyte.sisec.log.WebServiceCertificateLoger;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.service.CertificateService;
import mx.edu.cecyte.sisec.service.WebServiceCertificateService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/webCertificateEndPoint")
@Log4j
public class WebServiceCertificateController {

    @Autowired
    private WebServiceCertificateService webServiceCertificateService;

    @Autowired private CertificateService certificateService;

    @PostMapping( "/EndPointStudentData")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CERTIFICACION')")
    public ResponseEntity<?> endPointStudentData( @LoggedUser UserSession userSession,
                                             @RequestBody EndPointPrimary  endPointPrimary) {
        try {
            List< AnswerEndPointPrimary > answerEndPoint = webServiceCertificateService.studentDataByWebService(endPointPrimary,userSession.getId());

            return CustomResponseEntity.OK( answerEndPoint );
        } catch (AppException exception) {
            WebServiceCertificateLoger.endPointStudentData(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            WebServiceCertificateLoger.endPointStudentData(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping( "/EndPointStudentCertificate")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CERTIFICACION')")
    public ResponseEntity<?> endPointStudentCertificate( @LoggedUser UserSession userSession,
                                                         @RequestBody CertificateCurpsFiel certificateCurpsFiel) {
        try {
            certificateCurpsFiel.setIsWebService(true);
            certificateCurpsFiel.getFiel().setPassword(webServiceCertificateService.DencryptPassword(certificateCurpsFiel.getFiel()));
            certificateService.certificateStudents(certificateCurpsFiel, userSession.getId());
            MecCredentials mecCredentials= certificateService.mecCredentials(userSession.getId());
            return CustomResponseEntity.OK(new AnswerCertificate(mecCredentials, certificateCurpsFiel));
        } catch (AppException exception) {
            WebServiceCertificateLoger.endPointStudentCertificate(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            WebServiceCertificateLoger.endPointStudentCertificate(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/SincronizeBatches")
    @PreAuthorize("hasAnyRole('ROLE_DEV','ROLE_CONTROLESCOLAR','ROLE_CERTIFICACION','ROLE_TITULACION')")
    public ResponseEntity<?> sincronizeBatches(@LoggedUser UserSession userSession) {
        try {
            boolean test= webServiceCertificateService.isTest(false,userSession.getId());
            String message = certificateService.sincronizeBatches(userSession.getId(), test);
            return CustomResponseEntity.OK(message);
        } catch (AppException exception) {
            WebServiceCertificateLoger.sincronizeBatches(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            WebServiceCertificateLoger.sincronizeBatches(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
