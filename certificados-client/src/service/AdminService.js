import AdminApi from "../api/AdminApi";

import Alerts from "../shared/alerts";

export default {
  countTemporalPasswords: async () => {
    const response = await AdminApi.countTemporalPasswords();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateTemporalPasswords: async () => {
    const response = await AdminApi.updateTemporalPasswords();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
