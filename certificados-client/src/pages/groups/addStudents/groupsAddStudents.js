import React from "react";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";
import Table from "./Table";
import AddByCurp from "./AddByCurp";

const breadCrumbLinks = [
  {
    text: "Grupos",
    path: "/Grupos"
  },
  {
    text: "Agregar Estudiantes",
    path: false
  }
];

export default ({match}) => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
			<TitleBar>Agregar Estudiantes</TitleBar>
			<AddByCurp />
			<Table {...match.params}/>
    </>
  );
};
