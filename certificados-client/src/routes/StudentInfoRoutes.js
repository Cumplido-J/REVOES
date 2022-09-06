import { UserOutlined, PlusCircleOutlined } from "@ant-design/icons";
import StudentInfo from "../pages/studentinfo/StudentInfo";
import { permissionList } from "../shared/constants";

const { SISEC, ACTUALIZAR_DATOS } = permissionList;

export const StudentInfoRoutes = {
  studentInfo: {
    path: "/ActualizarDatos",
    Component: StudentInfo,
    Permissions: [ACTUALIZAR_DATOS],
  },
};

export const StudentInfoSubmenus = {
  studentInfo: {
    path: "/ActualizarDatos",
    name: "Actualizar datos",
    Icon: PlusCircleOutlined,
    Permissions: StudentInfoRoutes.studentInfo.Permissions,
  },
};

export const StudentInfoMenus = {
  studentInfo: {
    name: "Datos generales",
    Icon: UserOutlined,
    submenus: Object.values(StudentInfoSubmenus),
  },
};
