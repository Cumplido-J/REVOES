import Alerts from "../shared/alerts";
import DatesConfigByStateApi from "../api/DatesConfigByStateApi";

export const getDateConfigPeriod = async (props) => {
  const response = await DatesConfigByStateApi.getDateConfigPeriod(props);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const editDateConfigPeriod = async (props) => {
  const response = await DatesConfigByStateApi.editDateConfigPeriod(props);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};