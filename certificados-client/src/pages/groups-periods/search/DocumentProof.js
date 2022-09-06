import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ButtonCustom, ButtonIcon, Loading } from "../../../shared/components";
import { FileSearchOutlined } from "@ant-design/icons";
import { documentProofByGroupPeriod } from "../../../service/GroupsPeriodService";
import { Modal, Form, Switch, Row, Col, Input } from "antd";
import { async } from "q";
import { getDateConfigPeriod } from "../../../service/DatesConfigByStateService";
import CatalogService from "../../../service/CatalogService";

const DocumentProof = ({ plantelId, groupPeriodId, icon = true }) => {
  const periodId = useSelector((store) => store.permissionsReducer.period.id);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const handleOnClickDocumentProof = async (data) => {
    setLoading(true);
    const pdfResponse = await documentProofByGroupPeriod(groupPeriodId, data);
    if (pdfResponse && pdfResponse.success) {
      const fileUrl = URL.createObjectURL(pdfResponse.data);
      window.open(fileUrl);
      closeModal();
    }
    setLoading(false);
  };

  const onOk = async () => {
    form.submit();
  }

  const handleShowModal = async () => {
    const respondeState = await CatalogService.getStateId(plantelId);
    if(respondeState && respondeState.success){
      const response = await getDateConfigPeriod({periodo_id: periodId, estado_id: respondeState?.states?.data?.municipio?.estado_id});
      if(response && response.success) {
        form.setFieldsValue({ descripcion: response?.data ? response?.data?.descripcion_constancia : '', fotografia: false});
      }
    }
    setShowModal(true);
  }

  const closeModal = async () => {
    setShowModal(false);
  }


  return <>
    {icon ? (
      <ButtonIcon
        tooltip="Constancia de estudios"
        icon={<FileSearchOutlined />}
        color="blue"
        onClick={handleShowModal}
        tooltipPlacement="top"
        loading={loading}
      />
    ) : (
      <ButtonCustom
        color="primary"
        onClick={handleShowModal}
        icon={<FileSearchOutlined />}
        loading={loading}
        disabled={loading}
      >
        Constancia de estudios
      </ButtonCustom>
    )}
    <Modal
      visible={showModal}
      title="Constancia de estudios"
      cancelText="Cerrar"
      onCancel={closeModal}
      okText="Aceptar"
      onOk={onOk}
      confirmLoading={loading}
    >
      <Loading loading={false}>
        <Form form={form} layout="vertical" onFinish={handleOnClickDocumentProof}>
          <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Form.Item
                label="Descripción"
                name="descripcion"
              >
                <Input.TextArea placeholder="Y con un periodo vacacional del xx al xx de mes del 20xx." />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <Form.Item
                label="Con fotografía"
                valuePropName="checked"
                name="fotografia"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          {/* <fieldset>
              <legend>Datos opcionales</legend>
              <Row style={{ marginBottom: "1em" }}>
                {formSwitches.map((formSwitch, i) => (
                  <Col key={i} xs={{ span: 24 }} md={{ span: 8 }}>
                    <Form.Item
                      label={formSwitch.label}
                      valuePropName="checked"
                      name={formSwitch.name}
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </fieldset> */}
        </Form>
      </Loading>
    </Modal>
  </>
};
export default DocumentProof;
