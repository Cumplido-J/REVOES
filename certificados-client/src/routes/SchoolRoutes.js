import {
  UnorderedListOutlined,
  BankOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import SchoolSearch from "../pages/school/SchoolSearch";
import StateSearch from "../pages/school/StateSearch";
import SchoolAdd from "../pages/school/SchoolAdd";
import SchoolEdit from "../pages/school/SchoolEdit";
import SchoolUpdate from "../pages/school/SchoolUpdate";
import EvaluationSettings from "../pages/school/evaluationSettings/EvaluationSettings";
import { permissionList } from "../shared/constants";

import SchoolEquivalentHome from "../pages/schoolEquivalent/SchoolEquivalentHome";
import SchoolEquivalentAdd from "../pages/schoolEquivalent/SchoolEquivalentAdd";
import SchoolEquivalentEdit from "../pages/schoolEquivalent/SchoolEquivalentEdit";
const {
  SISEC,
  LISTA_PLANTELES,
  CONFIGURACION_DE_EVALUACIONES,
  AGREGAR_PLANTELES,
  LISTA_PLANTELES_EQUIVALENTE,
  CONFIG_FECHAS_INICIO_FIN_PERIODO_POR_ESTADO
} = permissionList;

export const SchoolRoutes = {
  schoolSearch: {
    path: "/Planteles",
    Component: SchoolSearch,
    Permissions: [LISTA_PLANTELES],
  },
  stateSearch: {
    path: "/Estados",
    Component: StateSearch,
    Permissions: [CONFIG_FECHAS_INICIO_FIN_PERIODO_POR_ESTADO],
  },
  schoolAdd: {
    path: "/Planteles/Agregar",
    Component: SchoolAdd,
    Permissions: [AGREGAR_PLANTELES],
  },
  schoolEdit: {
    path: "/Planteles/Editar/:cct",
    Component: SchoolEdit,
    Permissions: [AGREGAR_PLANTELES],
  },
  schoolEvaluationSettings: {
    path: "/Planteles/Evaluaciones/:cct",
    Component: EvaluationSettings,
    Permissions: [CONFIGURACION_DE_EVALUACIONES],
  },
  schoolUpdate: {
    path: "/Planteles/MoverAlumnos/:schoolcareerId/:cct/:id",
    Component: SchoolUpdate,
    Permissions: [AGREGAR_PLANTELES],
  },  
  schoolEquivalentHome: {
    path: "/PlantelesEquivalentes",
    Component: SchoolEquivalentHome,
    Permissions: [LISTA_PLANTELES_EQUIVALENTE],
  },
  SchoolEquivalentAdd: {
    path: "/PlantelesEquivalentes/Add/:schoolId/:stateId",
    Component: SchoolEquivalentAdd,
    Permissions: [LISTA_PLANTELES_EQUIVALENTE],
  },
  SchoolEquivalentEdit: {
    path: "/PlantelesEquivalentes/Edit/:cct/:schoolId/:stateId",
    Component: SchoolEquivalentEdit,
    Permissions: [LISTA_PLANTELES_EQUIVALENTE],
  }
};

export const SchoolSubmenus = {
  school: {
    path: "/Planteles",
    name: "Lista Planteles",
    Icon: UnorderedListOutlined,
    Permissions: SchoolRoutes.schoolSearch.Permissions,
  },
  state: {
    path: "/Estados",
    name: "Lista Colegios",
    Icon: UnorderedListOutlined,
    Permissions: SchoolRoutes.stateSearch.Permissions,
  },
  schoolAdd: {
    path: "/Planteles/Agregar",
    name: "Agregar Plantel",
    Icon: PlusCircleOutlined,
    Permissions: SchoolRoutes.schoolAdd.Permissions,
  },
  schoolEquivalentHome: {
    path: "/PlantelesEquivalentes",
    name: "Planteles Equivalentes",
    Icon: UnorderedListOutlined,
    Permissions: SchoolRoutes.schoolEquivalentHome.Permissions,
  },
};

export const SchoolMenus = {
  school: {
    name: "Planteles",
    Icon: BankOutlined,
    submenus: Object.values(SchoolSubmenus),
  },
};