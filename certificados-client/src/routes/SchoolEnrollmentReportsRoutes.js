import {
  FileTextOutlined,
} from "@ant-design/icons";


import SchoolEnrollmentCapture from "../pages/reports/EnrollmentCapture/SchoolEnrollmentCapture";
import SchoolEnrollmentReport from "../pages/reports/EnrollmentReports/SchoolEnrollmentReport";
///nuevos reportes
import GraduateCapture from "../pages/reports/GraduateCapture/GraduateCapture";
import GraduatesReport from "../pages/reports/GraduateReports/GraduatesReport";
import EducationLevelCapture from "../pages/reports/EducationLevelCapture/EducationLevelCapture";
import EducationLevelReport from "../pages/reports/EducationLevelReports/EducationLevelReport";

import { permissionList } from "../shared/constants";

const { REPORTE_MATRICULA_ESCOLAR, REPORTE_MATRICULA_POR_ENTIDAD, REGISTRO_EGRESADOS_TITULADOS, REPORTE_EGRESADOS_TITULADOS, REGISTRO_NIVEL_ESTUDIOS, REPORTE_NIVEL_ESTUDIOS } = permissionList;

export const SchoolEnrollmentRoutes = {
  schoolEnrollmentCapture: {
    path: "/Reportes/RegistroMatricula",
    Component: SchoolEnrollmentCapture,
    Permissions:  [REPORTE_MATRICULA_ESCOLAR],
  },
  schoolEnrollmentReport: {
    path: "/Reportes/ReporteMatricula",
    Component: SchoolEnrollmentReport,
    Permissions:  [REPORTE_MATRICULA_POR_ENTIDAD],
  },
  /////////los dos nuevos reportes
  graduateCapture: {
    path: "/Reportes/RegistroEgresadosTitulados",
    Component: GraduateCapture,
    Permissions:  [REGISTRO_EGRESADOS_TITULADOS],
  },
  graduatesReport: {
    path: "/Reportes/ReporteEgresadosTitulados",
    Component: GraduatesReport,
    Permissions:  [REPORTE_EGRESADOS_TITULADOS],
  },
  educationLevelCapture: {
    path: "/Reportes/RegistroNivelEstudios",
    Component: EducationLevelCapture,
    Permissions:  [REGISTRO_NIVEL_ESTUDIOS],
  },
  educationLevelReport: {
    path: "/Reportes/ReportesNivelEstudios",
    Component: EducationLevelReport,
    Permissions:  [REPORTE_NIVEL_ESTUDIOS],
  },
};

export const SchoolEnrollmentSubmenus = {
  schoolEnrollmentCapture: {
    path: "/Reportes/RegistroMatricula",
    name: "Captura matricula escolar",
    Icon: FileTextOutlined,
    Permissions: SchoolEnrollmentRoutes.schoolEnrollmentCapture.Permissions,
  },
  schoolEnrollmentReport: {
    path: "/Reportes/ReporteMatricula",
    name: "Reporte matricula por entidad",
    Icon: FileTextOutlined,
    Permissions: SchoolEnrollmentRoutes.schoolEnrollmentReport.Permissions,
  },
  ////////////////////////////reportes nuevos
  graduateCapture: {
    path: "/Reportes/RegistroEgresadosTitulados",
    name: "Registro egresados y titulados",
    Icon: FileTextOutlined,
    Permissions: SchoolEnrollmentRoutes.graduateCapture.Permissions,
  },
  graduatesReport: {
    path: "/Reportes/ReporteEgresadosTitulados",
    name: "Consulta egresados y titulados",
    Icon: FileTextOutlined,
    Permissions: SchoolEnrollmentRoutes.graduatesReport.Permissions,
  },
  educationLevelCapture: {
    path: "/Reportes/RegistroNivelEstudios",
    name: "Registro nivel estudios",
    Icon: FileTextOutlined,
    Permissions: SchoolEnrollmentRoutes.educationLevelCapture.Permissions,
  },
  educationLevelReport: {
    path: "/Reportes/ReportesNivelEstudios",
    name: "Consulta nivel de estudios",
    Icon: FileTextOutlined,
    Permissions: SchoolEnrollmentRoutes.educationLevelReport.Permissions,
  }
};

export const SchoolEnrollmentMenus = {
  schoolEnrollment: {
    name: "Reportes Matriculación",
    Icon: FileTextOutlined,
    submenus: Object.values(SchoolEnrollmentSubmenus),
  },
};