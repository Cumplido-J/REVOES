import React from "react";
import Filters from "./Filters";
import Table from "./Table";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import GroupsPeriodsSearchReports from "./GroupPeriodsSearchReports/GroupsPeriodsSearchReports";

const breadCrumbLinks = [
  {
    text: "Grupos-Periodos",
    path: false,
  },
];
export default () => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Grupos-Periodos</TitleBar>
      <Filters />
      <GroupsPeriodsSearchReports />
      <Table />
    </>
  );
};
