import React, { useEffect, useState } from "react";

import { Modal, Space, Row, Col, Table, message, Select, Form } from "antd";
import { ExclamationCircleOutlined, CheckCircleOutlined, SearchOutlined } from "@ant-design/icons";

import Columns, { columnProps } from "../../shared/columns";
import { ButtonCustom, ButtonIcon, Loading, PageLoading, SearchSelect, PrimaryButton } from "../../shared/components";
import { PdfIcon, XmlIcon, CloseIcon } from "../../components/CustomIcons";
import { downloadBase64 } from "../../shared/functions";

import DegreeValidateEdit from "./DegreeValidateEdit";
import DegreeService from "../../service/DegreeService";
import "./DegreeValidate.css";
import { formatCountdown } from "antd/lib/statistic/utils";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const columnsEnding = (downloadPdf, downloadXml, cancelDegree) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      if (row.status !== "TITULADO") return "";
      return (
        <Space size="middle">
          <ButtonIcon
            onClick={() => downloadPdf(row.folioNumber)}
            size="large"
            transparent={true}
            tooltip="Descargar PDF"
            icon={<PdfIcon />}
          />
          <ButtonIcon
            onClick={() => downloadXml(row.folioNumber)}
            size="large"
            transparent={true}
            tooltip="Descargar XML"
            icon={<XmlIcon />}
          />
          <ButtonIcon
            onClick={() => cancelDegree(row.curp)}
            size="large"
            transparent={true}
            tooltip="Cancelar título"
            icon={<CloseIcon />}
          />
        </Space>
      );
    },
  },
  Columns.curp,
  Columns.status,
  Columns.folioNumber,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.enrollmentKey,
  Columns.cct,
  Columns.schoolName,
  Columns.carrerKey,
  Columns.careerName,
];

const validations = {
  cancelationReason: [{ required: true, message: "¡Este campo es requerido!" }],
};

export default function DegreeQueryTable({ reasons, students, reloadStudents }) {
  const [form] = Form.useForm();
  const [columns, setColumns] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [curp, setCurp] = useState(null);
  const [motivo, setMotivo] = useState();

  const downloadPdf = async (folioNumber) => {
    const key = "updatable";
    const hide = message.loading("Preparando archivo para su descarga..", 0);
    setLoading(true);
    const response = await DegreeService.downloadPdf(folioNumber);
    setLoading(false);
    hide();
    if (!response.success) return;
    message.success({ content: "Descargando archivo!", key });
    downloadBase64(response.file.fileNameWithExtension, response.file.bytes);
  };
  const downloadMultiplePdf = async () => {
    const key = "updatable";
    const hide = message.loading("Preparando archivo para su descarga..", 0);
    setLoading(true);
    const response = await DegreeService.downloadMultiplePdf({ curps: selectedRowKeys });
    setLoading(false);
    hide();
    if (!response.success) return;
    message.success({ content: "Descargando archivo!", key });
    downloadBase64(response.file.fileNameWithExtension, response.file.bytes);
  };
  const downloadXml = async (folioNumber) => {
    const key = "updatable";
    const hide = message.loading("Preparando archivo para su descarga..", 0);
    setLoading(true);
    const response = await DegreeService.downloadXml(folioNumber);
    setLoading(false);
    hide();
    if (!response.success) return;
    message.success({ content: "Descargando archivo!", key });
    downloadBase64(response.file.fileNameWithExtension, response.file.bytes);
  };
  const cancelDegree = async (curp) => {
    const confirmCancel = async (values) => {

      const response = await DegreeService.cancelDegree(curp, values);
      setLoading(false);
      if (!response.success) return;
      message.success(response.message);

      await reloadStudents();
    };
    setLoading(true);
    Modal.confirm({
      title: "¿Estás seguro de cancelar el registro de este alumno en Dirección General de Profesiones?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <div>Puedes cancelar y volver a validar a los alumnos en un futuro. </div>
          <br />
          <Form form={form} onFinish={confirmCancel} layout="vertical">
            <Form.Item label="Motivo:" name="cancelationReason" rules={validations.cancelationReason}>
              <SearchSelect dataset={reasons.reasons} onChange={setMotivo} value={motivo} />
            </Form.Item>
          </Form>
        </>
      ),
      onOk: form.submit,
      onCancel: () => setLoading(false),
      centered: true,
      zIndex: 1040,

    });
  };

  useEffect(() => {
    setColumns(columnsEnding(downloadPdf, downloadXml, cancelDegree));
    // eslint-disable-next-line
  }, [reloadStudents]);

  useEffect(() => {
    setDataset(students);
  }, [students]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let curps = [];
      if (selected) curps = dataset.filter((row) => row.status === "TITULADO").map((row) => row.curp);
      setSelectedRowKeys(curps);
    },
    getCheckboxProps: (row) => ({
      disabled: row.status !== "TITULADO",
      name: row.curp,
    }),
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
            tooltip="Descargar títulos seleccionados"
            color="gold"
            fullWidth
            onClick={downloadMultiplePdf}
            loading={loading}
            icon={<CheckCircleOutlined />}
            disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 150}
          >
            Descargar títulos seleccionados
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
