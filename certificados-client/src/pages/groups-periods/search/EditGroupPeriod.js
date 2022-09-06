import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateGroupsPeriodRecord } from "../../../reducers/groups-periods/actions/updateGroupPeriodRercord";
import { Modal, Form, Row, Col, Input } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Alerts from "../../../shared/alerts";
import {
  ButtonIcon,
  Loading,
  PrimaryButton,
  ButtonCustom,
} from "../../../shared/components";
import { editPeriodOnGroup } from "../../../service/GroupsPeriodService";
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
  const permission = useSelector(
    (state) => state.permissionsReducer.permissions
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleOnClicModalBtn = async () => {
    form.setFieldsValue({
      max_alumnos: groupData.max_alumnos,
    });
    setVisible(true);
  };

  const handleFinish = async (data) => {
    setLoading(true);
    const apiResponse = await editPeriodOnGroup(groupData.id, data);
    if (apiResponse.success) {
      Alerts.warning("Guardado", apiResponse.message);
      if (permission.includes("Aprobar grupos")) {
        dispatch(updateGroupsPeriodRecord(apiResponse.data));
      }
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
        tooltip="Editar periodo"
        icon={<EditOutlined />}
        color="green"
        onClick={handleOnClicModalBtn}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title={`Editar grupo ${groupData.grupo}`}
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
