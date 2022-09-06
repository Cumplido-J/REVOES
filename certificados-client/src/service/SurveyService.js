import SurveyApi from "../api/SurveyApi";

import Alerts from "../shared/alerts";

export default {
  submitSurvey: async (form) => {
    const response = await SurveyApi.submitSurvey(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  successfulSurvey: async (history, getUserProfile, folio) => {
    await getUserProfile();
    history.push(`/EncuestaIntenciones2022/${folio}`);
  },
  getInfoFromFolio: async ( folio) => {
    const response = await SurveyApi.getInfoFromFolio(folio);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
