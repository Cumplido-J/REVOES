import React, { useEffect, useState } from "react";

import { Row, Col, Modal, Table } from "antd";
import { ExclamationCircleOutlined, EyeOutlined, CheckCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";

import CertificateService from "../../service/CertificateService";

import Columns, { columnProps } from "../../shared/columns";
import { ButtonCustom, ButtonIcon, Loading, PageLoading } from "../../shared/components";
import alerts from "../../shared/alerts";

import "./CertificateValidate.css";
import CertificateValidateEdit from "./CertificateValidateEdit";
import CertificateValitadeData from "./CertificateValidateData";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const columnsEnding = (toggleModal, toggleModalData) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (<>
        <ButtonIcon onClick={() => toggleModal(row.curp)} tooltip="Editar alumno" icon={<EyeOutlined />} color="red" />
        {" "}
        <ButtonIcon onClick={() => toggleModalData(row.curp)} tooltip="Datos preliminar" icon={<UnorderedListOutlined />} color="green" />
      </>)
    },
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

export default function CertificateValidateTable({ students, certificateTypeId, reloadStudents }) {
  const [columns, setColumns] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [curp, setCurp] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (certificateTypeId === 1 || certificateTypeId === 3) setColumns(columnsEnding(setCurp, setStudent));
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
  const confirmValidateStudents = () => {
    Modal.confirm({
      title: "¿Estás seguro de validar estos alumnos?",
      icon: <ExclamationCircleOutlined />,
      content: "Puedes cancelar y volver a validar a los alumnos en un futuro.",
      onOk: validateStudents,
      onCancel: () => setLoading(false),
      centered: true,
      zIndex: 1040,
    });
  };
  const validateStudents = async () => {
    setLoading(true);
    const response = await CertificateService.validateStudents({ certificateTypeId, curps: selectedRowKeys });
    setLoading(false);
    setSelectedRowKeys([]);

    if (!response.success) return;

    await reloadStudents();
    alerts.success(response.message);
  };
  return (
    <Loading loading={loading}>
      <Row {...rowProps}>
        <Col {...colProps}>
          <strong>Registros encontrados: </strong> {dataset.length}
        </Col>
        <Col {...colProps}>
          <strong>Alumnos seleccionados: </strong> {selectedRowKeys.length}
          <ButtonCustom
            tooltip="Validar alumnos seleccionados"
            color="gold"
            fullWidth
            disabled={selectedRowKeys.length === 0}
            onClick={confirmValidateStudents}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Validar alumnos seleccionados
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
        rowClassName={(record) => (certificateTypeId === 2 || record.dataComplete === true ? "" : "error-row")}
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>

      <PageLoading loading={loading}>
        <CertificateValidateEdit reloadStudents={reloadStudents} curp={curp} setCurp={setCurp} editable={true} />
        <CertificateValitadeData reloadStudents={reloadStudents} student={student} setStudent={setStudent} editable={true} />
      </PageLoading>
    </Loading>
  );
}
