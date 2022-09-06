import {
  UnorderedListOutlined,
  CloudDownloadOutlined,
  FilePdfOutlined,
  HighlightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import CertificateCancelExternal from "../pages/certificate/CertificateCancelExternal";
import CertificateQuery from "../pages/certificate/CertificateQuery";
import CertificateUpload from "../pages/certificate/CertificateUpload";

import CertificateValidate from "../pages/certificate/CertificateValidate";
import { permissionList } from "../shared/constants";

const {
  VALIDAR_ALUMNOS,
  CONSULTAR_ALUMNOS,
  CERTIFICAR_ALUMNOS,
  CERTIFICADO_CANCEL_EXTERNAL,
} = permissionList;

export const CertificateRoutes = {
  certificateValidate: {
    path: "/Certificado/Validar",
    Component: CertificateValidate,
    Permissions: [VALIDAR_ALUMNOS],
  },
  certificateQuery: {
    path: "/Certificado/Consulta",
    Component: CertificateQuery,
    Permissions: [CONSULTAR_ALUMNOS],
  },
  certificateUpload: {
    path: "/Certificado/Certificar",
    Component: CertificateUpload,
    Permissions: [CERTIFICAR_ALUMNOS],
  },
  certificateCancelExternal: {
    path: "/Certificado/CancelacionExterna",
    Component: CertificateCancelExternal,
    Permissions: [CERTIFICADO_CANCEL_EXTERNAL],
  },
};

export const CertificateSubmenus = {
  certificateCancelExternal: {
    path: "/Certificado/CancelacionExterna",
    name: "Cancelación externa",
    Icon: CloseCircleOutlined,
    Permissions: CertificateRoutes.certificateCancelExternal.Permissions,
  },
  certificateValidate: {
    path: "/Certificado/Validar",
    name: "Validar Alumnos",
    Icon: UnorderedListOutlined,
    Permissions: CertificateRoutes.certificateValidate.Permissions,
  },
  certificateQuery: {
    path: "/Certificado/Consulta",
    name: "Consultar Alumnos",
    Icon: CloudDownloadOutlined,
    Permissions: CertificateRoutes.certificateQuery.Permissions,
  },
  certificateUpload: {
    path: "/Certificado/Certificar",
    name: "Certitficar Alumnos",
    Icon: FilePdfOutlined,
    Permissions: CertificateRoutes.certificateUpload.Permissions,
  },
};

export const CertificateMenus = {
  certificate: {
    name: "Certificar Alumnos",
    Icon: HighlightOutlined,
    submenus: Object.values(CertificateSubmenus),
  },
};
