import React from "react";

import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import TableAsignaciones from "./TableGroup";

export default ({ match }) => {
  const breadCrumbLinks = [
    {
      text: "Asignaciones",
      path: "/Docente/Asignaciones",
    },
    {
      text: "Captura",
      path: false,
    },
  ];

  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Captura De Calificaciones</TitleBar>
      <TableAsignaciones teacherSubjectId={match.params.groupId} />
    </>
  );
};
