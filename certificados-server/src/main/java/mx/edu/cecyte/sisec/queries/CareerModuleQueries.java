package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.career.CareerModuleData;
import mx.edu.cecyte.sisec.dto.career.ModuleData;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.Module;
import mx.edu.cecyte.sisec.repo.CareerModuleRepository;
import mx.edu.cecyte.sisec.repo.catalogs.ModuleRepository;
import mx.edu.cecyte.sisec.repo.education.CareerRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerModuleQueries {
    @Autowired
    private CareerModuleRepository careerModuleRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private CareerRepository careerRepository;

    public CareerModule getById( Integer id){
        return careerModuleRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }
    public boolean moduleExists( Module module, Career career) {
        return careerModuleRepository.countByModuleAndCareer(module,career) > 0;
    }
    public boolean moduleExists2(Module module,Career career,Integer id) {
        return careerModuleRepository.countByModuleAndCareerAndIdNot(module,career,id) > 0;
    }
    public boolean moduleMax(Career career) {
        return careerModuleRepository.countByCareer(career)>16;
    }    
    public CareerModule addNewModule( ModuleData moduleData, Integer careerId) {
        Career career = careerRepository.findById(careerId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        Module module = moduleRepository.findById(moduleData.getModule()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        //careerModule.CareerModule(moduleData,career, module);
        CareerModule careerModule1=new CareerModule(moduleData,career, module);
        return careerModuleRepository.save(careerModule1);
    }
    public CareerModule editCareerModule(CareerModule careerModule,ModuleData moduleData,Integer careerId) {
        Career career = careerRepository.findById(careerId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        Module module = moduleRepository.findById(moduleData.getModule()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        careerModule.editCareerModuleData(moduleData,career, module);
        return careerModuleRepository.save(careerModule);
    }
    public List<CareerModule> findListModule(List<Integer> module){
        return careerModuleRepository.findListByModule(module);
    }
    public void deleteModuleCareer(CareerModuleData careerModuleData){
        //Integer id= Integer.parseInt(careerModuleData.getIdCareer());
        List<CareerModule> moduleCareer=findListModule(careerModuleData.getCareerModuleId());
        careerModuleRepository.deleteAll(moduleCareer);
    }
}

