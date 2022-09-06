import SigedApi from "../api/SigedApi";

import Alerts from "../shared/alerts";

export default {
  searchFolioData: async (folio) => {
    const response = await SigedApi.searchFolioData(folio);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  searchFolioDataApi: async (folio) => {
    const response = await SigedApi.searchFolioDataApi(folio);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  //codigo eug
  getFolioData: async (folio) => {
    const response = await SigedApi.getFolioData(folio);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
  searchFolioDataDegree: async (folio) => {
    const response = await SigedApi.searchFolioDataDegree(folio);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};

