package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.repo.catalogs.StateRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StateQueries {
    @Autowired private StateRepository stateRepository;

    public CatState getById(Integer stateId) {
        return stateRepository.findById(stateId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }
}
