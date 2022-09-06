import React, { useState } from "react";
import { PlusCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import { ButtonCustom, ButtonCustomLink } from "../../shared/components";
import { Row, Col } from "antd";
import { downloadCsv } from "../../shared/functions";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

export default function StudentSearchActions({ dataset }) {
  const [loading, setLoading] = useState(false);

  const downloadExcel = async () => {
    setLoading(true);
    downloadCsv(dataset, "Reporte alumnos");
    setLoading(false);
  };
  const addStudentButtonProps = {
    link: "/Alumnos/Agregar",
    icon: <PlusCircleOutlined />,
    color: "gold",
    fullWidth: false,
  };
  const excelButtonProps = {
    loading,
    disabled: dataset.length === 0,
    onClick: downloadExcel,
    color: "green",
    icon: <FileExcelOutlined />,
    fullWidth: false,
  };
  return (
    <Row {...rowProps}>
      <Col {...colProps}>
        <ButtonCustom {...excelButtonProps}>Exportar a excel</ButtonCustom>
      </Col>
      <Col {...colProps}>
        <ButtonCustomLink {...addStudentButtonProps}>Agregar alumno</ButtonCustomLink>
      </Col>
    </Row>
  );
}
