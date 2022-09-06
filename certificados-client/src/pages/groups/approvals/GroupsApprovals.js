import React from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import useGetUnapprovals from "../../../hooks/groups/useGetUnapprovals";
import Filters from "./Filters";
import Table from "./Table";

const breadCrumbLinks = [
  {
    text: "Grupos",
    path: "/Grupos",
  },
  {
    text: "Aprobaciones",
    path: false,
  },
];

export default () => {
  const [loadingUnapprovals, unapprovals, getUnapprovals] = useGetUnapprovals();
  const handleSearch = (params) => {
    getUnapprovals(params);
  };
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Aprobación de grupos</TitleBar>
      <Filters onSearch={handleSearch} parentLoading={loadingUnapprovals} />
      <Table groups={unapprovals} loading={loadingUnapprovals} />
    </>
  );
};
