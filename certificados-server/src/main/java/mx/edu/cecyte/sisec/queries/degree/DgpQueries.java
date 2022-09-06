package mx.edu.cecyte.sisec.queries.degree;

import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.dto.degree.DegreeIntituteDgp;
import mx.edu.cecyte.sisec.dto.degree.DgpCombinationCareer;
import mx.edu.cecyte.sisec.dto.degree.DgpSelectCareer;
import mx.edu.cecyte.sisec.model.catalogs.CatState_;
import mx.edu.cecyte.sisec.model.catalogs.degree.*;
import mx.edu.cecyte.sisec.model.education.School_;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeCareerDgpRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeCombinationDgpRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeInstituteRepository;
import mx.edu.cecyte.sisec.repo.degree.catalogs.DegreeStateRepository;
import mx.edu.cecyte.sisec.shared.AppException;
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
public class DgpQueries {
    @Autowired private EntityManager entityManager;
    @Autowired private DegreeCombinationDgpRepository degreeCombinationDgpRepository;
    @Autowired private DegreeInstituteRepository degreeInstituteRepository;
    @Autowired private DegreeStateRepository degreeStateRepository;
    @Autowired private DegreeCareerDgpRepository degreeCareerDgpRepository;

    public DegreeIntituteDgp selectSchoolDgp(Integer schoolId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DegreeIntituteDgp> criteriaQuery = builder.createQuery(DegreeIntituteDgp.class);

        Root<CatDegreeInstitute> institute = criteriaQuery.from(CatDegreeInstitute.class);
        predicates.add(builder.equal(institute.get(CatDegreeInstitute_.id), schoolId));

        criteriaQuery.select(builder.construct(
                DegreeIntituteDgp.class,
                institute.get(CatDegreeInstitute_.id),
                institute.get(CatDegreeInstitute_.clave),
                institute.get(CatDegreeInstitute_.name),
                institute.get(CatDegreeInstitute_.complete),
                institute.get(CatDegreeInstitute_.entity).get(CatDegreeState_.id),
                institute.get(CatDegreeInstitute_.school).get(School_.id)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        TypedQuery<DegreeIntituteDgp> typedQuery = entityManager.createQuery(criteriaQuery);
        return typedQuery.getSingleResult();
    }

    public CatDegreeInstitute updateSchoolDgp(CatDegreeInstitute degreeIntituteDgp) {
        degreeInstituteRepository.save(degreeIntituteDgp);
        return degreeIntituteDgp;
    }

    public CatDegreeInstitute addNewSchoolDgp(CatDegreeInstitute school) {
        List<CatDegreeInstitute> intituteDgpList = degreeInstituteRepository.findAll()
                .stream()
                .filter(institute->institute.getClave().equals(school.getClave())).collect(Collectors.toList());
        if (intituteDgpList.size() == 0) degreeInstituteRepository.save(school);
        else throw new AppException("Esta clave ya esta en uso");
        return school;
    }

    public CatDegreeCombinationDgp DgpCombinationCareer(CatDegreeCombinationDgp combination) {
        List<CatDegreeCombinationDgp> comninar = degreeCombinationDgpRepository.findAll().stream()
                .filter(combinar->combinar.getInstitute().getId().equals(combination.getInstitute().getId()) && combinar.getCareer().getId().equals(combination.getCareer().getId()))
                .collect(Collectors.toList());
        if (comninar.size() == 0) degreeCombinationDgpRepository.save(combination);
        else throw new AppException("Esta carrera ya ha sido asignada");

        return combination;
    }

    public List<DgpSelectCareer> selectAllCareerDgp() {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DgpSelectCareer> criteriaQuery = builder.createQuery(DgpSelectCareer.class);
        Root<CatDegreeCareerDgp> careerDgp = criteriaQuery.from(CatDegreeCareerDgp.class);
        criteriaQuery.select(builder.construct(
                DgpSelectCareer.class,
                careerDgp.get(CatDegreeCareerDgp_.id),
                careerDgp.get(CatDegreeCareerDgp_.clave),
                careerDgp.get(CatDegreeCareerDgp_.carrer),
                careerDgp.get(CatDegreeCareerDgp_.name),
                careerDgp.get(CatDegreeCareerDgp_.modality),
                careerDgp.get(CatDegreeCareerDgp_.level)
        ));
        criteriaQuery.orderBy(builder.asc(careerDgp.get(CatDegreeCareerDgp_.clave)));
        TypedQuery<DgpSelectCareer> typedQuery = entityManager.createQuery(criteriaQuery);
        List<DgpSelectCareer> catalogList = typedQuery.getResultList();
        return catalogList;
    }

    public CatDegreeCareerDgp addNewCareerDgp(CatDegreeCareerDgp career) {
        List<CatDegreeCareerDgp> careerDgps = degreeCareerDgpRepository.findAll()
                .stream().filter(c->c.getClave().equals(career.getClave()))
                .collect(Collectors.toList());
        if (careerDgps.size() == 0) degreeCareerDgpRepository.save(career);
        else throw new AppException("Esta clave ya existe");
        return career;
    }

    public List<DecreeSelect> selectAllDecree(Integer userId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DecreeSelect> criteriaQuery = builder.createQuery(DecreeSelect.class);
        Root<CatDegreeState> state = criteriaQuery.from(CatDegreeState.class);

        predicates.add(builder.equal(state.get(CatDegreeState_.id),userId));

        criteriaQuery.select(builder.construct(
                DecreeSelect.class,
                state.get(CatDegreeState_.id),
                state.get(CatDegreeState_.name),
                state.get(CatDegreeState_.abbreviation),
                state.get(CatDegreeState_.decreeNumber),
                state.get(CatDegreeState_.decreeDate),
                state.get(CatDegreeState_.state).get(CatState_.id),
                state.get(CatDegreeState_.cityName)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        TypedQuery<DecreeSelect> typedQuery = entityManager.createQuery(criteriaQuery);
        List<DecreeSelect> decreeSelectList = typedQuery.getResultList();
        return decreeSelectList;

    }

    public CatDegreeState updateStateDecree(CatDegreeState entity) {
        degreeStateRepository.save(entity);
        return entity;
    }

    public DecreeSelect selectDecree(Integer stateId) {
        List<Predicate> predicates = new ArrayList<>();
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DecreeSelect> criteriaQuery = builder.createQuery(DecreeSelect.class);
        Root<CatDegreeState> state = criteriaQuery.from(CatDegreeState.class);

        predicates.add(builder.equal(state.get(CatDegreeState_.id), stateId));

        criteriaQuery.select(builder.construct(
                DecreeSelect.class,
                state.get(CatDegreeState_.id),
                state.get(CatDegreeState_.name),
                state.get(CatDegreeState_.abbreviation),
                state.get(CatDegreeState_.decreeNumber),
                state.get(CatDegreeState_.decreeDate),
                state.get(CatDegreeState_.state).get(CatState_.id),
                state.get(CatDegreeState_.cityName)
        ));
        criteriaQuery.where(predicates.stream().toArray(Predicate[]::new));
        TypedQuery<DecreeSelect> typedQuery = entityManager.createQuery(criteriaQuery);
        DecreeSelect decreeSelectList = typedQuery.getSingleResult();
        return decreeSelectList;
    }
    
    public CatDegreeCombinationDgp findByIdDgp(Integer combinationId) {
        return degreeCombinationDgpRepository.findByIdDgp(combinationId);
    }

    public void deleteCombinationCareer(CatDegreeCombinationDgp careerDgp) {
        degreeCombinationDgpRepository.delete(careerDgp);
    }
}
