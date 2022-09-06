import React from "react";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";
import Table from "../addIntersemestral/Table";
import TableStudents from "../addIntersemestral/TableStudents";
import TablePreview from "../addIntersemestral/TablePreview";
import { useSelector } from "react-redux";

import Filters from "../addIntersemestral/Filters";

const breadCrumbLinks = [
  {
    text: "Evaluaciones especiales",
    path: "/Recursamientos"
  },
  {
    text: "Agregar",
    path: false
  }
];

export default () => {
  const curseType = useSelector((store) => store.intersemestralReducer.curseTypeSelected);
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Agregar Evaluacion especial</TitleBar>
      <Filters />
      {
        curseType >= 1 ? (
          <>
            <Table />
            <TableStudents />
            <TablePreview />
          </>
        ) : null
      }
    </>
  );
};
