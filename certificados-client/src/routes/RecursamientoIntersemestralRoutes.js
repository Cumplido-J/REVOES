import {
  RobotOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import RecursamientoSearch from "../pages/RecursamientoIntersemestral/search/RecursamientoSearch";
import IntersemestralAdd from "../pages/RecursamientoIntersemestral/addIntersemestral/IntersemestralAdd";
import { permissionList } from "../shared/constants";
import IntersemestralEdit from "../pages/RecursamientoIntersemestral/addIntersemestral/IntersemestralEdit";
import SemestralEdit from "../pages/RecursamientoIntersemestral/addIntersemestral/SemestralEdit";
import ExtraordinarioEdit from "../pages/RecursamientoIntersemestral/addIntersemestral/ExtraordinarioEdit";

const {
  VER_RECURSAMIENTOS,
  AGREGAR_RECURSAMIENTO_SEMESTRAL,
  EDITAR_RECURSAMIENTO_SEMESTRAL,
  VER_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL,
  AGREGAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL,
  EDITAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL
} = permissionList;

export const RecursamientoIntersemestralRoutes = {
  recursamientoSearch: {
    path: "/Recursamientos",
    Component: RecursamientoSearch,
    Permissions: [VER_RECURSAMIENTOS, VER_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL],
  },
  recursamientoAdd: {
    path: "/Recursamiento/Agregar",
    Component: IntersemestralAdd,
    Permissions: [AGREGAR_RECURSAMIENTO_SEMESTRAL, AGREGAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL],
  },
  recursamientoEdit: {
    path: "/Recursamiento-Intersemestral/Editar/:intersemestralId",
    Component: IntersemestralEdit,
    Permissions: [EDITAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL],
  },
  recursamientoSemestralEdit: {
    path: "/Recursamiento-Semestral/Editar/:intersemestralId",
    Component: SemestralEdit,
    Permissions: [EDITAR_RECURSAMIENTO_SEMESTRAL],
  },
  examenExtraordinarioEdit: {
    path: "/Examen-Extraordinario/Editar/:intersemestralId",
    Component: ExtraordinarioEdit,
    Permissions: [EDITAR_RECURSAMIENTO_SEMESTRAL],
  },
};

export const RecursamientoIntersemestralSubmenus = {
  recursamiento: {
    path: "/Recursamientos",
    name: "Lista De Evaluaciones Especiales",
    Icon: UnorderedListOutlined,
    Permissions: RecursamientoIntersemestralRoutes.recursamientoSearch.Permissions,
  },
  recursamientoAdd: {
    path: "/Recursamiento/Agregar",
    name: "Agregar Evaluaciones Especiales",
    Icon: PlusCircleOutlined,
    Permissions: RecursamientoIntersemestralRoutes.recursamientoAdd.Permissions,
  },
};

export const RecursamientoIntersemestralMenus = {
  teacher: {
    name: "Evaluaciones especiales",
    Icon: RobotOutlined,
    submenus: Object.values(RecursamientoIntersemestralSubmenus),
  },
};
