package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.competence.CompetenceData;
import mx.edu.cecyte.sisec.dto.competence.CompetenceList;
import mx.edu.cecyte.sisec.model.education.Module;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.ModuleQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompetenceService {

    @Autowired
    private AuditingQueries auditingQueries;
    @Autowired private UserQueries userQueries;
    @Autowired private ModuleQueries moduleQueries;

    public CompetenceData addCompetence( CompetenceData competenceData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        //if ya existe
        boolean moduleExists = moduleQueries.moduleExists(competenceData.getModule());
        if (moduleExists) throw new AppException("Este modulo ya exite");

        Module module= moduleQueries.addCompetence(competenceData);
        auditingQueries.saveAudit("CareerService", "addNewCareer", adminId, Module.class, module.getId(), "Added new Module, " + competenceData);
        return new CompetenceData(module);
    }
    public List< CompetenceList > getAllCompetence( Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        if (!userQueries.isDevAdmin(userAdmin)) throw new AppException("No tienes permiso para ver los registros");
        List<CompetenceList> listado = new ArrayList<>();
        listado = moduleQueries.getCompetences();
        return listado;
    }
    public CompetenceData getCompetenceData (Integer id, Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        Module module=moduleQueries.getById(id);
        return new CompetenceData(module);
    }
    public CompetenceData editCompetence(CompetenceData competenceData,Integer id,Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        Module module=moduleQueries.getById(id);
        boolean moduleExists = moduleQueries.moduleIdExists(competenceData.getModule(),id);
        if (moduleExists) throw new AppException("Este modulo ya exite");

        module=moduleQueries.editCompetence(module,competenceData);
        auditingQueries.saveAudit("CompetenceService", "editCompetence", adminId, Module.class, module.getId(), "Edited Competence, " + competenceData);
        return new CompetenceData(module);
    }
    public List<CompetenceList> moduleSearch(String searchText, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        return moduleQueries.moduleSearch(searchText);
    }
}
