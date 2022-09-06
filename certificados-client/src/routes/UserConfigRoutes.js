import Configs from "../pages/configs/Configs";
import { permissionList } from "../shared/constants";

export const UserConfigsRoutes = {
  userConfig: {
    path: "/configuraciones",
    Component: Configs,
    Permissions: [permissionList.CAMBIAR_CONTRASENA],
  },
};

export const UserConfigsSubMenus = {};

export const UserConfigMenus = {};
