import React, { useState } from "react";
import {
  ButtonCustom,
  ButtonIcon,
  Loading,
  SearchSelect,
} from "../../../shared/components";
import { StockOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import { Col, Form, Row } from "antd";
import { groupPeriodPartialStatistics } from "../../../service/GroupsPeriodService";

const ShowStatistics = ({ groupPeriodId, iconMode = true }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const styles = {
    colProps: {
      xs: { span: 24 },
    },
    rowProps: {
      style: { marginBottom: "1em" },
    },
  };

  const validations = {
    required: [
      {
        required: true,
        message: "Este campo es requerido",
      },
    ],
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({
      parcial: null,
    });
  };

  const handleSubmit = async ({ parcial }) => {
    setLoading(true);
    const pdfResponse = await groupPeriodPartialStatistics(
      groupPeriodId,
      parcial
    );
    if (pdfResponse && pdfResponse.success) {
      const fileurl = URL.createObjectURL(pdfResponse.data);
      window.open(fileurl);
    }
    setLoading(false);
  };

  const handleSubmitFailed = () => {};

  const parciales = [
    ...Array.from(Array(3).keys()).map((e) => ({
      id: e + 1,
      description: `Parcial ${e + 1}`,
    })),
    {
      id: 4,
      description: "Calificaciones finales",
    },
  ];

  return (
    <>
      {iconMode ? (
        <ButtonIcon
          onClick={handleOpen}
          tooltip="Estadísticas parcial y final"
          color="gold"
          tooltipPlacement="top"
          icon={<StockOutlined />}
          loading={loading}
        />
      ) : (
        <ButtonCustom
          icon={<StockOutlined />}
          onClick={handleOpen}
          loading={loading}
        >
          Estadísticas parcial y final
        </ButtonCustom>
      )}
      <Modal
        visible={visible}
        title="Estadísticas por parcial o calificación final"
        confirmLoading={loading}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Loading loading={loading}>
          <Form
            form={form}
            onFinish={handleSubmit}
            onFinishFailed={handleSubmitFailed}
            layout={"vertical"}
          >
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Seleccione un parcial o calificación final"
                  name="parcial"
                  rules={validations.required}
                >
                  <SearchSelect dataset={parciales} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Loading>
      </Modal>
    </>
  );
};

export default ShowStatistics;
