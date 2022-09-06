import { Form, Row, Col, DatePicker } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getDateConfigPeriod, editDateConfigPeriod } from "../../../service/DatesConfigByStateService";
import moment from "moment";
import alerts from "../../../shared/alerts";
import { async } from "q";

const { RangePicker } = DatePicker;

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  colSwitchProps: {
    xs: { span: 24 },
    md: { span: 10 },
  },
};


export default ({ periodName, periodId, stateId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [dateSelected, setDateSelected] = useState([]);

  const setUp = async () => {
    setLoading(true);
    if(stateId) {
      const response = await getDateConfigPeriod({periodo_id: periodId, estado_id: stateId});
      if(response && response.success) {
        const formFieldValues = {};
        if(response.data) {
          const { fecha_inicio, fecha_fin } = response.data;
          formFieldValues.settingsPeriod = [fecha_inicio ? moment(fecha_inicio) : null, fecha_fin ? moment(fecha_fin) : null];
          form.setFieldsValue(formFieldValues);
        } else {
          formFieldValues.settingsPeriod = [null, null];
          form.setFieldsValue(formFieldValues);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [stateId]);

  const handleSave = async (props) => {
    setLoading(true);
    const data = {
      periodo_id: periodId,
      estado_id: stateId,
      fecha_inicio: props.settingsPeriod ? moment(props.settingsPeriod[0]).format("YYYY-MM-DD") : null,
      fecha_fin: props.settingsPeriod ? moment(props.settingsPeriod[1]).format("YYYY-MM-DD") : null
    }
    const response = await editDateConfigPeriod(data);
    if(response && response.success) {
      alerts.success("Listo", response.data.message);
      setUp();
    }
    setLoading(false);
  }
  const handleDateInput = async (value) => {
    setDateSelected(value);
  }

  const handleError = async () => { };

  return (
    <>
      <Loading loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <h5>Periodo Actual: {periodName.nombre_con_mes}</h5>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Fecha inicio y fin de semestre" name="settingsPeriod" >
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Inicio semestre", "Fin semestre"]}
                  onChange={handleDateInput}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <PrimaryButton
                icon={<CheckCircleOutlined />}
                size={"large"}
                fullWidth={false}
                disabled={!(stateId && dateSelected.length > 0)}
              >
                Guardar configuración
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
      </Loading>
    </>
  );
};
