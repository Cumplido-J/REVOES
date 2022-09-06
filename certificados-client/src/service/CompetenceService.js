import CompetenciaApi from "../api/CompetenciaApi";
import Alerts from "../shared/alerts";

export default {
    addCompetencia:async(form)=>{
        const response=await CompetenciaApi.addCompetencia(form);
        if(!response.success)Alerts.error("Ha ocurrido un error",response.message);
        return response;
    }, 
    competenceAll: async () => {
        const response = await CompetenciaApi.competenceAll();
        if (!response.success)
          Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },  
    getCompetenceData: async (id) => {
        const response = await CompetenciaApi.getCompetenceData(id);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    editCompetence: async (id, form) => {
        const response = await CompetenciaApi.editCompetence(id, form);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
      },
      competenceSearch: async (values) => {
        const response = await CompetenciaApi.competenceSearch(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
      },                      
}