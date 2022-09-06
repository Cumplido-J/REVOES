import StudentMasiveLoadApi from "../api/StudentMasiveLoadApi";

import Alerts from "../shared/alerts";

export default {
  masiveLoad: async (form) => {
    const response = await StudentMasiveLoadApi.masiveLoad(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  loadingMasiveDiciplinary: async (form) => {
    const response = await StudentMasiveLoadApi.loadingMasiveDiciplinary(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
}