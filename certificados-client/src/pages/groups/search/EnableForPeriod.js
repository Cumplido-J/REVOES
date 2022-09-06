import React, { useState } from "react";
import { Modal, Form, Row, Col, Input } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Alerts from "../../../shared/alerts";
import {
  ButtonIcon,
  Loading,
  SearchSelect,
  PrimaryButton,
  ButtonCustom,
} from "../../../shared/components";
import Catalogs from "../../../service/CatalogService";
import { setPeriodOnGroup } from "../../../service/GroupsPeriodService";
const { getPeriodsCatalog } = Catalogs;
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

export default ({ groupData }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [periods, setPeriods] = useState([]);

  const handleOnClicModalBtn = async () => {
    setVisible(true);
    setLoading(true);
    form.setFieldsValue({
      periodo_id: null,
      max_alumnos: null,
    });
    const periodsResponse = await getPeriodsCatalog();
    if (periodsResponse && periodsResponse.success) {
      setPeriods(
        periodsResponse.periods.map(({ id, nombre_con_mes }) => ({
          id,
          description: nombre_con_mes,
        }))
      );
    }
    setLoading(false);
  };

  const handleFinish = async (data) => {
    setLoading(true);
    const setPeriodResponse = await setPeriodOnGroup({
      grupo_id: groupData.id,
      ...data,
    });
    if (setPeriodResponse.success) {
      Alerts[
        setPeriodResponse.message === "Se ha habilitado el grupo"
          ? "success"
          : "warning"
      ]("Guardado", setPeriodResponse.message);
      setVisible(false);
    }
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <ButtonIcon
        tooltip="Activar periodo"
        icon={<ClockCircleOutlined />}
        color="green"
        onClick={handleOnClicModalBtn}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Habilitar grupo en un periodo"
        confirmLoading={loading}
        footer={null}
        onCancel={handleCancel}
      >
        <Loading loading={loading}>
          <Form
            form={form}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            layout="vertical"
          >
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Periodo"
                  name="periodo_id"
                  rules={validations.required}
                >
                  <SearchSelect dataset={periods} disabled={!periods.length} />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Cantidad de alumnos"
                  name="max_alumnos"
                  rules={validations.required}
                >
                  <Input
                    type="number"
                    style={{ width: "90%" }}
                    min={1}
                    max={100}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <PrimaryButton
                  size="large"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                >
                  Guardar
                </PrimaryButton>
              </Col>
            </Row>
          </Form>
          <Col {...styles.colProps}>
            <ButtonCustom
              size="large"
              loading={loading}
              icon={<CloseCircleOutlined />}
              onClick={handleCancel}
            >
              Cancelar
            </ButtonCustom>
          </Col>
        </Loading>
      </Modal>
    </>
  );
};
