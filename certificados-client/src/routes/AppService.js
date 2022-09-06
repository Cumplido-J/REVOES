import store from "../reducers/reducers";
// ROUTES
import FolioRoutes from "./FolioRoutes";
import { StudentRoutes, StudentMenus } from "./StudentRoutes";
import { TeacherRoutes, TeacherMenus } from "./TeacherRoutes";
import {
  TeacherAssignmentRoutes,
  TeacherAssignmentMenus,
} from "./TeacherAssignmentRoutes";
import {
  RecursamientoIntersemestralRoutes,
  RecursamientoIntersemestralMenus,
} from "./RecursamientoIntersemestralRoutes";
import { GroupsRoutes, GroupsMenus } from "./GroupsRoutes";
import { GroupsPeriodsRoutes, GroupsPeriodMenus } from "./GroupsPeriodsRoutes";
import { ReportCardRoutes, ReportCardMenus } from "./ReportCardRoutes";
import { SchoolRoutes, SchoolMenus } from "./SchoolRoutes";
import { UserRoutes, UserMenus } from "./UserRoutes";
import { SurveyReportRoutes, SurveyReportMenus } from "./SurveyReportRoutes";
import { SurveyRoutes } from "./SurveyRoutes";
import { CertificateMenus, CertificateRoutes } from "./CertificateRoutes";

import { StudentInfoRoutes, StudentInfoMenus } from "./StudentInfoRoutes";
import { StudentsRoutes, StudentsMenu } from "./StudentsRoutes";

import { AdminRoutes, AdminMenus } from "./AdminRoutes";

import {
  CertifiedReportRoutes,
  CertifiedReportMenus,
} from "./CertifiedReportRoutes";
import { DegreeRoutes, DegreeMenus } from "./DegreeRoutes";

import { DgpRoutes, DgpMenus } from "./DgpRoutes";

import { SchoolEnrollmentRoutes, SchoolEnrollmentMenus } from "./SchoolEnrollmentReportsRoutes";

import { CareerRoutes, CareerMenus } from "./CareerRoutes";
import { UserConfigMenus, UserConfigsRoutes } from "./UserConfigRoutes";
import { ApplicantsMenus, ApplicantsRoutes } from "./ApplicantsRoutes";
import { DegreeReportMenus, DegreeReportRoutes } from "./DegreeReportRoutes";
// TODO: Actualizar los permisos de todas las rutas
const routes = [
  FolioRoutes,
  SurveyRoutes,
  StudentsRoutes,
  StudentRoutes,
  TeacherRoutes,
  TeacherAssignmentRoutes,
  RecursamientoIntersemestralRoutes,
  GroupsRoutes,
  GroupsPeriodsRoutes,
  ReportCardRoutes,
  SchoolRoutes,
  CareerRoutes,
  UserRoutes,
  SurveyReportRoutes,
  CertificateRoutes,
  StudentInfoRoutes,
  AdminRoutes,
  CertifiedReportRoutes,
  DegreeRoutes,
  DgpRoutes,
  SchoolEnrollmentRoutes,
  UserConfigsRoutes,
  ApplicantsRoutes,
  DegreeReportRoutes,
];

// TODO: Actualizar los permisos de los submenus
const menus = [
  ApplicantsMenus,
  StudentsMenu,
  StudentMenus,
  TeacherMenus,
  TeacherAssignmentMenus,
  RecursamientoIntersemestralMenus,
  GroupsMenus,
  GroupsPeriodMenus,
  ReportCardMenus,
  SchoolMenus,
  CareerMenus,
  UserMenus,
  SurveyReportMenus,
  CertificateMenus,
  StudentInfoMenus,
  AdminMenus,
  CertifiedReportMenus,
  DegreeMenus,
  DgpMenus,
  SchoolEnrollmentMenus,
  UserConfigMenus,
  DegreeReportMenus,
];

// Retorna las rutas disponibles
const getAvailableRoutes = () => {
  const state = store.getState(); // Obtiene el estado desde redux
  const { permissions } = state.permissionsReducer; // Obtiene los permisos desde redux
  const availableRoutes = []; // Rutas a retornar
  routes.forEach((routeGroup) => {
    routeGroup = Object.values(routeGroup);
    routeGroup.forEach((route) => {
      // Verifica que exista el objecto permissions
      if (route.Permissions && Array.isArray(route.Permissions)) {
        // Si el nodo permisos NO es un arreglo vacío, significa que no es necesario un permiso especial para entrar a la ruta.
        // Si el nodo de permisos SI tiene permisos asignados y el usuario cuenta con al menos un permiso del nodo permisos, la ruta se incluye.
        // Los permisos funcionan como una lista blanca, es importante validar cada acción (permiso) de manera individual dentro de la vista.
        if (
          !route.Permissions.length ||
          route.Permissions.some((permission) =>
            permissions.includes(permission)
          )
        ) {
          availableRoutes.push(route);
        }
      } else {
        console.error(
          "El objeto de ruta no tiene un nodo de permisos asignado",
          route
        );
      }
    });
  });
  return availableRoutes;
};

const getAvailableMenus = () => {
  const availableMenus = []; // Menus a retornar
  const state = store.getState(); // Obtiene el estado desde redux
  const { permissions } = state.permissionsReducer; // Obtiene los permisos desde redux
  menus.forEach((menuItemGroup) => {
    for (let key in menuItemGroup) {
      const menuItemDropdown = Object.assign({}, menuItemGroup[key]); // Se debe añadir Object.assign para evitar que se modifique el objeto original
      // Se filtran los submenus que pueden visualizarse
      menuItemDropdown.submenus = menuItemDropdown.submenus.filter(
        (submenuItem) => {
          if (
            submenuItem.Permissions &&
            Array.isArray(submenuItem.Permissions)
          ) {
            // Si el nodo permisos NO es un arreglo vacío, significa que no es necesario un permiso especial para mostrar el submenu.
            // Si el nodo de permisos SI tiene permisos asignados y el usuario cuenta con al menos un permiso del nodo permisos, el submenu se incluye.
            // Los permisos funcionan como una lista blanca.
            return (
              !submenuItem.Permissions.length ||
              submenuItem.Permissions.some((permission) =>
                permissions.includes(permission)
              )
            );
          } else {
            console.error(
              "El objeto de submenu no tiene un nodo de permisos asignado",
              submenuItem
            );
            return false;
          }
        }
      );
      // Si el menu (dropdown) aún tiene submenus en el arreglo de submenus despues del filtrado anterior es agregado al menu.
      menuItemDropdown.submenus.length && availableMenus.push(menuItemDropdown);
    }
  });
  return availableMenus;
};

export default {
  getAvailableRoutes,
  getAvailableMenus,
};
