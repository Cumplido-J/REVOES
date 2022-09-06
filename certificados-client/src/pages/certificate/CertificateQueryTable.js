import React, { useEffect, useState } from "react";

import { Modal, Space, Row, Col, Table, message } from "antd";
import { ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

import Columns, { columnProps } from "../../shared/columns";
import { ButtonCustom, ButtonIcon, Loading, PageLoading } from "../../shared/components";
import { PdfIcon, XmlIcon, CloseIcon } from "../../components/CustomIcons";
import { downloadBase64 } from "../../shared/functions";

import CertificateValidateEdit from "./CertificateValidateEdit";
import CertificateService from "../../service/CertificateService";
import "./CertificateValidate.css";
import PersonalUserPermissionValidator from "../../components/PersonalUserPermissionValidator";

import { CANCEL_CERTIFICATE } from "../../shared/permissionConstants";
import { usePersonalUserPermissionValidator } from "../../hooks/catalogs/usePersonalUserPermissionValidator";


const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const columnsEnding = (downloadPdf, downloadXml, cancelCertificate,roleData) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      if (row.status !== "CERTIFICADO") return "";
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
           <PersonalUserPermissionValidator permissions={CANCEL_CERTIFICATE} roles={roleData}>
            <ButtonIcon
              onClick={() => cancelCertificate(row.curp)}
              size="large"
              transparent={true}
              tooltip="Cancelar certificado"
              icon={<CloseIcon />}
            />
          </PersonalUserPermissionValidator>
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

export default function CertificateQueryTable({ students, certificateTypeId, reloadStudents }) {
  const [columns, setColumns] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [curp, setCurp] = useState(null);
  const roleData = usePersonalUserPermissionValidator();

  const downloadPdf = async (folioNumber) => {
    const key = "updatable";
    const hide = message.loading("Preparando archivo para su descarga..", 0);
    setLoading(true);
    const response = await CertificateService.downloadPdf(folioNumber);
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
    const response = await CertificateService.downloadMultiplePdf({ certificateTypeId, curps: selectedRowKeys });
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
    const response = await CertificateService.downloadXml(folioNumber);
    setLoading(false);
    hide();
    if (!response.success) return;
    message.success({ content: "Descargando archivo!", key });
    downloadBase64(response.file.fileNameWithExtension, response.file.bytes);
  };
  const cancelCertificate = async (curp) => {
    const confirmCancel = async () => {
      const response = await CertificateService.cancelCertificate(certificateTypeId, curp);
      setLoading(false);
      if (!response.success) return;
      message.success(response.message);

      await reloadStudents();
    };
    setLoading(true);
    Modal.confirm({
      title: "¿Estás seguro de validar estos alumnos?",
      icon: <ExclamationCircleOutlined />,
      content: "Puedes cancelar y volver a validar a los alumnos en un futuro.",
      onOk: confirmCancel,
      onCancel: () => setLoading(false),
      centered: true,
      zIndex: 1040,
    });
  };

  useEffect(() => {
    setColumns(columnsEnding(downloadPdf, downloadXml, cancelCertificate,roleData));
    // eslint-disable-next-line
  }, [certificateTypeId, reloadStudents]);

  useEffect(() => {
    setDataset(students);
  }, [students]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let curps = [];
      if (selected) curps = dataset.filter((row) => row.status === "CERTIFICADO").map((row) => row.curp);
      setSelectedRowKeys(curps);
    },
    getCheckboxProps: (row) => ({
      disabled: row.status !== "CERTIFICADO",
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
            tooltip="Descargar certificados seleccionados"
            color="gold"
            fullWidth
            onClick={downloadMultiplePdf}
            loading={loading}
            icon={<CheckCircleOutlined />}
            disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 150}
          >
            Descargar certificados seleccionados
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
        <CertificateValidateEdit reloadStudents={reloadStudents} curp={curp} setCurp={setCurp} editable={true} />
      </PageLoading>
    </Loading>
  );
}
