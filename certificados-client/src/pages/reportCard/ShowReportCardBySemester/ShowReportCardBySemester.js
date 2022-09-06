import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import Form from "./Form";

const breadCrumbLinks = [
  {
    text: "Boletas por semestre",
    path: false,
  },
];

export default () => {
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Boletas por semestre</TitleBar>
      <Form />
    </>
  );
};
