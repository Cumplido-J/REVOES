import React from "react";
import Form from "./Form";
import TitleBar from "../../../components/TitleBar";
import BreadCrumb from "../../../components/BreadCrumb";

const breadCrumbLinks = [
  {
    text: "Grupos-Periodos",
    path: "/Grupos-Periodos",
  },
  {
    text: "Configuración de inscripciones",
    path: false,
  },
];
export default ({ match }) => {
  const { groupPeriodsId } = match.params;
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Configuración de inscripciones</TitleBar>
      <Form groupPeriodsId={groupPeriodsId} />
    </>
  );
};
