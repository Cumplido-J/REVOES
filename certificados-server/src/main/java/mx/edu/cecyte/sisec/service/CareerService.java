package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.career.CareerData;
import mx.edu.cecyte.sisec.dto.career.CareerList;
import mx.edu.cecyte.sisec.dto.career.CareerModuleData;
import mx.edu.cecyte.sisec.dto.career.ModuleData;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.Module;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.AuditingQueries;
import mx.edu.cecyte.sisec.queries.CareerModuleQueries;
import mx.edu.cecyte.sisec.queries.CareerQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.repo.catalogs.ModuleRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CareerService {
    @Autowired
    private UserQueries userQueries;
    @Autowired private CareerQueries careerQueries;
    @Autowired private AuditingQueries auditingQueries;
    @Autowired private CareerModuleQueries careerModuleQueries;
    @Autowired private ModuleRepository moduleRepository;

    public CareerData addNewCareer( CareerData careerData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);

        boolean keyExists = careerQueries.keyExists(careerData.getCareerKey());
        if (keyExists) throw new AppException("Esta clave carrera ya exite");

        Career career= careerQueries.addNewCareer(careerData);
        auditingQueries.saveAudit("CareerService", "addNewCareer", adminId, Career.class, career.getId(), "Added new Career, " + careerData);
        return new CareerData(career);
    }
    public List< CareerList > careerSearch( String searchText, Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        return careerQueries.careerSearch(searchText);
    }
    public List<CareerList> getAllCareer(Integer adminId) {
        User userAdmin = userQueries.getUserById(adminId);
        //if (!userQueries.isDevAdmin(userAdmin)) throw new AppException("No tienes permiso para ver los registros");
        List<CareerList> listado = new ArrayList<>();
        listado = careerQueries.getCareers();
        return listado;
    }
    public CareerData getCareerData (String careerKey, Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        Career career=careerQueries.getByCareerKey(careerKey);
        return new CareerData(career);
    }
    public CareerData editCareer(CareerData careerData,String careerKey,Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        Career career=careerQueries.getByCareerKey(careerKey);
        if(!careerKey.equalsIgnoreCase(careerData.getCareerKey())){
            if (userQueries.isDevAdmin(adminUser)) {
                boolean keyExists =careerQueries.keyExists(careerData.getCareerKey());
                if (keyExists) throw new AppException("Esta clave carrera ya exite");
            }else{
                careerData.setCareerKey(careerKey);
            }
        }
        career=careerQueries.editCareer(career,careerData);
        auditingQueries.saveAudit("CareerService", "editCareer", adminId, Career.class, career.getId(), "Edited Career, " + careerData);
        return new CareerData(career);
    }
    public ModuleData addModule( ModuleData moduleData, Integer career, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        //careerModuleQueries.getByCareerIdList(career);
        Career career1=careerQueries.getById(career);
        Module module= moduleRepository.findById(moduleData.getModule()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        boolean keyExists = careerModuleQueries.moduleExists(module,career1);
        if (keyExists) throw new AppException("Esta competencia ya esta asignada a la carrera");
        boolean maxModule = careerModuleQueries.moduleMax(career1);
        if (maxModule) throw new AppException("Solo se puede agrega 17 competencia por carrera");
        CareerModule careerModule= careerModuleQueries.addNewModule(moduleData,career);
        auditingQueries.saveAudit("CareerService", "addNewCareerModule", adminId, CareerModule.class, careerModule.getId(), "Added new Career Module, " + moduleData);
        return new ModuleData(careerModule);
    }

    public ModuleData getCareerModuleData(Integer id, Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        CareerModule careerModule=careerModuleQueries.getById(id);
        //System.out.println(careerModule);
        return new ModuleData(careerModule);
    }
    public ModuleData editCareerModule(ModuleData moduleData,Integer id,Integer career,Integer adminId){
        User adminUser = userQueries.getUserById(adminId);
        CareerModule careerModule =careerModuleQueries.getById(id);

        Career career1=careerQueries.getById(career);
        Module module= moduleRepository.findById(moduleData.getModule()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        boolean keyExists = careerModuleQueries.moduleExists2(module,career1,id);
        if (keyExists) throw new AppException("Esta competencia ya esta asignada a la carrera");

        careerModule=careerModuleQueries.editCareerModule(careerModule,moduleData,career);
        auditingQueries.saveAudit("CareerService", "editCareerModule", adminId, CareerModule.class, careerModule.getId(), "Edited Career Module, " + moduleData);
        return new ModuleData(careerModule);
    }
    public void deleteCareerModule(CareerModuleData careerModuleData, Integer adminId) {
        User adminUser = userQueries.getUserById(adminId);
        boolean stateAvailableForAdmin=userQueries.isDevAdmin(adminUser);
        if (!stateAvailableForAdmin) throw new AppException("No tienes permisos para realizar esta acción");
        careerModuleQueries.deleteModuleCareer(careerModuleData);
        auditingQueries.saveAudits("CareerService", "deleteCareerModule", adminId, Career.class, careerModuleData.getCareerModuleId(), "delete module at career");
    }
}
