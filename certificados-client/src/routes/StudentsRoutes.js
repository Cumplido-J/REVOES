import {
  UserOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";

import StudentSearch from "../pages/students/studentSearch/StudentSearch";
import StudentsAdd from "../pages/students/studentsAdd/StudentsAdd";
import StudentsEdit from "../pages/students/studentsEdit/StudentsEdit";
import { permissionList } from "../shared/constants";
import StudentToGraduate from "../pages/students/studentToGraduate/StudentToGraduate";
import StudentDetailsPage from "../pages/students/StudentDetails/StudentDetailsPage";

const { REGISTRAR_ALUMNOS, SINCRONIZAR_CALIFICACIONES_PARA_CERTIFICADOS } =
  permissionList;

export const StudentsRoutes = {
  studentSearch: {
    path: "/Estudiantes",
    Component: StudentSearch,
    Permissions: [REGISTRAR_ALUMNOS],
  },
  studentAdd: {
    path: "/Estudiantes/Inscribir",
    Component: StudentsAdd,
    Permissions: [REGISTRAR_ALUMNOS],
  },
  studentsToGraduate: {
    path: "/Estudiantes/Por-Egresar",
    Component: StudentToGraduate,
    Permissions: [SINCRONIZAR_CALIFICACIONES_PARA_CERTIFICADOS],
  },
  studentEdit: {
    path: "/Estudiantes/:curp",
    Component: StudentsEdit,
    Permissions: [REGISTRAR_ALUMNOS],
  },
  studentDetails: {
    path: "/Estudiantes/Detalles/:curp",
    Component: StudentDetailsPage,
    Permissions: [],
  },
};

export const StudentsSubmenus = {
  studentsSearch: {
    path: StudentsRoutes.studentSearch.path,
    name: "Alumnos",
    Icon: UnorderedListOutlined,
    Permissions: StudentsRoutes.studentSearch.Permissions,
  },
  studentsAdd: {
    path: StudentsRoutes.studentAdd.path,
    name: "Inscribir alumno",
    Icon: PlusCircleOutlined,
    Permissions: StudentsRoutes.studentAdd.Permissions,
  },
  studentsToGraduate: {
    path: StudentsRoutes.studentsToGraduate.path,
    name: "Alumnos por egresar",
    Icon: FlagOutlined,
    Permissions: StudentsRoutes.studentsToGraduate.Permissions,
  },
};

export const StudentsMenu = {
  groups: {
    name: "Alumnos inscritos",
    Icon: UserOutlined,
    submenus: Object.values(StudentsSubmenus),
  },
};
