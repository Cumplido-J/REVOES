package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.dto.career.CareerData;
import mx.edu.cecyte.sisec.dto.career.CareerList;
import mx.edu.cecyte.sisec.model.catalogs.*;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.Career_;
import mx.edu.cecyte.sisec.queries.filters.CareerFilter;
import mx.edu.cecyte.sisec.repo.SubjectTypeRepository;
import mx.edu.cecyte.sisec.repo.catalogs.DiciplinaryRepository;
import mx.edu.cecyte.sisec.repo.catalogs.EstudioTypeRepository;
import mx.edu.cecyte.sisec.repo.catalogs.PerfilTypeRepository;
import mx.edu.cecyte.sisec.repo.education.CareerRepository;
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

@Service
public class CareerQueries extends CareerFilter {
    @Autowired private CareerRepository careerRepository;
    @Autowired private PerfilTypeRepository perfilTypeRepository;
    @Autowired private EstudioTypeRepository estudioTypeRepository;
    @Autowired private DiciplinaryRepository diciplinaryRepository;
    @Autowired private SubjectTypeRepository subjectTypeRepository;
    @Autowired private EntityManager entityManager;

    public Career getById(Integer careerId) {
        return careerRepository.findById(careerId).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public Career getByCareerKey(String careerKey) {
        return careerRepository.findByCareerKey(careerKey).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
    }

    public List<Career> findByIdList(List<Integer> id){
        return  careerRepository.findAllById(id);
    }


    public Career getByIdOrdered(Integer careerId) {
        Career carrera=new Career();
        carrera=careerRepository.findByIdOrderByCareerModulesOrderDesc(careerId);
        return  carrera;
    }

    public boolean keyExists(String careerKey) {
        return careerRepository.countByCareerKey(careerKey) > 0;
    }

    public Career addNewCareer( CareerData careerData) {
        CatProfileType profileType = perfilTypeRepository.findById(careerData.getProfileType()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatStudyType studyType = estudioTypeRepository.findById(careerData.getStudyType()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatSubjectType subjectType=null;
        if (careerData.getSubjectType() != null) {
            subjectType = subjectTypeRepository.findById(careerData.getSubjectType()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        }
        CatDisciplinaryField disciplinaryField = diciplinaryRepository.findById(careerData.getDisciplinaryField()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        Career career = new Career(careerData,profileType,subjectType,studyType,disciplinaryField);
        return careerRepository.save(career);
    }

    public List< CareerList > careerSearch( String searchText) {
        List< Predicate > predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<CareerList> criteriaQuery = builder.createQuery(CareerList.class);

        Root<Career> career = criteriaQuery.from(Career.class);
        Predicate filtro;

        if (!StringUtils.isEmpty(searchText)) {
            filtro = textFilter(builder,career, searchText);
            predicates.add(filtro);
        }
        criteriaQuery.select(builder.construct(
                CareerList.class,
                career.get(Career_.id),
                career.get(Career_.name),
                career.get(Career_.careerKey),
                career.get(Career_.totalCredits),
                career.get(Career_.profileType).get(CatProfileType_.name)
        ));
        criteriaQuery.distinct(true);
        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));
        TypedQuery<CareerList> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }
    public List<CareerList> getCareers(){
        return careerRepository.findAll()
                .stream().map(career -> new CareerList(career.getId(),career.getName(),
                        career.getCareerKey(),career.getTotalCredits(),career.getProfileType().getName()))
                .collect(Collectors.toList());
    }

    public Career editCareer(Career career, CareerData careerData) {
        CatProfileType profileType = perfilTypeRepository.findById(careerData.getProfileType()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatStudyType studyType = estudioTypeRepository.findById(careerData.getStudyType()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        CatSubjectType subjectType=null;
        if(careerData.getSubjectType()!=null) {
             subjectType = subjectTypeRepository.findById(careerData.getSubjectType()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        }
        CatDisciplinaryField disciplinaryField = diciplinaryRepository.findById(careerData.getDisciplinaryField()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        career.editCareerData(careerData,profileType, subjectType, studyType,disciplinaryField);
        return careerRepository.save(career);
    }
}
