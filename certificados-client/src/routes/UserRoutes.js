import { UnorderedListOutlined, UserAddOutlined } from "@ant-design/icons";
import { GroupIcon } from "../components/CustomIcons";

import UserSearch from "../pages/user/UserSearch";
import UserAdd from "../pages/user/UserAdd";
import UserEdit from "../pages/user/UserEdit";
import { permissionList } from "../shared/constants";
import GroupsAndPermissions from "../pages/user/GroupsAndPermissions";
import AdminScopeUser from "../pages/user/AdminScopeUser";

const { SISEC } = permissionList;

export const UserRoutes = {
  userSearch: {
    path: "/Usuarios",
    Component: UserSearch,
    Permissions: [SISEC],
  },
  userAdd: {
    path: "/Usuarios/Agregar",
    Component: UserAdd,
    Permissions: [SISEC],
  },
  userEdit: {
    path: "/Usuarios/Editar/:username",
    Component: UserEdit,
    Permissions: [SISEC],
  },
  userGroupsAndPermissions: {
    path: "/Usuarios/GruposYPermisos",
    Component: GroupsAndPermissions,
    Permissions: [SISEC],
  },
  userAdminScope: {
    path: "/Usuarios/AdministradorAlcance",
    Component: AdminScopeUser,
    Permissions: [SISEC],
  },

};

export const UserSubmenus = {
  user: {
    path: "/Usuarios",
    name: "Lista Usuarios",
    Icon: UnorderedListOutlined,
    Permissions: UserRoutes.userSearch.Permissions,
  },
  userAdd: {
    path: "/Usuarios/Agregar",
    name: "Agregar Usuario",
    Icon: UserAddOutlined,
    Permissions: UserRoutes.userAdd.Permissions,
  },
  userGroupsAndPermissions: {
    path: "/Usuarios/GruposYPermisos",
    name: "Grupos y Permisos",
    Icon: UserAddOutlined,
    Permissions: UserRoutes.userGroupsAndPermissions.Permissions,
  },
  userAdminScope: {
    path: "/Usuarios/AdministradorAlcance",
    name: "Administrador Alcance",
    Icon: UserAddOutlined,
    Permissions: UserRoutes.userAdminScope.Permissions,
  },
};

export const UserMenus = {
  user: {
    name: "Usuarios",
    Icon: GroupIcon,
    submenus: Object.values(UserSubmenus),
  },
};
