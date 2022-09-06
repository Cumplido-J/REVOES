import React from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import StudentsAddEditUpgradeForm from "../studentsAddEditUpgradeForm/StudentsAddEditUpgradeForm";
/*
 * Group search main component
 * */
const breadCrumbLinks = [
  {
    text: "Alumnos",
    path: "/Estudiantes",
  },
  {
    text: "Inscribir Alumno",
    path: false,
  },
];
export default () => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Inscribir alumno</TitleBar>
      <StudentsAddEditUpgradeForm />
    </>
  );
};
