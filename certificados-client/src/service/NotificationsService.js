import NotificationsApi from "../api/NotificationsApi";

import Alerts from "../shared/alerts";

export const getNotifications = async (page) => {
  const response = await NotificationsApi.getNotifications({ page });
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const readNotifications = async () => {
  const response = await NotificationsApi.readNotifications();
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
