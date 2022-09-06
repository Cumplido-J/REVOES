import { FileTextOutlined } from "@ant-design/icons";

import SurveyReportCountry from "../pages/surveyreport/SurveyReportCountry";
import SurveyReportState from "../pages/surveyreport/SurveyReportState";
import SurveyReportSchool from "../pages/surveyreport/SurveyReportSchool";
import SurveyReportAnswers from "../pages/surveyreport/SurveyReportAnswers";
import { permissionList } from "../shared/constants";

const { REPORTES, REPORTE_ESTATAL, REPORTE_PLANTEL,REPORTE_ESTATAL_DEPRECADO, REPORTE_PLANTEL_DEPRECADO } = permissionList;

export const SurveyReportRoutes = {
  surveyReportCountry: {
    path: "/Reportes/Republica",
    Component: SurveyReportCountry,
    Permissions: [REPORTES],
  },
  surveyReportState: {
    path: "/Reportes/Estatal/",
    Component: SurveyReportState,
    Permissions: [REPORTE_ESTATAL_DEPRECADO],
  },
  surveyReportStateId: {
    path: "/Reportes/Estatal/:stateId/:surveyTipo",
    Component: SurveyReportState,
    Permissions: [REPORTE_ESTATAL],
  },
  surveyReportSchoolId: {
    path: "/Reportes/Plantel/:schoolId/:surveyTipo",
    Component: SurveyReportSchool,
    Permissions: [REPORTES, REPORTE_ESTATAL, REPORTE_PLANTEL],
  },
  surveyReportSchool: {
    path: "/Reportes/Plantel/",
    Component: SurveyReportSchool,
    Permissions: [REPORTE_PLANTEL_DEPRECADO],
  },
  surveyReportAnswers: {
    path: "/Reportes/Respuestas/:curp",
    Component: SurveyReportAnswers,
    Permissions: [REPORTES, REPORTE_ESTATAL, REPORTE_PLANTEL],
  },
};

export const SurveyReportSubmenus = {
  surveyReportCountry: {
    path: "/Reportes/Republica",
    name: "Reporte república",
    Icon: FileTextOutlined,
    Permissions: SurveyReportRoutes.surveyReportCountry.Permissions,
  },
  surveyReportState: {
    path: "/Reportes/Estatal",
    name: "Reporte estatal",
    Icon: FileTextOutlined,
    Permissions: SurveyReportRoutes.surveyReportState.Permissions,
  },
  surveyReportSchool: {
    path: "/Reportes/Plantel",
    name: "Reporte plantel",
    Icon: FileTextOutlined,
    Permissions: SurveyReportRoutes.surveyReportSchool.Permissions,
  },
};

export const SurveyReportMenus = {
  surveyReport: {
    name: "Reportes Encuestas",
    Icon: FileTextOutlined,
    submenus: Object.values(SurveyReportSubmenus),
  },
};
