import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Loading, PageLoading, Title } from "../../shared/components";
import Alerts from "../../shared/alerts";

import StudentInfoForm from "./StudentInfoForm";
import StudentInfoService from "../../service/StudentInfoService";

export default function StudentInfo({ userProfile, history, getUserProfile }) {
  const { curp } = userProfile.userProfile;
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const getStudentInfo = async (curp) => {
      const response = await StudentInfoService.getStudentInfoData(curp);
      setLoading(false);
      if (!response.success) return;
      setStudentInfo(response.studentInfo);
    };
    getStudentInfo();
  }, []);

  const updateStudentInfo = async (values) => {
    setLoading(true);
    const response = await StudentInfoService.updateStudentInfoData(curp, values);
    if (!response.success) {
      setLoading(false);
      return;
    }
    Alerts.success("Gracias", "Datos actualizados correctamente");
    await getUserProfile();
    history.push("/");
  };

  return (
    <Loading loading={loading}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Actualizar datos</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Actualizar datos generales</Title>
        </Col>
      </Row>
      <p>Favor de actualizar la siguiente informacion</p>
      <PageLoading loading={loading}>
        <StudentInfoForm onSubmit={updateStudentInfo} studentInfo={studentInfo} />
      </PageLoading>
    </Loading>
  );
}
