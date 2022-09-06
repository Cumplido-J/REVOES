import React from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import StudentDetails from "./StudentDetails";

const breadCrumbLinks = [
  {
    text: "Alumnos",
    path: "/Estudiantes",
  },
  {
    text: "Información del alumno",
    path: false,
  },
];
const StudentDetailsPage = ({ match }) => {
  const { curp } = match.params;
  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Información del alumno</TitleBar>
      <StudentDetails curp={curp} />
    </>
  );
};
export default StudentDetailsPage;
