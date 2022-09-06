import React from "react";
import GroupAddEditForm from "../AddEditForm";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";

const breadCrumbLinks = [
  {
    text: "Grupos",
    path: "/Grupos",
  },
  {
    text: "Editar",
    path: false,
  },
];

export default ({ match }) => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Editar Grupo</TitleBar>
      <GroupAddEditForm groupEditId={match.params.groupId} />
    </>
  );
};
