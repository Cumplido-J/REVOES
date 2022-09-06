import {
  PlusCircleOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import ApplicantsSearch from "../pages/applicants/search/ApplicantsSearch";
import { permissionList } from "../shared/constants";
import ApplicantsAdd from "../pages/applicants/add/ApplicantsAdd";
import ApplicantsEdit from "../pages/applicants/edit/ApplicantsEdit";
import PromoteApplicantsToStudent from "../pages/applicants/promote/PromoteApplicantsToStudent";
const {
  VER_ASPIRANTES,
  REGISTRAR_ASPIRANTES,
  EDITAR_ASPIRANTES,
  PROMOVER_ASPIRANTES,
} = permissionList;

export const ApplicantsRoutes = {
  applicantsSearch: {
    path: "/Aspirantes",
    Component: ApplicantsSearch,
    Permissions: [VER_ASPIRANTES],
  },
  addApplicants: {
    path: "/Aspirantes/Registrar",
    Component: ApplicantsAdd,
    Permissions: [REGISTRAR_ASPIRANTES],
  },
  editApplicants: {
    path: "/Aspirantes/Registrar/:applicantId",
    Component: ApplicantsEdit,
    Permissions: [EDITAR_ASPIRANTES],
  },
  promoteApplicant: {
    path: "/Aspirantes/Promover/:applicantId",
    Component: PromoteApplicantsToStudent,
    Permissions: [PROMOVER_ASPIRANTES],
  },
};
export const ApplicantsSubmenus = {
  applicants: {
    path: ApplicantsRoutes.applicantsSearch.path,
    name: "Aspirantes",
    Icon: UnorderedListOutlined,
    Permissions: ApplicantsRoutes.applicantsSearch.Permissions,
  },
  addApplicant: {
    path: ApplicantsRoutes.addApplicants.path,
    name: "Registrar aspirante",
    Icon: PlusCircleOutlined,
    Permissions: ApplicantsRoutes.addApplicants.Permissions,
  },
};
export const ApplicantsMenus = {
  applicants: {
    name: "Aspirantes",
    Icon: TeamOutlined,
    submenus: Object.values(ApplicantsSubmenus),
  },
};
