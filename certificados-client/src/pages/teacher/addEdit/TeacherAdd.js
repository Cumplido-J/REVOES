import React from "react";
import TeacherAddEditForm from "./AddEditForm";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";

const breadCrumbLinks = [
  {
    text: "Docentes",
    path: "/Docentes"
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
			<TitleBar>Agregar Docente</TitleBar>
      <TeacherAddEditForm />
    </>
  );
};
