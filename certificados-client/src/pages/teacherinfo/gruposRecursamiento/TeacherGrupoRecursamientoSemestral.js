import React from "react";

import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import TableAsignaciones from "./CapturaCalificacionesSemestral";

export default ({ match }) => {
  const breadCrumbLinks = [
    {
      text: "Asignaciones",
      path: "/Docente/Asignaciones",
    },
    {
      text: "Recursamiento Semestral",
      path: false,
    },
  ];

  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Captura De Calificaciones De Recursamiento Semestral</TitleBar>
      <TableAsignaciones teacherSubjectId={match.params.groupId} />
    </>
  );
};
