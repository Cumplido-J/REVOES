import React, { useEffect } from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import Table from "./Table";

const breadCrumbLinks = [
  {
    text: "Grupos-Periodos",
    path: "/Grupos-Periodos",
  },
  {
    text: "Inscribir alumnos",
    path: false,
  },
];
export default ({ match }) => {
  const { groupPeriodId } = match.params;

  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Inscribir alumnos</TitleBar>
      <Table groupPeriodId={groupPeriodId} />
    </>
  );
};
