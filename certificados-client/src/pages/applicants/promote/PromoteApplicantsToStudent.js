import React from "react";
import Breadcrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import StudentsAddEditUpgradeForm from "../../students/studentsAddEditUpgradeForm/StudentsAddEditUpgradeForm";
/*
 * Group search main component
 * */
const breadCrumbLinks = [
  {
    text: "Aspirantes",
    path: "/Aspirantes",
  },
  {
    text: "Prmover aspirante a alumno",
    path: false,
  },
];
export default ({ match }) => {
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Promover aspirantes a alumno</TitleBar>
      <StudentsAddEditUpgradeForm applicantId={match.params.applicantId} />
    </>
  );
};
