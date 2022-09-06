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
			<TitleBar>Editar Exámen Extraordinario</TitleBar>
      <Filters intersemestralId={match.params.intersemestralId} tipoRecursamiento="extraordinario" tipoRecursamientoNumber={3} />
      {/* <Table /> */}
      <TableStudents isEditing={true} tipoRecursamiento="extraordinario" />
      <TablePreview />
    </>
  );
};
