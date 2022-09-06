import React from "react";

import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import TableCapturaRecursamiento from "./TableCapturaRecursamiento";

export default ({ match }) => {
  const breadCrumbLinks = [
    {
      text: "Asignaciones",
      path: "/Docente/Asignaciones",
    },
    {
      text: "Grupo Recursamiento",
      path: false,
    },
  ];

  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Grupo Recursamiento</TitleBar>
      <TableCapturaRecursamiento teacherSubjectId={match.params.groupId} />
    </>
  );
};
