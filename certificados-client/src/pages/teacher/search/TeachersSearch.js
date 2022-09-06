import React, { useEffect } from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import Table from "./Table";

import Filters from "./Filters";
/*
 * Group search main component
 * */
const breadCrumbLinks = [
  {
    text: "Docentes",
    path: false,
  },
];
export default () => {
  useEffect(() => {}, []);
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Docentes</TitleBar>
      <Filters />
      <Table />
    </>
  );
};
