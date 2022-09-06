import React, { useEffect, useState } from "react";

import { Row, Col, Modal, Table } from "antd";
import { ExclamationCircleOutlined, EyeOutlined, CheckCircleOutlined } from "@ant-design/icons";

import DegreeService from "../../service/DegreeService";

import Columns, { columnProps } from "../../shared/columns";
import { ButtonCustom, ButtonIcon, Loading, PageLoading } from "../../shared/components";
import alerts from "../../shared/alerts";

import "./DegreeValidate.css";
import DegreeValidateEdit from "./DegreeValidateEdit";

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

export default function DegreeValidateTable({ students, reloadStudents }) {
  const [columns, setColumns] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [curp, setCurp] = useState(null);

  useEffect(() => {
    setColumns(columnsDegree(setCurp));
    setDataset([]);
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
    const response = await DegreeService.validateStudents({ curps: selectedRowKeys });
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
        scroll={{ x: columns.length * 300 }}
        dataSource={dataset}
        size="small"
        rowSelection={rowSelection}
        rowClassName={(record) => (record.endingCertificate === true ? "" : "error-row")}
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>

      <PageLoading loading={loading}>
        <DegreeValidateEdit reloadStudents={reloadStudents} curp={curp} setCurp={setCurp} editable={true} />
      </PageLoading>
    </Loading>
  );
}
