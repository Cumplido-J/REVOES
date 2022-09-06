import React, { useEffect, useState } from "react";

import { Row, Col, Table, Alert } from "antd";
import { EyeOutlined, CheckCircleOutlined } from "@ant-design/icons";

import { ButtonCustom, ButtonIcon, Loading, PageLoading } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import alerts from "../../shared/alerts";

import DegreeService from "../../service/DegreeService";
import DegreeUploadFiel from "./DegreeUploadFiel";
import DegreeValidateEdit from "./DegreeValidateEdit";

import "./DegreeValidate.css";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const columnsDegree = (toggleModal) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => (
      <ButtonIcon onClick={() => toggleModal(row.curp)} tooltip="Editar alumno" icon={<EyeOutlined />} color="red" />
    ),
  },
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.enrollmentKey,
  Columns.cct,
 {
    ...columnProps,
    title: "Plantel en DGP",
    render: (row) => {
      return(
        row.clave + '-' + row.institute
        )
    }
  },
  {
    ...columnProps,
    title: "Clave Carrera en DGP",
    render: (row) => {
      return(
        row.carrerKey
        )
    }
  },
  {
    ...columnProps,
    title: "Carrera en DGP",
    render: (row) => {
      return(
        row.careerName
        )
    }
  },
];

export default function DegreeUploadTable({ students, reloadStudents }) {
  const [columns, setColumns] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [modalFielVisible, setModalFielVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [curp, setCurp] = useState(null);

  useEffect(() => {
    setColumns(columnsDegree(setCurp));
  }, []);

  useEffect(() => {
    setDataset(students);
  }, [students]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let curps = [];
      if (selected) curps = dataset.filter((row) => row.endingCertificate === true).map((row) => row.curp);
      setSelectedRowKeys(curps);
    },
    getCheckboxProps: (row) => ({
      disabled: row.endingCertificate === false,
      name: row.curp,
    }),
  };

  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };

  const degreeStudents = async (values) => {
    setLoading(true);
    const response = await DegreeService.degreeStudents({
      curps: selectedRowKeys,
      fiel: { ...values },
    });
    setUploadResponse(response);
    setLoading(false);

    if (response.success) {
      await reloadStudents();
      setSelectedRowKeys([]);
      alerts.success(response.message);
    }
    return response;
  };
  return (
    <Loading loading={loading}>
      {uploadResponse && (
        <Alert
          message={<strong>Atención</strong>}
          description={uploadResponse.message}
          type={uploadResponse.success ? "success" : "error"}
          showIcon
          style={{ marginBottom: "1em" }}
        />
      )}
      <Row {...rowProps}>
        <Col {...colProps}>
          <strong>Registros encontrados: </strong> {dataset.length}
        </Col>
        <Col {...colProps}>
          <strong>Alumnos seleccionados: </strong> {selectedRowKeys.length}
          <ButtonCustom
            tooltip="Titular alumnos seleccionados"
            color="gold"
            fullWidth
            disabled={selectedRowKeys.length === 0}
            onClick={toggleModalFiel}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Titular alumnos seleccionados
          </ButtonCustom>
        </Col>
      </Row>
      <Table
        bordered
        rowKey="curp"
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
        rowSelection={rowSelection}
        rowClassName={(record) => (record.endingCertificate === true ? "" : "error-row")}
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>

      <PageLoading loading={loading}>
        <DegreeValidateEdit curp={curp} setCurp={setCurp} editable={false} />
      </PageLoading>

      <DegreeUploadFiel
        modalFielVisible={modalFielVisible}
        toggleModalFiel={toggleModalFiel}
        degreeStudents={degreeStudents}
      />
    </Loading>
  );
}
