import {
  BACKEND_URL,
  BACKEND_URL_PHP,
  JWT_HEADER,
  Messages,
} from "../shared/constants";
import axios from "axios";
export default {
  /*
   * Ejecuta el metodo post al servicio requerido
   * @param {string} controller ubicación del controlador
   * @param {string} method metodo asociado al controlador
   * @param {FormData|Raw|JSON} data parametros enviados al servicio
   * @param {boolean} secondaryApi cambia el target del backend
   */
  post: async (controller, method, data, secondaryApi, config = {}) => {
    const URL = `${
      !secondaryApi ? BACKEND_URL : BACKEND_URL_PHP
    }/${controller}/${method}`;
    return await axios.post(URL, data, { ...JWT_HEADER(), ...config });
  },

  /*
   * Ejecuta el metodo get al servicio requerido
   * @param {string} controller ubicación del controlador
   * @param {string} method metodo asociado al controlador
   * @param {boolean} secondaryApi cambia el target del backend
   */
  get: async (controller, method, secondaryApi, config = {}) => {
    const URL = `${
      !secondaryApi ? BACKEND_URL : BACKEND_URL_PHP
    }/${controller}/${method}`;
    return await axios.get(URL, { ...JWT_HEADER(), ...config });
  },
  delete: async (controller, method, secondaryApi = false, config = {}) => {
    const URL = `${
      !secondaryApi ? BACKEND_URL : BACKEND_URL_PHP
    }/${controller}/${method}`;
    return await axios.delete(URL, { ...JWT_HEADER(), ...config });
  },
  put: async (controller, method, data, secondaryApi, config = {}) => {
    const URL = `${
      !secondaryApi ? BACKEND_URL : BACKEND_URL_PHP
    }/${controller}/${method}`;
    return await axios.put(URL, data, { ...JWT_HEADER(), ...config });
  },
  handleCatch: (error) => {
    const response = { sucess: false };
    if (!error.response || error.response.status === 404)
      response.message = Messages.error404;
    else if (error.response.status === 500) {
      if (error.response.data.message)
        response.message = error.response.data.message;
    } else if (error.response.status >= 400) {
      if (error.response.data.message)
        response.message = error.response.data.message;
    }
    return response;
  },

  handleCatchBlob: async (error) => {
    const response = { success: false };
    if (!error.response || error.response.status === 404) {
      // TODO: Hot fix, necesita updatearlo
      if (error.response) {
        try {
          const responseParsed = JSON.parse(await error.response.data.text());
          if (responseParsed.message) response.message = responseParsed.message;
          else response.message = Messages.error404;
        } catch (e) {
          response.message = Messages.error404;
        }
      } else {
        response.message = Messages.error404;
      }
    } else if (error.response.data) {
      if (typeof error.response.data) {
        response.message = error.response.data.message;
        if (!response.message) {
          const responseParsed = JSON.parse(await error.response.data.text());
          response.message = responseParsed.message;
        }
      } else {
        const responseParsed = JSON.parse(await error.response.data.text());
        response.message = responseParsed.message;
      }
    }
    return response;
  },

  handleCatchWithDetails: (error) => {
    const response = { sucess: false };
    if (!error.response || error.response.status === 404)
      response.message = Messages.error404;
    else if (error.response.status === 500) {
      if (error.response.data.message)
        response.message = error.response.data.message;
    } else if (error.response.status === 400) {
      if (error.response.data.message) {
        response.message = error.response.data.message;
      } else if (error.response.data.error) {
        response.message = error.response.data.error.message;
        response.details = error.response.data.error.details;
      }
    }
    return response;
  },

  handleCatchMultiData: (error) => {
    const response = { sucess: false };
    if (!error.response || error.response.status === 404)
      response.message = Messages.error404;
    else if (error.response.status === 500) {
      if (error.response.data.message)
        response.message = error.response.data.message;
    } else if (error.response.status === 400) {
      response.message = error.response.data.message;
      response.data = error.response.data.data;
    }
    return response;
  },
};
