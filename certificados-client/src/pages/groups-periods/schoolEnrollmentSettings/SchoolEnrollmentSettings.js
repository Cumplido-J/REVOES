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
    text: "Configuración de inscripciones por plantel",
    path: false,
  },
];
export default () => {
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Configuración de inscripciones por plantel</TitleBar>
      <Form />
    </>
  );
};
