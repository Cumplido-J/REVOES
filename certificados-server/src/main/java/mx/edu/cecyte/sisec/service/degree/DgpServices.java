package mx.edu.cecyte.sisec.service.degree;

import mx.edu.cecyte.sisec.dto.degree.DecreeSelect;
import mx.edu.cecyte.sisec.dto.degree.DegreeIntituteDgp;
import mx.edu.cecyte.sisec.dto.degree.DgpCombinationCareer;
import mx.edu.cecyte.sisec.dto.degree.DgpSelectCareer;
import mx.edu.cecyte.sisec.model.catalogs.CatState;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeCareerDgp;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeCombinationDgp;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeInstitute;
import mx.edu.cecyte.sisec.model.catalogs.degree.CatDegreeState;
import mx.edu.cecyte.sisec.model.education.School;
import mx.edu.cecyte.sisec.queries.degree.DgpQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DgpServices {
    @Autowired private DgpQueries dgpQueries;
    public DegreeIntituteDgp selectSchoolDgp(Integer schoolId) {
        return dgpQueries.selectSchoolDgp(schoolId);
    }

    public void updateSchoolDgp(DegreeIntituteDgp degreeIntituteDgp) {
        CatDegreeState state = new CatDegreeState();
        state.setId(degreeIntituteDgp.getState());
        School school = new School();
        school.setId(degreeIntituteDgp.getSchool());
        CatDegreeInstitute institute = new CatDegreeInstitute(degreeIntituteDgp, state, school);
        dgpQueries.updateSchoolDgp(institute);
    }

    public DegreeIntituteDgp addNewSchoolDgp(DegreeIntituteDgp degreeIntituteDgp) {
        CatDegreeInstitute school = new CatDegreeInstitute();
        school.setClave(degreeIntituteDgp.getClave());
        school.setName(degreeIntituteDgp.getName());
        school.setComplete(degreeIntituteDgp.getComplete());
        CatDegreeState state = new CatDegreeState();
        state.setId(degreeIntituteDgp.getState());
        school.setEntity(state);
        School school1 = new School();
        school1.setId(degreeIntituteDgp.getSchool());
        school.setSchool(school1);
        dgpQueries.addNewSchoolDgp(school);
        return degreeIntituteDgp;
    }

    public DgpCombinationCareer DgpCombinationCareer(DgpCombinationCareer dgpCombinationCareer) {
        CatDegreeCombinationDgp combination = new CatDegreeCombinationDgp();
        CatDegreeInstitute institute = new CatDegreeInstitute();
        institute.setId(dgpCombinationCareer.getSchoolId());
        combination.setInstitute(institute);
        CatDegreeCareerDgp career = new CatDegreeCareerDgp();
        career.setId(dgpCombinationCareer.getCareerId());
        combination.setCareer(career);
        dgpQueries.DgpCombinationCareer(combination);
        return dgpCombinationCareer;
    }

    public List<DgpSelectCareer> selectAllCareerDgp() {
        return dgpQueries.selectAllCareerDgp();
    }

    public List<DecreeSelect> selectAllDecree(Integer stateId) {
        return dgpQueries.selectAllDecree(stateId);
    }

    public DecreeSelect updateStateDecree(DecreeSelect decreeSelect) {
        CatDegreeState entity = new CatDegreeState();
        entity.setId(decreeSelect.getId());
        entity.setName(decreeSelect.getName());
        entity.setAbbreviation(decreeSelect.getAbbreviation());
        entity.setDecreeNumber(decreeSelect.getDecreeNumber());
        entity.setDecreeDate(decreeSelect.getDecreeDate());
        CatState state = new CatState();
        state.setId(decreeSelect.getId());
        entity.setState(state);
        entity.setCityName(decreeSelect.getCityName());
        entity = dgpQueries.updateStateDecree(entity);
        return decreeSelect;
    }

    public DgpSelectCareer addNewCareerDgp(DgpSelectCareer dgpSelectCareer) {
        CatDegreeCareerDgp career = new CatDegreeCareerDgp();
        career.setClave(dgpSelectCareer.getClave());
        career.setCarrer(dgpSelectCareer.getCarrer());
        career.setName(dgpSelectCareer.getName());
        career.setModality(dgpSelectCareer.getModality());
        career.setLevel(dgpSelectCareer.getLevel());
        career = dgpQueries.addNewCareerDgp(career);
        return dgpSelectCareer;
    }

    public String deleteCombinationCareer(Integer combinationId) {
        CatDegreeCombinationDgp careerDgp = dgpQueries.findByIdDgp(combinationId);
        dgpQueries.deleteCombinationCareer(careerDgp);
        return "Eliminado";
    }
}
