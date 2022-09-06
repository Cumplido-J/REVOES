import {
  RobotOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import TeacherAssignment from "../pages/teacherinfo/asignacion/TeacherAsignacion";
import TeacherGroup from "../pages/teacherinfo/groups/TeacherGroups";
import TeacherGrupoRecursamiento from "../pages/teacherinfo/gruposRecursamiento/TeacherGrupoRecursamiento";
import TeacherGrupoRecursamientoSemestral from "../pages/teacherinfo/gruposRecursamiento/TeacherGrupoRecursamientoSemestral";
import { permissionList } from "../shared/constants";

const { VER_MIS_ASIGNACIONES, CARGAR_CALIFICACIONES_DOCENTE, CARGAR_CALIFICACIONES_RECURSAMIENTO_INTERSEMESTRAL } = permissionList;

export const TeacherAssignmentRoutes = {
  teacherAssignment: {
    path: "/Docente/Asignaciones",
    Component: TeacherAssignment,
    Permissions: [VER_MIS_ASIGNACIONES],
  },
  teacherGroups: {
    path: "/Docente/Asignaciones/Grupo/:groupId",
    Component: TeacherGroup,
    Permissions: [VER_MIS_ASIGNACIONES, CARGAR_CALIFICACIONES_DOCENTE],
  },
  teacherGroupsRecursamiento: {
    path: "/Docente/Asignaciones/Grupo-Recursamiento-Intersemestral/:groupId",
    Component: TeacherGrupoRecursamiento,
    Permissions: [VER_MIS_ASIGNACIONES, CARGAR_CALIFICACIONES_RECURSAMIENTO_INTERSEMESTRAL],
  },
  teacherGroupsRecursamientoSemestral: {
    path: "/Docente/Asignaciones/Grupo-Recursamiento-Semestral/:groupId",
    Component: TeacherGrupoRecursamientoSemestral,
    Permissions: [VER_MIS_ASIGNACIONES, CARGAR_CALIFICACIONES_RECURSAMIENTO_INTERSEMESTRAL],
  },
};

export const TeacherAssignmentSubmenus = {
  teacherAssignment: {
    path: TeacherAssignmentRoutes.teacherAssignment.path,
    name: "Lista De Asignaciones",
    Icon: UnorderedListOutlined,
    Permissions: TeacherAssignmentRoutes.teacherAssignment.Permissions,
  },
};

export const TeacherAssignmentMenus = {
  teacherAssignment: {
    name: "Asignaciones",
    Icon: RobotOutlined,
    submenus: Object.values(TeacherAssignmentSubmenus),
  },
};
