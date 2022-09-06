import { FileTextOutlined } from '@ant-design/icons';
import { permissionList } from "../shared/constants";

import DgpSchools from "../pages/dgps/DgpSchools";
import DgpSchoolAdd from "../pages/dgps/DgpSchoolAdd";
import DgpSchoolEditar from "../pages/dgps/DgpSchoolEditar";

import DgpCareers from "../pages/dgps/DgpCareers";
import DgpCareerList from "../pages/dgps/DgpCareerList";
import DgpCareerAdd from "../pages/dgps/DgpCareerAdd";

import DecreeState from "../pages/dgps/DecreeState";
import DecreeEditar from "../pages/dgps/DecreeEditar";

import DgpStatisticsSchool from '../pages/dgps/DgpStatisticsSchool';

const {
  INFORMACION_DGP,
  INFORMACION_DGP_SCHOOL
} = permissionList;

export const DgpRoutes = {
  DgpSchools: {
    path: "/Dgp/Planteles",
    Component: DgpSchools,
    Permissions: [INFORMACION_DGP_SCHOOL],
  },
  
  DgpSchoolEditar: {
    path: "/Dgp/Planteles/Editar/:schoolId",
    Component: DgpSchoolEditar,
    Permissions: [INFORMACION_DGP],
  },
  DgpSchoolAdd: {
    path: "/Dgp/Planteles/Add",
    Component: DgpSchoolAdd,
    Permissions: [INFORMACION_DGP],
  },

  DgpCareerList: {
    path: "/Dgp/Carreras/List",
    Component: DgpCareerList,
    Permissions: [INFORMACION_DGP],
  },
  DgpCareerAdd: {
    path: "/Dgp/Carreras/Add",
    Component: DgpCareerAdd,
    Permissions: [INFORMACION_DGP],
  },
  DgpCareers: {
    path: "/Dgp/Carreras/:schoolId",
    Component: DgpCareers,
    Permissions: [INFORMACION_DGP],
  },
  
  DecreeState: {
    path: "/Dgp/Decreto/",
    Component: DecreeState,
    Permissions: [INFORMACION_DGP],
  },
  DecreeEditar: {
    path: "/Dgp/Decreto/Editar/:decreeId",
    Component: DecreeEditar,
    Permissions: [INFORMACION_DGP],
  },
  DgpStatisticsSchool: {
    path: "/Dgp/DgpStatisticsSchool",
    Component: DgpStatisticsSchool,
    Permissions: [INFORMACION_DGP],
  },
};

export const DgpSubmenus = {
  DgpSchools: {
    path: "/Dgp/Planteles",
    name: "Planteles en DGP",
    Icon: FileTextOutlined,
    Permissions: DgpRoutes.DgpSchools.Permissions,
  },
  DgpCareerList: {
    path: "/Dgp/Carreras/List",
    name: "Carreras en DGP",
    Icon: FileTextOutlined,
    Permissions: DgpRoutes.DgpCareerList.Permissions,
  },
  DecreeState: {
    path: "/Dgp/Decreto",
    name: "Decreto",
    Icon: FileTextOutlined,
    Permissions: DgpRoutes.DecreeState.Permissions,
  },
  DgpStatisticsSchool: {
    path: "/Dgp/DgpStatisticsSchool",
    name: "Estadística",
    Icon: FileTextOutlined,
    Permissions: DgpRoutes.DgpStatisticsSchool.Permissions,
  },
};

export const DgpMenus = {
  DGP: {
    name: "Datos DGP",
    Icon: FileTextOutlined,
    submenus: Object.values(DgpSubmenus),
  },
};