import React, { useState } from "react";
import { Link } from "react-router-dom";

import { HomeOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb } from "antd";

import { Title } from "../../shared/components";
import SchoolService from "../../service/SchoolService";

import SchoolEquivalentSearch from "./SchoolEquivalentSearch";
import SchoolEquivalentTable from "./SchoolEquivalentTable";

export default function SchoolEquivalentHome(props) {
  const [schoolList, setSchoolList] = useState([]);
  const [state, setState] = useState([]);
  const searchSchools = async function (values) {
    setState(values.stateId);
    const response = await SchoolService.schoolEquivalentSearch(values);
    setSchoolList(response.schoolList);
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
          <span>Lista de planteles equivalentes</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de planteles equivalentes</Title>
        </Col>
      </Row>

      <SchoolEquivalentSearch {...props} onSubmit={searchSchools} />
      <SchoolEquivalentTable {...props} dataset={schoolList} state={state} />

    </>
  );
}
