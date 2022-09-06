import { FileTextOutlined } from '@ant-design/icons';

import DegreeReportCountry from "../pages/degreeReport/DegreeReportCountry";
import DegreeReportState from "../pages/degreeReport/DegreeReportState";
import DegreeReportSchool from "../pages/degreeReport/DegreeReportSchool";

import { permissionList } from "../shared/constants";

const {
    REPORTE_CERTIFICADO_REPUBLICA,
    REPORTE_CERTIFICADO_ESTATAL,
    REPORTE_CERTIFICADO_PLANTEL,
    REPORTE_CERTIFICADO_ESTATAL_DEPRECADO,
    REPORTE_CERTIFICADO_PLANTEL_DEPRECADO,
} = permissionList;

export const DegreeReportRoutes = {
    degreeReportCountry: {
        path: "/Degree/Republica",
        Component: DegreeReportCountry,
        Permissions: [REPORTE_CERTIFICADO_REPUBLICA],
    },
    degreeReportState: {
        path: "/Degree/Estatal/",
        Component: DegreeReportState,
        Permissions: [REPORTE_CERTIFICADO_ESTATAL_DEPRECADO],
    },
    degreeReportStateId: {
        path: "/Degree/Estatal/:stateId/:generation",
        Component: DegreeReportState,
        Permissions: [REPORTE_CERTIFICADO_ESTATAL],
    },
    degreeReportSchool: {
        path: "/Degree/Plantel/",
        Component: DegreeReportSchool,
        Permissions: [REPORTE_CERTIFICADO_PLANTEL_DEPRECADO],
    },
    degreeReportSchoolId: {
        path: "/Degree/Plantel/:schoolId/:generation",
        Component: DegreeReportSchool,
        Permissions: [REPORTE_CERTIFICADO_REPUBLICA, REPORTE_CERTIFICADO_ESTATAL, REPORTE_CERTIFICADO_PLANTEL],
    },
};

export const DegreeReportSubmenus = {
    degreeReportCountry: {
        path: "/Degree/Republica",
        name: "Reporte república",
        Icon: FileTextOutlined,
        Permissions: DegreeReportRoutes.degreeReportCountry.Permissions,
    },
    degreeReportState: {
        path: "/Degree/Estatal",
        name: "Reporte estatal",
        Icon: FileTextOutlined,
        Permissions: DegreeReportRoutes.degreeReportState.Permissions,
    },
    degreeReportSchool: {
        path: "/Degree/Plantel",
        name: "Reporte plantel",
        Icon: FileTextOutlined,
        Permissions: DegreeReportRoutes.degreeReportSchool.Permissions,
    },
};

export const DegreeReportMenus = {
    degreeReport: {
        name: "Reporte Titulos",
        Icon: FileTextOutlined,
        submenus: Object.values(DegreeReportSubmenus),
    },
};