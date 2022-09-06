import React from "react";
import GroupAddEditForm from "../AddEditForm";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";

const breadCrumbLinks = [
  {
    text: "Grupos",
    path: "/Grupos"
  },
  {
    text: "Agregar",
    path: false
  }
];

export default () => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
			<TitleBar>Agregar Grupo</TitleBar>
      <GroupAddEditForm />
    </>
  );
};
