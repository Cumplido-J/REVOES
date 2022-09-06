package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.competence.CompetenceData;
import mx.edu.cecyte.sisec.dto.competence.CompetenceList;
import mx.edu.cecyte.sisec.dto.student.StudentFormatModule;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.Module;
import mx.edu.cecyte.sisec.model.education.Module_;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.repo.StudentCareerModuleRepository;
import mx.edu.cecyte.sisec.repo.catalogs.ModuleRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.eclipse.aether.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import mx.edu.cecyte.sisec.queries.filters.CareerFilter;

@Service
public class ModuleQueries extends CareerFilter {
    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired private EntityManager entityManager;
    @Autowired private StudentCareerModuleRepository studentCareerModuleRepository;

    public boolean moduleExists(String module) {
        return moduleRepository.countByModule(module) > 0;
    }
    public boolean moduleIdExists(String module, int id){
        return moduleRepository.countByModuleAndIdNot(module,id)>0;
    }
    public Module addCompetence( CompetenceData competenceData) {
        Module module = new Module(competenceData);
        return moduleRepository.save(module);
    }
    public Module getById(Integer id){
        return moduleRepository.findById(id).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }
    public List< CompetenceList > getCompetences(){
        return moduleRepository.findAll()
                .stream().map(module -> new CompetenceList(module.getId(), module.getModule(),
                        module.getEmsadCompetence()))
                .collect(Collectors.toList());
    }
    public Module editCompetence(Module module, CompetenceData competenceData) {
        module.editCompetenceData(competenceData);
        return moduleRepository.save(module);
    }
    public List<CompetenceList> moduleSearch(String searchText) {
        List< Predicate > predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<CompetenceList> criteriaQuery = builder.createQuery(CompetenceList.class);

        Root<Module> module= criteriaQuery.from(Module.class);
        Predicate filtro;

        if (!StringUtils.isEmpty(searchText)) {
            filtro = textFilter2(builder,module, searchText);
            predicates.add(filtro);
        }
        criteriaQuery.select(builder.construct(
                CompetenceList.class,
                module.get(Module_.id),
                module.get(Module_.module),
                module.get(Module_.emsadCompetence)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<CompetenceList> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public Integer countStudentCareerModule(Integer studentId, Integer scmId){
        return studentCareerModuleRepository.countStudentCareerModule(studentId, scmId);
    }

    public StudentCareerModule selectStudentCareerModule(Integer studentId, Integer scmId) {
        return studentCareerModuleRepository.selectStudentCareerModule(studentId, scmId);
    }
    public Integer countStudentCareerModuleByStudentId(Integer studentId){
        return studentCareerModuleRepository.countStudentCareerModule(studentId);
    }

    public List<StudentCareerModule> selectStudentCareerModule(Integer studentId) {
        return studentCareerModuleRepository.selectStudentCareerModule(studentId);
    }
    public void deleteStudentCareerModule(List<StudentCareerModule> module) {
        studentCareerModuleRepository.deleteAll(module);
    }
    public void addStudentCareerModule(List<StudentFormatModule> module, Student student) {
        for (StudentFormatModule formatModule: module) {
            CareerModule module1 = new CareerModule();
            module1.setId(formatModule.getCareerModuleId());
            StudentCareerModule studentCareerModule = new StudentCareerModule();
            studentCareerModule.setCareerModule(module1);
            studentCareerModule.setStudent(student);

            studentCareerModuleRepository.save(studentCareerModule);
        }
    }

    public void saveStudentCareerModules(StudentCareerModule module) {
        studentCareerModuleRepository.save(module);
    }

    public void deleteScm(List<StudentCareerModule> studentCareerModule1) {
        for(StudentCareerModule studentCareerModule: studentCareerModule1) {

            studentCareerModuleRepository.delete(studentCareerModule);
        }
    }

    public void update(List<StudentCareerModule> studentCareerModuleList) {
        for (StudentCareerModule studentCareerModule: studentCareerModuleList) {
            StudentCareerModule studentCareerModule1 = new StudentCareerModule();
            studentCareerModule1.setId(studentCareerModule1.getId());
            studentCareerModule1.setStudent(studentCareerModule1.getStudent());
            //studentCareerModule1.set
            studentCareerModuleRepository.save(studentCareerModule1);
        }
    }


}

