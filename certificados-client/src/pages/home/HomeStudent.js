import React from "react";
import { Descriptions } from "antd";

import { Subtitle } from "../../shared/components";

export default function HomeStudent({ studentProfile }) {
  return (
    <>
      <Subtitle>Información escolar</Subtitle>
      <Descriptions size="small" bordered style={{ marginBottom: "2em" }}>
        <Descriptions.Item label="Matrícula">{studentProfile.enrollmentKey}</Descriptions.Item>
        <Descriptions.Item label="Plantel">{studentProfile.schoolName}</Descriptions.Item>
        <Descriptions.Item label="CCT Plantel">{studentProfile.cct}</Descriptions.Item>
        <Descriptions.Item label="Ubicación plantel">{`${studentProfile.city} - ${studentProfile.state}`}</Descriptions.Item>
        <Descriptions.Item label="Carrera">{studentProfile.careerName}</Descriptions.Item>
        <Descriptions.Item label="Clave de carrera:">{studentProfile.careerKey}</Descriptions.Item>
      </Descriptions>
    </>
  );
}
