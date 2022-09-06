import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import ApplicantsAddEditViewForm from "../components/ApplicantsAddEditViewForm/ApplicantsAddEditViewForm";

const ApplicantsAdd = () => {
  const breadCrumbLinks = [
    {
      text: "Aspirantes",
      path: "/Aspirantes",
    },
    {
      text: "Registrar aspirante",
      path: "/Aspirantes/Registrar",
    },
  ];
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Registrar aspirante</TitleBar>
      <ApplicantsAddEditViewForm />
    </>
  );
};

export default ApplicantsAdd;
