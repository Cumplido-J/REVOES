import LoginApi from "../api/LoginApi";

import Alerts from "../shared/alerts";
import { JWT_TOKEN } from "../shared/constants";

export default {
  login: async (values) => {
    if (!values) values = {};
    if (!values.username) values.username = null;
    if (!values.password) values.password = null;

    const response = await LoginApi.login(values);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getUserProfile: async () => {
    const response = await LoginApi.getUserProfile();

    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  successfulLogin: (jwt) => {
    Alerts.success("Sesión iniciada", "Sesión iniciada exitosamente");
    localStorage.setItem(JWT_TOKEN, jwt);
  },
  logout: (history, message) => {
    if (!message) message = "Su sesión se ha cerrado correctamente";
    localStorage.removeItem(JWT_TOKEN);
    history.push("/");

    Alerts.info("Se ha cerrado su sesión", message);
  },
  getPermissions: async () => {
    const response = await LoginApi.getPermissions();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
