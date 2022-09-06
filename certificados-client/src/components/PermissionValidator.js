import React from "react";
import { useSelector } from "react-redux";
/*
 * PermissionValidator
 * Este componente valida si el usuario tiene los permisos suficientes para hacer render a children.
 * @param {Object} props
 * @param {HTML} props.children
 * @param {array} props.permissions Lista de permisos a validar
 * @param {array} props.allPermissions Si esta en falso se valida que almenos un permiso se cumpla, si es verdadero todos los permisos se deben cumplir. 
 * @param {array} props.permissions
 * @returns {Object} React hook component
 * */
export default ({children, permissions, allPermissions = true}) => {
  const currentPermissions = useSelector(
    (store) => store.permissionsReducer.permissions
  );
  if (allPermissions) {
    return (
      <>
        {
          permissions.every(p => currentPermissions.includes(p)) &&
          children
        }
      </>
    );
  } else {
      return (
        <>
          {
            permissions.some(p => currentPermissions.includes(p)) &&
            children
          }
        </>
      );
  }
};
