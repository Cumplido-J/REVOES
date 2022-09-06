import Survey from "../pages/survey2022/Survey";
import SurveyConfirmation from "../pages/survey2022/SurveyConfirmation";
import { permissionList } from "../shared/constants";

const { ACTUALIZAR_DATOS } = permissionList;
export const SurveyRoutes = {
  survey: {
    path: "/EncuestaIntenciones2022",
    Component: Survey,
    Permissions: [ACTUALIZAR_DATOS],
  },
  surveyConfirmation: {
    path: "/EncuestaIntenciones2022/:folio",
    Component: SurveyConfirmation,
    Permissions: [ACTUALIZAR_DATOS],
  },
  /*survey: {
    path: "/EncuestaSeguimiento2022",
    Component: Survey,
    Permissions: [ACTUALIZAR_DATOS],
  }, 
  surveyConfirmation: {
    path: "/EncuestaSeguimiento2022/:folio",
    Component: SurveyConfirmation,
    Permissions: [ACTUALIZAR_DATOS],
  }, */  
};
