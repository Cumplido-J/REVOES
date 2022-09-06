import { Form, Row, Col, DatePicker, Switch } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { setPartialSettings } from "../../../service/EvaluationSettingsService";
import alerts from "../../../shared/alerts";

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


export default ({ evaluationsData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [partialSwitch, setPartialSwitch] = useState([]);

  const setUp = async () => {
    setPartialSwitch(evaluationsData.recuperacion_parciales);
    const ids = {
      parcial1: null,
      parcial2: null,
      parcial3: null,
    };
    const formFieldValues = {};
    if(evaluationsData && evaluationsData.recuperacion_parciales){
      evaluationsData.recuperacion_parciales.forEach(
        ({ id, parcial }) => {
          ids[`parcial${parcial}`] = id;
          formFieldValues[`parcial${parcial}`] = (id && parcial) ? true : false;
        }
      );
    }
    form.setFieldsValue(formFieldValues);
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [evaluationsData]);

  const handleSave = async (data) => {
    setLoading(true);
    const formData = {
      recuperacion: []
    };
    for (let parcialIndex = 1; parcialIndex <= 3; parcialIndex++) {
      //console.log(data[`parcial${parcialIndex}`])
      if(data[`parcial${parcialIndex}`]){
        if(!partialSwitch.filter((r) => r.parcial == parcialIndex).length){
          formData.recuperacion.push({
            parcial: parcialIndex,
            plantel_cct: evaluationsData.cct
          })
        }
      }else {
        if(partialSwitch.filter((r) => r.parcial == parcialIndex).length){
          formData.recuperacion.push({
            id: partialSwitch.find((r) => r.parcial == parcialIndex).id,
            parcial: 0,
            plantel_cct: evaluationsData.cct
          })
        }
      }
    }
    if(formData.recuperacion.length){
      const response = await setPartialSettings(formData);

      if(response.success){
        setPartialSwitch(response.data[0].recuperacion_parciales);
        alerts.success("Listo", "Configuración guardada con éxito.");
      }
    }
    setLoading(false);
  };

  const handleError = async () => { };

  return (
    <>
      <Loading loading={loading}>
        <h5>Plantel: {evaluationsData.nombre_final}</h5>
        <h5>CCT: {evaluationsData.cct}</h5>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Parcial 1" name="parcial1" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Parcial 2" name="parcial2" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Parcial 3" name="parcial3" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <PrimaryButton
                icon={<CheckCircleOutlined />}
                size={"large"}
                fullWidth={false}
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
