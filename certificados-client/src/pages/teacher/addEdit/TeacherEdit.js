import React from "react";
import TeacherAddEditForm from "./AddEditForm";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";

const breadCrumbLinks = [
  {
    text: "Docentes",
    path: "/Docentes",
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
      <TitleBar>Editar Docente</TitleBar>
      <TeacherAddEditForm teacherId={match.params.teacherId} />
    </>
  );
};
