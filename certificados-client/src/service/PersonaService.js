//Archivo creado el 24 de junio 
import PersonaApi from "../api/PersonaApi";

import Alerts from "../shared/alerts";

export default {
  personaAll: async () => {
    const response = await PersonaApi.personaSearch();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  addPersona: async (form) => {
    const response = await PersonaApi.addPersona(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editPersona: async (curp, form) => {
    const response = await PersonaApi.editPersona(curp, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPersonaData: async (curp) => {
    const response = await PersonaApi.getPersonaData(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
  deleteCurp: async (curp) => {
    const response = await PersonaApi.deleteCurp(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
};
