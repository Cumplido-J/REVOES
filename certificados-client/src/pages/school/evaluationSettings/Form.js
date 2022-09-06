import { Form, Row, Col, DatePicker } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { setEvaluationSettings } from "../../../service/EvaluationSettingsService";
import moment from "moment";
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
  const [configsId, setConfigsId] = useState({
    parcial1: null,
    parcial2: null,
    parcial3: null,
    extra: null,
  });

  const setUp = async () => {
    const ids = {
      parcial1: null,
      parcial2: null,
      parcial3: null,
      extra: null,
    };
    const formFieldValues = {};
    if(evaluationsData && evaluationsData.evaluaciones_ordinarias){
      evaluationsData.evaluaciones_ordinarias.forEach(
        ({ id, parcial, fecha_inicio, fecha_final }) => {
          ids[`parcial${parcial}`] = id;
          formFieldValues[`parcial${parcial}`] = [
            moment(fecha_inicio),
            moment(fecha_final),
          ];
        }
      );
    }
    if (evaluationsData && evaluationsData.evaluaciones_extraordinarias && evaluationsData.evaluaciones_extraordinarias.length) {
      const { id, fecha_inicio, fecha_final } =
      evaluationsData.evaluaciones_extraordinarias[0];
      ids.extra = id;
      formFieldValues.extra = [moment(fecha_inicio), moment(fecha_final)];
    }
    form.setFieldsValue(formFieldValues);
    setConfigsId(ids);
    setLoading(false);
  };
  
  useEffect(() => {
    setUp();
  }, [evaluationsData]);

  const handleSave = async (data) => {
    setLoading(true);
    const formData = {
      ordinarios: [],
      extraordinarios: [],
    };
    // Set form data
    for (let parcialIndex = 1; parcialIndex <= 3; parcialIndex++) {
      if (data[`parcial${parcialIndex}`]) {
        formData.ordinarios.push({
          id: configsId[`parcial${parcialIndex}`],
          parcial: parcialIndex,
          fecha_inicio: moment(data[`parcial${parcialIndex}`][0]).format(
            "YYYY-MM-DD"
          ),
          fecha_final: moment(data[`parcial${parcialIndex}`][1]).format(
            "YYYY-MM-DD"
          ),
          plantel_cct: evaluationsData.cct,
        });
      } else if (configsId[`parcial${parcialIndex}`]) {
        formData.ordinarios.push({
          id: configsId[`parcial${parcialIndex}`],
          parcial: parcialIndex,
          fecha: "",
          plantel_cct: evaluationsData.cct,
        });
      }
    }
    if (data.extra) {
      formData.extraordinarios.push({
        id: configsId.extra,
        fecha_inicio: moment(data.extra[0]).format("YYYY-MM-DD"),
        fecha_final: moment(data.extra[1]).format("YYYY-MM-DD"),
        plantel_cct: evaluationsData.cct,
      });
    } else if (configsId.extra) {
      formData.extraordinarios.push({
        id: configsId.extra,
        fecha: "",
        plantel_cct: evaluationsData.cct,
      });
    }
    // Save
    const response = await setEvaluationSettings(formData);
    // Handle response
    if (response.success) {
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length
      ) {
        const ids = {
          parcial1: null,
          parcial2: null,
          parcial3: null,
          extra: null,
        };
        response.data[0].evaluaciones_ordinarias.forEach(({ id, parcial }) => {
          ids[`parcial${parcial}`] = id;
        });
        if (response.data[0].evaluaciones_extraordinarias.length) {
          const { id } = response.data[0].evaluaciones_extraordinarias[0];
          ids.extra = id;
        }
        setConfigsId(ids);
      }
      alerts.success("Listo", "Configuración guardada con éxito.");
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
              <Form.Item label="Parcial #1" name="parcial1">
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Parcial #2" name="parcial2">
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Parcial #3" name="parcial3">
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Evaluaciones extraordinarias" name="extra">
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha inicio", "Fecha límite"]}
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
