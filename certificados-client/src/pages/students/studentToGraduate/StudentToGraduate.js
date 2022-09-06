import { Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../components/BreadCrumb";
import TitleBar from "../../../components/TitleBar";
import { ButtonCustom } from "../../../shared/components";
import Filters from "./Filters";
import SearchTable from "./SearchTable";
import ValidateStudentForCertification from "./ValidateStudentForCertification";
import { CheckSquareOutlined } from "@ant-design/icons";

const breadCrumbLinks = [
  {
    text: "Alumnos",
    path: "/Estudiantes",
  },
  {
    text: "Alumnos por egresar",
    path: false,
  },
];
const StudentToGraduate = () => {
  const [studentsToGraduateList, setStudentsToGraduateList] = useState([]);
  const [stateSelected, setStateSelected] = useState([]);

  const handleOnSearch = (students) => {
    setStudentsToGraduateList(students);
  };

  /**
   * Se utiliza para el onchange, es una función que retorna a otra para que el onchange se pueda
   * reproducir con los parametros esperados.
   * @param {*} student
   * @param {*} index
   * @returns function
   * * @param {HTMLEvent} event
   * * @returns
   */
  const handleStudentSelect = (studentToggled) => (event) => {
    setStudentsToGraduateList(
      studentsToGraduateList.map((student) =>
        student.usuario_id === studentToggled.usuario_id
          ? {
              ...student,
              selected: event.target.checked,
            }
          : student
      )
    );
  };

  const handleOnSync = () => {
    setStudentsToGraduateList(
      studentsToGraduateList.filter((s) => !s.selected)
    );
  };

  const handleSetSelectionAll = (value) => {
    setStudentsToGraduateList(
      studentsToGraduateList.map((student) =>
        student.tipo_alumno === "Regular"
          ? {
              ...student,
              selected: value,
            }
          : student
      )
    );
  };

  return (
    <>
      <BreadCrumb links={breadCrumbLinks} />
      <TitleBar>Alumnos por egresar</TitleBar>
      <Filters onSearch={handleOnSearch} setStateSelected={setStateSelected}  />
      <Row>
        <Col>
          <ButtonCustom
            disabled={!studentsToGraduateList.length}
            icon={<CheckSquareOutlined />}
            onClick={() => handleSetSelectionAll(true)}
            fullWidth={true}
          >
            Seleccionar todos
          </ButtonCustom>
        </Col>
        <Col style={{ marginLeft: "10px" }}>
          <ButtonCustom
            disabled={!studentsToGraduateList.length}
            icon={<CheckSquareOutlined />}
            onClick={() => handleSetSelectionAll(false)}
            fullWidth={true}
          >
            Quitar la selección de todos
          </ButtonCustom>
        </Col>
      </Row>
      <SearchTable
        students={studentsToGraduateList}
        onSelect={handleStudentSelect}
      />
      <ValidateStudentForCertification
        students={studentsToGraduateList.filter((s) => s.selected)}
        onSync={handleOnSync}
        stateSelected={stateSelected}
      />
    </>
  );
};

export default StudentToGraduate;
