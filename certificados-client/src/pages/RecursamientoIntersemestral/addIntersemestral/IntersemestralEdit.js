import React from "react";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";
import Table from "../addIntersemestral/Table";
import TableStudents from "../addIntersemestral/TableStudents";
import TablePreview from "../addIntersemestral/TablePreview";

import Filters from "../addIntersemestral/Filters"

const breadCrumbLinks = [
  {
    text: "Recursamientos",
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
			<TitleBar>Editar Recursamiento Intersemestral</TitleBar>
      <Filters intersemestralId={match.params.intersemestralId} tipoRecursamiento="intersemestral" tipoRecursamientoNumber={2} />
      {/* <Table /> */}
      <TableStudents />
      <TablePreview />
    </>
  );
};
