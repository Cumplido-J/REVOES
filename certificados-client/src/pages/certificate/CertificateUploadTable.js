import React, { useEffect, useState } from "react";

import { Row, Col, Table, Alert } from "antd";
import { EyeOutlined, CheckCircleOutlined } from "@ant-design/icons";

import { ButtonCustom, ButtonIcon, Loading, PageLoading } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import alerts from "../../shared/alerts";

import CertificateService from "../../service/CertificateService";
import CertificateUploadFiel from "./CertificateUploadFiel";
import CertificateValidateEdit from "./CertificateValidateEdit";

import "./CertificateValidate.css";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const columnsEnding = (toggleModal) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => (
      <ButtonIcon onClick={() => toggleModal(row.curp)} tooltip="Editar alumno" icon={<EyeOutlined />} color="red" />
    ),
  },
  {
    ...columnProps,
    title: "Datos completos",
    render: (row) => (row.dataComplete === false ? "No" : "Si"),
    defaultSortOrder: "descend",
    sorter: (a, b) => a.dataComplete.toString().localeCompare(b.dataComplete.toString()),
  },
  {
    ...columnProps,
    title: "Portabilidad",
    render: (row) => (row.portability === false ? "No" : "Si"),
    defaultSortOrder: "descend",
    sorter: (a, b) => a.portability.toString().localeCompare(b.portability.toString()),
  },
  {
    ...columnProps,
    title: "Reprobado",
    render: (row) => (row.reprobate === false ? "No" : "Si"),
    defaultSortOrder: "descend",
    sorter: (a, b) => a.reprobate.toString().localeCompare(b.reprobate.toString()),
  },
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.enrollmentKey,
  Columns.cct,
  Columns.schoolName,
  Columns.carrerKey,
  Columns.careerName,
];
const columnsPartial = [
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.enrollmentKey,
  Columns.cct,
  Columns.schoolName,
  Columns.carrerKey,
  Columns.careerName,
];

export default function CertificateUploadTable({ students, certificateTypeId, reloadStudents }) {
  const [columns, setColumns] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [modalFielVisible, setModalFielVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [curp, setCurp] = useState(null);
  //Estatus para la activacion del mensaje de la inactividad del boton de certificación
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (certificateTypeId === 1) setColumns(columnsEnding(setCurp));
    else setColumns(columnsPartial);
    setDataset([]);
  }, [certificateTypeId]);

  useEffect(() => {
    setDataset(students);
  }, [students]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let curps = [];
      if (selected) curps = dataset.filter((row) => row.dataComplete === true).map((row) => row.curp);
      setSelectedRowKeys(curps);
    },
    getCheckboxProps: (row) => ({
      disabled: row.dataComplete === false,
      name: row.curp,
    }),
  };

  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };

  const certificateStudents = async (values) => {
    setLoading(true);
    const response = await CertificateService.certificateStudents({
      certificateTypeId,
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
          {active ? (
            <ButtonCustom
              tooltip="Certificar alumnos seleccionados"
              color="gold"
              fullWidth
              disabled={selectedRowKeys.length === 0}
              onClick={toggleModalFiel}
              loading={loading}
              icon={<CheckCircleOutlined />}
            >
              Certificar alumnos seleccionados
            </ButtonCustom>
          ) : (
            <Alert
              message="¡Aviso!"
              description="Por el momento no esta habilitado el timbrado de Certificados, 
              debido a unos ajustes técnicos, agradecemos su comprensión."
              type="info"
              showIcon
            />
          )}
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
        rowClassName={(record) => (certificateTypeId === 2 || record.dataComplete === true ? "" : "error-row")}
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>

      <PageLoading loading={loading}>
        <CertificateValidateEdit curp={curp} setCurp={setCurp} editable={false} />
      </PageLoading>

      <CertificateUploadFiel
        modalFielVisible={modalFielVisible}
        toggleModalFiel={toggleModalFiel}
        certificateStudents={certificateStudents}
      />
    </Loading>
  );
}
