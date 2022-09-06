import {
  UserOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";

import StudentSearch from "../pages/student/StudentSearch";
import StudentAdd from "../pages/student/StudentAdd";
import StudentEdit from "../pages/student/StudentEdit";
import StudentFormat from "../pages/student/StudentFormat";
import studentMasiveLoad from "../pages/student/StudentMasiveLoad/StudentMasiveLoad";
import studentMasiveLoadGraduates from "../pages/student/StudentMasiveLoadGraduates/StudentMasiveLoadGraduates";
import { permissionList } from "../shared/constants";

const { LISTA_DE_ALUMNOS, AGREGAR_ALUMNO, DESCARGA_DE_FORMATOS, CARGA_MASIVA, CARGA_MASIVA_6TO} = permissionList;

export const StudentRoutes = {
  studentSearch: {
    path: "/Alumnos",
    Component: StudentSearch,
    Permissions: [LISTA_DE_ALUMNOS],
  },
  studentAdd: {
    path: "/Alumnos/Agregar",
    Component: StudentAdd,
    Permissions: [AGREGAR_ALUMNO],
  },
  studentEdit: {
    path: "/Alumnos/Editar/:curp",
    Component: StudentEdit,
    Permissions: [AGREGAR_ALUMNO],
  },
  studentMasiveLoadGraduates: {
    path: "/Alumnos/CargaMasivaGraduados",
    Component: studentMasiveLoadGraduates,
    Permissions:  [CARGA_MASIVA_6TO],
  },
  studentFormat: {
    path: "/Alumnos/DescargaFormatos",
    Component: StudentFormat,
    Permissions: [DESCARGA_DE_FORMATOS],
  },
  studentMasiveLoad: {
    path: "/Alumnos/CargaMasiva",
    Component: studentMasiveLoad,
    Permissions:  [CARGA_MASIVA],
  },

};

export const StudentSubmenus = {
  student: {
    path: "/Alumnos",
    name: "Lista Alumnos",
    Icon: UnorderedListOutlined,
    Permissions: StudentRoutes.studentSearch.Permissions,
  },
  studentAdd: {
    path: "/Alumnos/Agregar",
    name: "Agregar Alumno",
    Icon: PlusCircleOutlined,
    Permissions: StudentRoutes.studentAdd.Permissions,
  },
  studentMasiveLoadGraduates: {
    path: "/Alumnos/CargaMasivaGraduados",
    name: "Carga 6to. semestre",
    Icon: PlusCircleOutlined,
    Permissions: StudentRoutes.studentMasiveLoadGraduates.Permissions,
  },
  studentFormat: {
    path: "/Alumnos/DescargaFormatos",
    name: "Descarga de formato",
    Icon: CloudDownloadOutlined,
    Permissions: StudentRoutes.studentFormat.Permissions,
  },
  studentMasiveLoad: {
    path: "/Alumnos/CargaMasiva",
    name: "Carga CTE",
    Icon: PlusCircleOutlined,
    Permissions: StudentRoutes.studentMasiveLoad.Permissions,
  }
};

export const StudentMenus = {
  student: {
    name: "Alumnos",
    Icon: UserOutlined,
    submenus: Object.values(StudentSubmenus),
  },
};
