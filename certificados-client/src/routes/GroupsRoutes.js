import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import GroupsSearch from "../pages/groups/search/GroupsSearch";
import GroupAdd from "../pages/groups/add/GroupAdd";
import GroupEdit from "../pages/groups/edit/GroupEdit";
import GroupAddStudents from "../pages/groups/addStudents/groupsAddStudents";
import GroupsApprovals from "../pages/groups/approvals/GroupsApprovals";
import GroupsApprovalsDetails from "../pages/groups/approvals/GroupsApprovalsDetails";
import { permissionList } from "../shared/constants";

const {
  BUSCAR_GRUPO,
  CREAR_GRUPO,
  EDITAR_GRUPO,
  APROBAR_GRUPOS,
  INSCRIBIR_ALUMNOS_A_GRUPO,
} = permissionList;

export const GroupsRoutes = {
  groupsSearch: {
    path: "/Grupos",
    Component: GroupsSearch,
    Permissions: [BUSCAR_GRUPO],
  },
  groupAdd: {
    path: "/Grupos/Agregar",
    Component: GroupAdd,
    Permissions: [CREAR_GRUPO],
  },
  groupEdit: {
    path: "/Grupos/Editar/:groupId",
    Component: GroupEdit,
    Permissions: [EDITAR_GRUPO],
  },
  groupAddStudents: {
    path: "/Grupos/Agregar-Estudiantes/:groupId/:periods",
    Component: GroupAddStudents,
    Permissions: [INSCRIBIR_ALUMNOS_A_GRUPO], // TODO: Revisar esta vista y sus permisos
  },
  groupsApprovals: {
    path: "/Grupos/Aprobaciones",
    Component: GroupsApprovals,
    Permissions: [APROBAR_GRUPOS],
  },
  groupsApprovalsDetails: {
    path: "/Grupos/Aprobaciones/Detalles/:groupId",
    Component: GroupsApprovalsDetails, // TODO: Desarrollar este modulo si es requerido
    Permissions: [APROBAR_GRUPOS],
  },
};

export const GroupsSubmenus = {
  groups: {
    path: GroupsRoutes.groupsSearch.path,
    name: "Lista Grupos",
    Icon: UnorderedListOutlined,
    Permissions: GroupsRoutes.groupsSearch.Permissions,
  },
  groupAdd: {
    path: GroupsRoutes.groupAdd.path,
    name: "Agregar Grupos",
    Icon: PlusCircleOutlined,
    Permissions: GroupsRoutes.groupAdd.Permissions,
  },
  groupsApprovals: {
    path: GroupsRoutes.groupsApprovals.path,
    name: "Aprobaciones",
    Icon: CheckOutlined,
    Permissions: GroupsRoutes.groupsApprovals.Permissions,
  },
};

export const GroupsMenus = {
  groups: {
    name: "Grupos",
    Icon: AppstoreOutlined,
    submenus: Object.values(GroupsSubmenus),
  },
};
