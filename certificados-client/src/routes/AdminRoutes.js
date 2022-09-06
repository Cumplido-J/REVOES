import { UnorderedListOutlined, ToolOutlined } from "@ant-design/icons";
import PersonaList from "../pages/people/PersonaList";
import PersonaEdit from "../pages/people/PersonaEdit";
import Admin from "../pages/admin/Admin";
import { permissionList } from "../shared/constants";
const { SISEC,LISTA_FIRMANTE,AGREGAR_PERSONA } = permissionList;

export const AdminRoutes = {
  admin: {
    path: "/Admin",
    Component: Admin,
    Permissions: [SISEC],
  },
  personaList: {
    path: "/Firmantes",
    Component: PersonaList,
    Permissions: [LISTA_FIRMANTE],
  },
  personaEdit: {
    path: "/Persona/Editar/:curp", 
    Component: PersonaEdit, 
    Permissions: [AGREGAR_PERSONA],
  },  
};

export const AdminSubmenus = {
  admin: {
    path: "/Admin",
    name: "Funciones administrador",
    Icon: UnorderedListOutlined,
    Permissions: AdminRoutes.admin.Permissions,
  },
  firmante: {
    path: "/Firmantes",
    name: "Firmante titulacion",
    Icon: UnorderedListOutlined,
    Permissions: AdminRoutes.personaList.Permissions,
  },  
};

export const AdminMenus = {
  admin: {
    name: "Admin",
    Icon: ToolOutlined,
    submenus: Object.values(AdminSubmenus),
  },
};
