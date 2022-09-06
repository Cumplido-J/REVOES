package mx.edu.cecyte.sisec.queries;

import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.repo.education.SchoolCareerRepository;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolCareerQueries {

    @Autowired private SchoolCareerRepository schoolCareerRepository;

    public SchoolCareer getById(Integer schoolCareerId) {
        return schoolCareerRepository.findById(schoolCareerId).orElseThrow(() -> new AppException(Messages.schoolCareer_wrongId));
    }

    public List<SchoolCareer> findByCareerIdList(List<Integer> career, Integer id){
        return  schoolCareerRepository.findListByCareer(career, id);
    }

    public List<SchoolCareer> getBySchoolCctList(String cct) {
        return schoolCareerRepository.findListBySchool(cct);
    }

    public SchoolCareer findByCctAndClaveCareer(String cct, String claveCareer) {
        return schoolCareerRepository.findByCctAndClaveCareer(cct, claveCareer);
    }
}
