import { FileDoneOutlined } from "@ant-design/icons";
import ShowReportCardBySemester from "../pages/reportCard/ShowReportCardBySemester/ShowReportCardBySemester";
import { permissionList } from "../shared/constants";

const { SISEC, GENERAR_BOLETAS } = permissionList;

export const ReportCardRoutes = {
  reportCardBySemester: {
    path: "/boletas-por-semestre",
    Component: ShowReportCardBySemester,
    Permissions: [GENERAR_BOLETAS], // TODO: Generar permisos para generar boletas
  },
};

export const ReportCardSubmenus = {
  reportCardBySemester: {
    path: ReportCardRoutes.reportCardBySemester.path,
    name: "Boletas por semestre",
    Icon: FileDoneOutlined,
    Permissions: ReportCardRoutes.reportCardBySemester.Permissions,
  },
};

export const ReportCardMenus = {
  reportCard: {
    name: "Boletas de calificaciones",
    Icon: FileDoneOutlined,
    submenus: Object.values(ReportCardSubmenus),
  },
};
