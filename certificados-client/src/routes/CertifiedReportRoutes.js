import {FileTextOutlined} from '@ant-design/icons';

import CertifiedReportCountry from "../pages/certifiedreport/CertifiedReportCountry";
import CertifiedReportState from "../pages/certifiedreport/CertifiedReportState";
import CertifiedReportSchool from "../pages/certifiedreport/CertifiedReportSchool";
import {permissionList} from "../shared/constants";

const {
  REPORTE_CERTIFICADO_REPUBLICA,
  REPORTE_CERTIFICADO_ESTATAL,
  REPORTE_CERTIFICADO_PLANTEL,
  REPORTE_CERTIFICADO_ESTATAL_DEPRECADO,
  REPORTE_CERTIFICADO_PLANTEL_DEPRECADO,
} = permissionList;

export const CertifiedReportRoutes = {
    certifiedReportCountry: {
      path: "/Certified/Republica",
      Component: CertifiedReportCountry,
      Permissions: [REPORTE_CERTIFICADO_REPUBLICA],
    },
    certifiedReportState: {
    path: "/Certified/Estatal/",
    Component: CertifiedReportState,
    Permissions: [REPORTE_CERTIFICADO_ESTATAL_DEPRECADO],
  },
  certifiedReportStateId: {
    path: "/Certified/Estatal/:stateId/:generation",
    Component: CertifiedReportState,
    Permissions: [REPORTE_CERTIFICADO_ESTATAL],
  },
  certifiedReportSchool: {
    path: "/Certified/Plantel/",
    Component: CertifiedReportSchool,
    Permissions: [REPORTE_CERTIFICADO_PLANTEL_DEPRECADO],
  },
  surveyReportSchoolId: {
    path: "/Certified/Plantel/:schoolId/:generation",
    Component: CertifiedReportSchool,
    Permissions: [REPORTE_CERTIFICADO_REPUBLICA, REPORTE_CERTIFICADO_ESTATAL, REPORTE_CERTIFICADO_PLANTEL],
  },
  };

export const CertifiedReportSubmenus = {
    certifiedReportCountry: {
        path: "/Certified/Republica",
        name: "Reporte república",
        Icon: FileTextOutlined,
        Permissions: CertifiedReportRoutes.certifiedReportCountry.Permissions,
    },
    certifiedReportState: {
      path: "/Certified/Estatal",
      name: "Reporte estatal",
      Icon: FileTextOutlined,
      Permissions: CertifiedReportRoutes.certifiedReportState.Permissions,
    },
    certifiedReportSchool: {
      path: "/Certified/Plantel",
      name: "Reporte plantel",
      Icon: FileTextOutlined,
      Permissions: CertifiedReportRoutes.certifiedReportSchool.Permissions,
    },
};

export const CertifiedReportMenus = {
    certifiedReport: {
      name: "Reporte Certificados",
      Icon: FileTextOutlined,
      submenus: Object.values(CertifiedReportSubmenus),
    },
};