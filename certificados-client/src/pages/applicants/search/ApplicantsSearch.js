import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import ApplicantsSearchFilter from "./ApplicantsSearchFilter";
import ApplicantsSearchTable from "./ApplicantsSearchTable";
import ApplicantsSearchReportsModal from "./ApplicantsSearchReportsModal";
const breadCrumbLinks = [
  {
    text: "Aspirantes",
    path: false,
  },
];

const ApplicantsSearch = () => {
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Aspirantes</TitleBar>
      <ApplicantsSearchFilter />
      <ApplicantsSearchReportsModal />
      <ApplicantsSearchTable />
    </>
  );
};

export default ApplicantsSearch;
