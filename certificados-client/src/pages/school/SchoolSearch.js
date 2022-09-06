import React, { useState } from "react";
import { Link } from "react-router-dom";

import { HomeOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb } from "antd";

import { Title } from "../../shared/components";
import SchoolService from "../../service/SchoolService";

import SchoolSearchFilter from "./SchoolSearchFilter";
import SchoolSearchTable from "./SchoolSearchTable";
import SchoolSearchActions from "./SchoolSearchActions";

export default function SchoolSearch(props) {
  const [schoolList, setSchoolList] = useState([]);

  const searchSchools = async function (values) {
    const response = await SchoolService.schoolSearch(values);
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
          <span>Lista de planteles</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de planteles</Title>
        </Col>
      </Row>

      <SchoolSearchFilter {...props} onSubmit={searchSchools} />
      <SchoolSearchActions {...props} dataset={schoolList} />
      <SchoolSearchTable {...props} dataset={schoolList} />
    </>
  );
}
