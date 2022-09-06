import React, { useState } from "react";
import { PlusCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import { ButtonCustom, ButtonCustomLink } from "../../shared/components";
import { Row, Col } from "antd";
import { downloadCsv } from "../../shared/functions";
import PermissionValidator from "../../components/PermissionValidator";
import { permissionList } from "../../shared/constants";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

export default function SchoolSearchActions({ dataset }) {
  const [loading, setLoading] = useState(false);

  const downloadExcel = async () => {
    setLoading(true);
    downloadCsv(dataset, "Reporte planteles");
    setLoading(false);
  };
  const addSchoolButtonProps = {
    link: "/Planteles/Agregar",
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
      <PermissionValidator permissions={[permissionList.AGREGAR_PLANTELES]}>
        <Col {...colProps}>
          <ButtonCustomLink {...addSchoolButtonProps}>
            Agregar plantel
          </ButtonCustomLink>
        </Col>
      </PermissionValidator>
    </Row>
  );
}
