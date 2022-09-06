import {UnorderedListOutlined,TagsOutlined } from "@ant-design/icons";
import CareerSearch from "../pages/career/CareerSearch";
import CareerModuleEdit from "../pages/career/CareerModuleEdit";
import CompetenceIndex from "../pages/career/CompetenceIndex";
import { permissionList } from "../shared/constants";
  
  const {
    SISEC,
    LISTA_CARRERAS,
    AGREGAR_CARRERAS,
    LISTA_COMPETENCIAS,
  } = permissionList;
  
  export const CareerRoutes = {
    careerSearch: {
      path: "/Carreras",
      Component: CareerSearch,
      Permissions: [LISTA_CARRERAS],
    },
    careerModuleEdit: {
      path: "/Carreras/EditarModule/:id/:career",
      Component: CareerModuleEdit,
      Permissions: [AGREGAR_CARRERAS],
    },
    competenceSearch: {
      path: "/Competencias",
      Component: CompetenceIndex,
      Permissions: [LISTA_COMPETENCIAS],
    },     
  };
  
  export const CareerSubmenus = {
    career: {
      path: "/Carreras",
      name: "Lista carreras",
      Icon: UnorderedListOutlined,
      Permissions: CareerRoutes.careerSearch.Permissions,
    },
    competenceSearch:{
      path: "/Competencias",
      name: "Lista competencias",
      Icon: UnorderedListOutlined,
      Permissions: CareerRoutes.competenceSearch.Permissions,    
    }
  };
  
  export const CareerMenus = {
    school: {
      name: "Carreras",
      Icon: TagsOutlined,
      submenus: Object.values(CareerSubmenus),
    },
  };
  