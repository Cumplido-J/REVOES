import {
  RobotOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import TeacherSearch from "../pages/teacher/search/TeachersSearch";
import TeacherAdd from "../pages/teacher/addEdit/TeacherAdd";
import Asignatura from "../pages/teacher/asignaturas/Asignatura";
import AsignaturasRecursamientoIntersemestral from "../pages/teacher/asignaturas/AsignaturaRecursamientoIntersemestral"
import AsignaturasRecursamientoSemestral from "../pages/teacher/asignaturas/AsignaturaRecursamientoSemestral";
import AsignaturaExamenExtraordinario from "../pages/teacher/asignaturas/AsignaturaExamenExtraordinario"
import TeacherEdit from "../pages/teacher/addEdit/TeacherEdit";
import { permissionList } from "../shared/constants";

const {
  BUSCAR_DOCENTE,
  EDITAR_DOCENTE,
  CREAR_DOCENTE,
  VER_DETALLES_DE_ASIGNATURA,
  VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL
} = permissionList;

export const TeacherRoutes = {
  teacherSearch: {
    path: "/Docentes",
    Component: TeacherSearch,
    Permissions: [BUSCAR_DOCENTE],
  },
  teacherAdd: {
    path: "/Docentes/Agregar",
    Component: TeacherAdd,
    Permissions: [CREAR_DOCENTE],
  },
  teacherEdit: {
    path: "/Docentes/Editar/:teacherId",
    Component: TeacherEdit,
    Permissions: [EDITAR_DOCENTE],
  },
  asignatura: {
    path: "/Docentes/Asignatura/:docenteAsignaturaId",
    Component: Asignatura,
    Permissions: [VER_DETALLES_DE_ASIGNATURA],
  },
  asignaturaRecursamientoIntersemestral: {
    path: "/Docentes/Asignatura-Recursamiento-Intersemestral/:docenteAsignaturaId",
    Component: AsignaturasRecursamientoIntersemestral,
    Permissions: [VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL],
  },
  asignaturaRecursamientoSemestral: {
    path: "/Docentes/Asignatura-Recursamiento-Semestral/:docenteAsignaturaId",
    Component: AsignaturasRecursamientoSemestral,
    Permissions: [VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL],
  },
  asignaturaExamenExtraordinario: {
    path: "/Docentes/Examen-Extraordinario/:docenteAsignaturaId",
    Component: AsignaturaExamenExtraordinario,
    Permissions: [VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL],
  },
};

export const TeacherSubmenus = {
  teacher: {
    path: "/Docentes",
    name: "Lista Docentes",
    Icon: UnorderedListOutlined,
    Permissions: TeacherRoutes.teacherSearch.Permissions,
  },
  teacherAdd: {
    path: "/Docentes/Agregar",
    name: "Agregar Docente",
    Icon: PlusCircleOutlined,
    Permissions: TeacherRoutes.teacherAdd.Permissions,
  },
};

export const TeacherMenus = {
  teacher: {
    name: "Docentes",
    Icon: RobotOutlined,
    submenus: Object.values(TeacherSubmenus),
  },
};
