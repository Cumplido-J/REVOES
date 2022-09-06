import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import DegreeService from "../../service/DegreeService";

import DegreeFilter from "./DegreeFilter";
import DegreeUploadTable from "./DegreeUploadTable";

export default function DegreeUpload() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({});

  const reloadStudents = async () => {
    await searchStudents(filter);
  };
  const searchStudents = async (values) => {
    const response = await DegreeService.studentUploadSearch(values);
    if (!response.success) return;
    setStudents(response.students);
    setFilter(values);
  };
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Titular alumnos</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Titulación de alumnos</Title>
        </Col>
      </Row>
      <DegreeFilter onSubmit={searchStudents} />
      <DegreeUploadTable students={students} reloadStudents={reloadStudents} />
    </>
  );
}
