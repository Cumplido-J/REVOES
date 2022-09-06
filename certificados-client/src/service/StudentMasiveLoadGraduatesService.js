import StudentMasiveLoadGraduatesApi from "../api/StudentMasiveLoadGraduatesApi";

import Alerts from "../shared/alerts";

export default {
  masiveLoad: async (form) => {
    const response = await StudentMasiveLoadGraduatesApi.masiveLoad(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }
}