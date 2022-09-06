import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import alerts from "../../shared/alerts";

import StudentService from "../../service/StudentService";
import StudentForm from "./StudentForm";

export default function StudentAdd(props) {
  const addStudent = async (form) => {
    const response = await StudentService.addStudent(form);
    if (!response.success) return;
    alerts.success("Alumno guardado", "Alumno insertado correctamente");
    props.history.push(`/Alumnos/Editar/${response.studentData.curp}`);
  };
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/Alumnos/" style={{ color: "black" }}>
            <span>Lista de alumnos</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Agregar alumno</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Agregar alumno</Title>
        </Col>
      </Row>
      <StudentForm {...props} onSubmit={addStudent} />
    </>
  );
}
