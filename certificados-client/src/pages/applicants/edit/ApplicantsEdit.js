import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import ApplicantsAddEditViewForm from "../components/ApplicantsAddEditViewForm/ApplicantsAddEditViewForm";

const ApplicantsAdd = ({ match }) => {
  const breadCrumbLinks = [
    {
      text: "Aspirantes",
      path: "/Aspirantes",
    },
    {
      text: "Editar aspirante",
      path: "/Aspirantes/Editar",
    },
  ];
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Editar aspirante</TitleBar>
      <ApplicantsAddEditViewForm applicantId={match?.params?.applicantId} />
    </>
  );
};

export default ApplicantsAdd;
