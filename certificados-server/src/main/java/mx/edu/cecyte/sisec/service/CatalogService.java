package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.catalogs.*;
import mx.edu.cecyte.sisec.model.catalogs.CatGeneration;
import mx.edu.cecyte.sisec.model.catalogs.CatPosition;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.education.Career;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.CareerQueries;
import mx.edu.cecyte.sisec.queries.CatalogQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CatalogService {
    @Autowired private UserQueries userQueries;
    @Autowired private CatalogQueries catalogQueries;
    @Autowired private CareerQueries careerQueries;

    public List<Catalog> getStateCatalogs(String username) {
        User user = userQueries.getUserByUsername(username);

        Set<Integer> availableStateIds = userQueries.getAvailableStateIdsByAdminUser(user);

        return catalogQueries.getStateCatalogs(availableStateIds);
    }

    public List<Catalog> getSchoolCatalogs(Integer stateId, String username) {
        User user = userQueries.getUserByUsername(username);

        //Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUser(user);
        Set<Integer> availableSchoolIds = userQueries.getAvailableSchoolIdsByAdminUserV2(stateId,user, AppCatalogs.isState);
       // System.out.println(userQueries.getAvailableSchoolIdsByAdminUserPrueba(stateId,user));
        return catalogQueries.getSchoolCatalogsByStateId(stateId, availableSchoolIds);
    }

    public List<Catalog> getCareerCatalogs(Integer schoolId) {
        return catalogQueries.getCareersBySchoolId(schoolId);
    }

    public List<Catalog> getCareerCatalogsByState(Integer stateId) {
        return catalogQueries.getCareersByStateId(stateId);
    }

    public List<Catalog> getCityCatalogs(Integer stateId) {
        return catalogQueries.getCityCatalogs(stateId);
    }

    public List<Catalog> getAllCareersCatalogs() {
        return catalogQueries.getAllCareersCatalogs();
    }

    public List<Catalog> getModulesByCareer(Integer careerId) {
        Career career = careerQueries.getById(careerId);
        return catalogQueries.getModulesByCareer(career);
    }

    public List<GenerationCatalog> getAllGenerationDes(){return catalogQueries.getAllGenerationDes();}

    public List<Catalog> getRoleCatalogs(String username) {
        User user = userQueries.getUserByUsername(username);
        Set<Integer> availableStateIds = userQueries.getAvailableStateIdsByAdminUser(user);
        return catalogQueries.getRoleCatalogs(availableStateIds);
    }

    public List<Catalog> getCargoCatalogs(String username) {
        User user = userQueries.getUserByUsername(username);
        Set<Integer> availableStateIds = userQueries.getAvailableStateIdsByAdminUser(user);
        return catalogQueries.getCargoCatalogs(availableStateIds);
    }

    public CatPosition getCargoById( Integer idCargo){
        return catalogQueries.getCargoById(idCargo);
    }

    public CatState getStateById( Integer idState){
        return catalogQueries.getStateById(idState);
    }

    public School getSchoolById( Integer idSchool){
        return catalogQueries.getSchoolById(idSchool);
    }

    public List<CatalogOrder> getModulesByCareerOrdered(Integer careerId) {
        Career career = careerQueries.getByIdOrdered(careerId);
        return catalogQueries.getModulesByCareerOrder(career);
    }
    public List<CargoCatalog> getCargosCatalogs() {

        return catalogQueries.getCargosCatalogs();
    }

    public CargoCatalog getRoleUser( String username ) {
        User user = userQueries.getUserByUsername(username);
        Set<Integer> rolesId = userQueries.getRolesIdByUser(user);
        int[] array = rolesId.stream().mapToInt(Integer::intValue).toArray();
        int rol=array[0];

        return new CargoCatalog(1, rol==1 ? "DEV" : "");
    }

    public List< Catalog > getPersonalRole( String username) {
        User user= userQueries.getUserByUsername(username);
        return catalogQueries.getPersonalRole(user);
    }

    public List< Catalogdos > getCareerCatalogsdos( Integer schoolId) {
        return catalogQueries.getCareersBySchoolIddos(schoolId);
    }

    public List< Catalog > getPerfilCatalogs() {
        return catalogQueries.getPerfil();
    }
    public List< Catalog > getEstudioCatalogs() {
        return catalogQueries.getEstudio();
    }
    public List< Catalog > getDiciplinarCatalogs() {
        return catalogQueries.getDiciplinar();
    }
    public List< Catalog > getSubjectCatalogs() {
        return catalogQueries.getSubject();
    }

    public List<CareerModuleCatalog> getCompetencias(String careerKey) {
        Career career=careerQueries.getByCareerKey(careerKey);
        return catalogQueries.getCompetencias(career.getId());
    }
    //para mostrar todas las competencias registradas....
    public List< Catalog > getCompetenciaCatalogs() {
        return catalogQueries.getCompetencias();
    }

    public List<Catalog> getSubjectType() {
        return catalogQueries.getSubjectType();
    }

    public List< Catalog > getDiciplinaryCompentenceIsNotNullTrayecto( ) {
        return catalogQueries.getDiciplinaryCompentenceIsNotNullTrayecto();
    }

    public List<Catalog> getAllGroups() {
        return catalogQueries.getAllGroups();
    }

    public List<Catalog> getAllPermissions() {
        return catalogQueries.getAllPermissions();
    }

    public List<Catalog> getSchoolCycle() {
        return catalogQueries.getSchoolCycle();
    }

    public List<Catalog> selectPeriodFinished(Integer stateId, String generation) {
        List<Catalog> catalogs = new ArrayList<>();
        if (stateId > 0 && generation != null) {
            CatGeneration catGeneration = catalogQueries.getGeneration(generation);
            System.out.println(catGeneration.getGeneration()+"--"+catGeneration.getId());
            boolean isExist = catalogQueries.isExistStateIdAndGenerationId(stateId, generation);
            System.out.println(isExist);
            if (isExist)  catalogs = catalogQueries.selectPeriodFinished(stateId, generation, catalogs);
            catalogs.forEach(r->{
                System.out.println(r.getId()+"  "+r.getDescription1());
            });
        }
        return catalogs.stream().collect(Collectors.toList());
    }
}
