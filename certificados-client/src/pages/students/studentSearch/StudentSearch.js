import React from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import Filters from "./Filters";
import Table from "./Table";
// import StudentReportModal from "./StudentReportModal/StudentReportModal";
/*
 * Group search main component
 * */
const breadCrumbLinks = [
  {
    text: "Alumnos",
    path: false,
  },
];
export default () => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Alumnos</TitleBar>
      <Filters />
      {/*<StudentReportModal />*/}
      <Table />
    </>
  );
};
