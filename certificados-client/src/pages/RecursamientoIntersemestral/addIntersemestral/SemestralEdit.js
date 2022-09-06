import React from "react";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";
import Table from "../addIntersemestral/Table";
import TableStudents from "../addIntersemestral/TableStudents";
import TablePreview from "../addIntersemestral/TablePreview";

import Filters from "../addIntersemestral/Filters"

const breadCrumbLinks = [
  {
    text: "Evaluaciones especiales",
    path: "/Recursamientos"
  },
  {
    text: "Editar",
    path: false
  }
];

export default ({match}) => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
			<TitleBar>Editar Recursamiento Semestral</TitleBar>
      <Filters intersemestralId={match.params.intersemestralId} tipoRecursamiento="semestral" tipoRecursamientoNumber={1} />
      {/* <Table /> */}
      <TableStudents isEditing={true} tipoRecursamiento="semestral" />
      <TablePreview />
    </>
  );
};
