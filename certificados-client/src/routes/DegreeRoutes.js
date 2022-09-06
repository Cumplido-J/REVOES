import { UnorderedListOutlined, CloudDownloadOutlined, FilePdfOutlined, HighlightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DegreeCancelExternal from "../pages/degree/DegreeCancelExternal";
import DegreeQuery from "../pages/degree/DegreeQuery";
import DegreeUpload from "../pages/degree/DegreeUpload";

import DegreeValidate from "../pages/degree/DegreeValidate";
import { permissionList } from "../shared/constants";

const {
    VALIDAR_ALUMNOS_PRE_TITULAR,
    CONSULTAR_ALUMNOS_PRE_TITULAR,
    TITULAR_ALUMNOS,
    TITULO_CANCEL_EXTERNAL,
} = permissionList;

export const DegreeRoutes = {
  degreeValidate: {
    path: "/Titulacion/Validar",
    Component: DegreeValidate,
    Permissions: [VALIDAR_ALUMNOS_PRE_TITULAR],
  },
  degreeQuery: {
    path: "/Titulacion/Consulta",
    Component: DegreeQuery,
    Permissions: [CONSULTAR_ALUMNOS_PRE_TITULAR],
  },
  degreeUpload: {
    path: "/Titulacion/Certificar",
    Component: DegreeUpload,
    Permissions: [TITULAR_ALUMNOS],
  },
  degreeCancelExternal: {
    path: "/Titulacion/CancelacionExterna",
    Component: DegreeCancelExternal,
    Permissions: [TITULO_CANCEL_EXTERNAL],
  },
};

export const DegreeSubmenus = {
  degreeCancelExternal: {
    path: "/Titulacion/CancelacionExterna",
    name: "Cancelación externa" ,
    Icon: CloseCircleOutlined,
    Permissions: DegreeRoutes.degreeCancelExternal.Permissions,
  },
  degreeValidate: {
    path: "/Titulacion/Validar",
    name: "Validar Alumnos",
    Icon: UnorderedListOutlined,
    Permissions: DegreeRoutes.degreeValidate.Permissions,
  },
  degreeQuery: {
    path: "/Titulacion/Consulta",
    name: "Consultar Alumnos",
    Icon: CloudDownloadOutlined,
    Permissions: DegreeRoutes.degreeQuery.Permissions,
  },
  degreeUpload: {
    path: "/Titulacion/Certificar",
    name: "Titular Alumnos",
    Icon: FilePdfOutlined,
    Permissions: DegreeRoutes.degreeUpload.Permissions,
  },
};

export const DegreeMenus = {
  degree: {
    name: "Titular Alumnos",
    Icon: HighlightOutlined,
    submenus: Object.values(DegreeSubmenus),
  },
};
