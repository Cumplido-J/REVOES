////Creado el 24 de Junio 
import {
    UnorderedListOutlined,
    BankOutlined,
    PlusCircleOutlined,
  } from "@ant-design/icons";
  
  import PersonaList from "../pages/people/PersonaList";
  import PersonaAdd from "../pages/people/PersonaAdd";
  import { permissionList } from "../shared/constants";
  
  const {
    SISEC,
    LISTA_PERSONA,
    AGREGAR_PERSONA,
  } = permissionList;
  
  export const PersonaRoutes = {
    personalist: {
        path: "/Persona",
        Component: PersonaList,
        Permissions: [LISTA_PERSONA],
      },   
    personaAdd: {
      path: "/Persona/Agregar",
      Component: PersonaAdd,
      Permissions: [AGREGAR_PERSONA],
    },   
    /*personaEdit: {
      path: "/Persona/Editar/:id",
      Component: personaEdit,
      Permissions: [AGREGAR_PERSONA],
    },*/
  };
  
  export const PersonaSubmenus = {
    persona: {
      path: "/Persona",
      name: "Lista persona",
      Icon: UnorderedListOutlined,
      Permissions: PersonaRoutes.personalist.Permissions,
    },
    personaAdd: {
      path: "/Persona/Agregar",
      name: "Agregar persona",
      Icon: PlusCircleOutlined,
      Permissions: PersonaRoutes.personaAdd.Permissions,
    },  
  };
  
  export const PersonaMenus = {
    persona: {
      name: "Personas",
      Icon: BankOutlined,
      submenus: Object.values(PersonaSubmenus),
    },
  };
  