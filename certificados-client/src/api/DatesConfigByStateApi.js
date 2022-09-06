import apicall from "../shared/apicall";

//const controllerPhp = "aspirantes";
const DatesConfigByStateApi = {
  getDateConfigPeriod: async ( {estado_id, periodo_id} ) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        `config-fechas-periodo`,
        `${estado_id}/${periodo_id}`,
        //"",
        true
      );
      if (apiResponse?.data) {
        response.data = apiResponse.data?.data;
      }
    } catch (exception) {
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  editDateConfigPeriod: async (
    {
      estado_id,
      periodo_id,
      fecha_inicio,
      fecha_fin
    }
  ) => {
    let response = { success: true };
    const data = {};
    if (estado_id) data.estado_id = estado_id;
    if (periodo_id) data.periodo_id = periodo_id;
    if (fecha_inicio) data.fecha_inicio = fecha_inicio;
    if (fecha_fin) data.fecha_fin = fecha_fin;
    try {
      const apiResponse = await apicall.put(
        "config-fechas-periodo",
        "",
        data,
        true
      );
      if (apiResponse?.data) {
        response.data = apiResponse.data;
      }
    } catch (exception) {
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
};
export default DatesConfigByStateApi;
