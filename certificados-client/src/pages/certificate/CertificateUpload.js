import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import CertificateService from "../../service/CertificateService";

import CertificateFilter from "./CertificateFilter";
import CertificateUploadTable from "./CertificateUploadTable";

export default function CertificateUpload() {
  const [students, setStudents] = useState([]);
  const [certificateTypeId, setCertificateTypeId] = useState(0);
  const [filter, setFilter] = useState({});

  const reloadStudents = async () => {
    await searchStudents(filter);
  };
  const searchStudents = async (values) => {
    const response = await CertificateService.studentUploadSearch(values);
    if (!response.success) return;
    setStudents(response.students);
    setFilter(values);
  };
  const changeCertificateType = (certificateTypeId) => {
    setCertificateTypeId(certificateTypeId);
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
          <span>Certificar alumnos</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Certificación de alumnos</Title>
        </Col>
      </Row>
      <CertificateFilter onSubmit={searchStudents} changeCertificateType={changeCertificateType} />
      <CertificateUploadTable
        students={students}
        certificateTypeId={certificateTypeId}
        reloadStudents={reloadStudents}
      />
    </>
  );
}
