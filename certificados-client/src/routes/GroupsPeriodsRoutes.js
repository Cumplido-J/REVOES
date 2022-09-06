import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  // PlusCircleOutlined,
  // CheckOutlined,
} from "@ant-design/icons";

import GroupsSearch from "../pages/groups-periods/search/groupsPeriodsSearch";
import OptionalSignatures from "../pages/groups-periods/optionalSignatures/addEditOptionalSignatures";
import EnrollmentSignatures from "../pages/groups-periods/enrollmentSignatures/EnrollmentSignatures";
import SchoolEnrollmentSettings from "../pages/groups-periods/schoolEnrollmentSettings/SchoolEnrollmentSettings";
import AddStudents from "../pages/groups-periods/addStudents/AddStudents";
import { permissionList } from "../shared/constants";
import ChangeGroupStudent from "../pages/groups-periods/changeGroupStudent/ChangeGroupStudent";

const {
  BUSCAR_GRUPO_PERIODO,
  CONFIGURAR_FECHA_INSCRIPCION_POR_GRUPO,
  CONFIGURAR_FECHA_INSCRIPCION_POR_PLANTEL,
  AGREGAR_OPTATIVAS_A_GRUPO_PERIODO,
  INSCRIBIR_ALUMNOS_A_GRUPO,
} = permissionList;

export const GroupsPeriodsRoutes = {
  groupsPeriodsSearch: {
    path: "/Grupos-Periodos",
    Component: GroupsSearch,
    Permissions: [BUSCAR_GRUPO_PERIODO],
  },
  groupsPeriodsOptionaSignatures: {
    path: "/Grupos-Periodos/Optativas/:groupPeriodsId",
    Component: OptionalSignatures,
    Permissions: [AGREGAR_OPTATIVAS_A_GRUPO_PERIODO],
  },
  groupsPeriodsEnrollmentSettings: {
    path: "/Grupos-Periodos/Configuracion-de-Inscripcion/:groupPeriodsId",
    Component: EnrollmentSignatures,
    Permissions: [CONFIGURAR_FECHA_INSCRIPCION_POR_GRUPO],
  },
  schoolGroupsPeriodsEnrollmentSettings: {
    path: "/Grupos-Periodos/Configuracion-de-Inscripcion-por-Plantel",
    Component: SchoolEnrollmentSettings,
    Permissions: [CONFIGURAR_FECHA_INSCRIPCION_POR_PLANTEL],
  },
  addStudentGroupsPeriods: {
    path: "/Grupos-Periodos/Agregar-Alumnos-Regulares/:groupPeriodId",
    Component: AddStudents,
    Permissions: [INSCRIBIR_ALUMNOS_A_GRUPO],
  },
  changeGroupStudent: {
    path: "/Grupos-Periodos/Cambiar-Alumnos-De-Grupo/:groupPeriodId",
    Component: ChangeGroupStudent,
    Permissions: [INSCRIBIR_ALUMNOS_A_GRUPO],
  },
};

export const GroupsPeriodSubmenus = {
  groupsPeriods: {
    path: GroupsPeriodsRoutes.groupsPeriodsSearch.path,
    name: "Lista Grupos-Periodos",
    Icon: UnorderedListOutlined,
    Permissions: GroupsPeriodsRoutes.groupsPeriodsSearch.Permissions,
  },
  groupsPeriodsEnrollment: {
    path: GroupsPeriodsRoutes.schoolGroupsPeriodsEnrollmentSettings.path,
    name: "Configuración de inscripciones por plantel",
    Icon: SettingOutlined,
    Permissions:
      GroupsPeriodsRoutes.schoolGroupsPeriodsEnrollmentSettings.Permissions,
  },
};

export const GroupsPeriodMenus = {
  groupsPeriods: {
    name: "Grupos-Periodos",
    Icon: AppstoreOutlined,
    submenus: Object.values(GroupsPeriodSubmenus),
  },
};
