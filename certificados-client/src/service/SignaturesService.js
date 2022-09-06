import SignaturesApi from "../api/SignaturesApi";

import Alerts from "../shared/alerts";

export const getUacOptionals = async (groupPeriodId) => {
  const response = await SignaturesApi.getUacOptionals(groupPeriodId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
