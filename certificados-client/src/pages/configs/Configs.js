import React from "react";
import BreadCrumb from "../../components/BreadCrumb";
import TitleBar from "../../components/TitleBar";
import UpdatePassword from "./UpdatePassword/UpdatePassword";
import { permissionList } from "../../shared/constants";
import PermissionValidator from "../../components/PermissionValidator";
const Configs = () => {
  const breadCrumbLinks = [
    {
      text: "Configuraciones",
      path: false,
    },
  ];
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Configuraciones</TitleBar>
      <PermissionValidator permissions={[permissionList.CAMBIAR_CONTRASENA]}>
        <UpdatePassword />
      </PermissionValidator>
    </>
  );
};
export default Configs;
