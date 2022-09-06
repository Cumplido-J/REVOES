package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.repo.siged.MecCredentialsRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MecCredentialsQueries {
    @Autowired private MecCredentialsRepository mecCredentialsRepository;

    public MecCredentials getCredentialsByState(CatState state) {
        List<MecCredentials> credentialsList = mecCredentialsRepository.findByState(state);
        if (credentialsList.size() == 0) throw new AppException(Messages.database_cantFindResource);
        return credentialsList.get(0);
    }
}
