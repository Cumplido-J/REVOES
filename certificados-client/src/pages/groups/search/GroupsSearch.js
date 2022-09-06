import React from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import Table from "./Table";
import Filters from "./Filters";
/*
 * Group search main component
 * */
const breadCrumbLinks = [
  {
    text: "Grupos",
    path: false,
  },
];
export default () => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Grupos</TitleBar>
      <Filters />
      <Table />
    </>
  );
};
