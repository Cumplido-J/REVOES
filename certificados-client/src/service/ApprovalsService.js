import ApprovalsApi from "../api/ApprovalsApi";
import Alerts from "../shared/alerts";

export const getUnapprovedGroups = async (filters) => {
  const response = await ApprovalsApi.getUnapprovedGroups(filters);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setGroupApprovalStatus = async (id, data, url = false) => {
  const response = await ApprovalsApi.setGroupApprovalStatus(id, data, url);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
