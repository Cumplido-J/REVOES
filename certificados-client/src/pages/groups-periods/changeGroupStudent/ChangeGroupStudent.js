import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import Table from "./Table";

const breadCrumbLinks = [
  {
    text: "Grupos-Periodos",
    path: "/Grupos-Periodos",
  },
  {
    text: "Cambiar alumno de grupo",
    path: false,
  },
];

export default ({ match }) => {
  const { groupPeriodId } = match.params;
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Cambiar alumno de grupo</TitleBar>
      <Table groupPeriodId={groupPeriodId} />
    </>
  );
};
