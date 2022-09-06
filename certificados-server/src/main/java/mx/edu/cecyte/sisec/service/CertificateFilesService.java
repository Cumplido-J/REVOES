package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.business.PropertiesService;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class CertificateFilesService {
    @Autowired private PropertiesService propertiesService;

    public byte[] getXmlFromCertificate(Integer certificateTypeId, Certificate certificate) {
        String mainFolder = certificateTypeId.equals(AppCatalogs.CERTIFICATETYPE_ENDING) ?
                propertiesService.getEndingCertificateDirectory() : propertiesService.getPartialCertificateDirectory();

        String stateFolder = AppFunctions.stateIdToFolderName(certificate.getStudent().getSchoolCareer().getSchool().getCity().getState().getId());

        Path xmlPath = Paths.get(mainFolder, stateFolder, certificate.getMecBatchNumber().toString(), "Descarga", certificate.getFileName());

        try {
            return Files.readAllBytes(xmlPath);
        } catch (IOException e) {
            throw new AppException(Messages.certificate_cantReadXml);
        }
    }
}
