import { Form, Row, Col, DatePicker, InputNumber } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  setEvaluationISemester,
  getSemestralEvaluationsDates,
  setEvaluationSemestral
} from "../../../service/EvaluationSettingsService";
import moment from "moment";
import alerts from "../../../shared/alerts";

const { RangePicker } = DatePicker;

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 9 },
  },
  colSwitchProps: {
    xs: { span: 24 },
    md: { span: 10 },
  },
};

export default ({ evaluationsData, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [semestralDate, setSemestralDate] = useState(false);
  const [configsId, setConfigsId] = useState({
    intersemestral: null,
    semestral: null,
    max_alumnos: null
  });

  const setUp = async () => {
    const ids = {
      intersemestral: null,
      semestral: null,
      max_alumnos: null
    };
    const formFieldValues = {};
    const responseSemestralDates = await getSemestralEvaluationsDates(evaluationsData.cct);
    if (responseSemestralDates && responseSemestralDates.success) {
      if (responseSemestralDates.data.recursamiento_semestrales.length) {
        const { id, fecha_inicio, fecha_final, max_alumnos } =
          responseSemestralDates.data.recursamiento_semestrales[0];
        ids.semestral = id;
        ids.max_alumnos = max_alumnos;
        formFieldValues.semestral = [moment(fecha_inicio), moment(fecha_final)];
        formFieldValues.max_alumnos = max_alumnos;
      } else {
        formFieldValues.max_alumnos = null;
      }
      if (evaluationsData.recursamiento_intersemestrales.length) {
        const { id, fecha_inicio, fecha_final } =
          evaluationsData.recursamiento_intersemestrales[0];
        ids.intersemestral = id;
        formFieldValues.intersemestral = [moment(fecha_inicio), moment(fecha_final)];
      }
      form.setFieldsValue(formFieldValues);
      setConfigsId(ids);
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [evaluationsData]);

  const handleSave = async (data) => {
    setLoading(true);
    const formData = {
      intersemestral: [],
      semestral: [],
    };
    var responseSemestral = {};
    var responseIntersemestral = {};
    // Set form data
    if (data.intersemestral) {

      if (configsId.intersemestral) {
        formData.intersemestral.push({
          id: configsId.intersemestral,
          fecha_inicio: moment(data.intersemestral[0]).format("YYYY-MM-DD"),
          fecha_final: moment(data.intersemestral[1]).format("YYYY-MM-DD"),
          plantel_cct: evaluationsData.cct,
        });
      } else {
        formData.intersemestral.push({
          fecha_inicio: moment(data.intersemestral[0]).format("YYYY-MM-DD"),
          fecha_final: moment(data.intersemestral[1]).format("YYYY-MM-DD"),
          plantel_cct: evaluationsData.cct,
        });
      }
    } else if (configsId.intersemestral) {
      formData.intersemestral.push({
        id: configsId.intersemestral,
        parcial: "0",
        plantel_cct: evaluationsData.cct,
      });
    }
    if (formData.intersemestral.length) {
      // Save
      responseIntersemestral = await setEvaluationISemester({ recursamiento: formData.intersemestral });
    }
    if (data.semestral) {

      if (configsId.semestral) {
        formData.semestral.push({
          id: configsId.semestral,
          fecha_inicio: moment(data.semestral[0]).format("YYYY-MM-DD"),
          fecha_final: moment(data.semestral[1]).format("YYYY-MM-DD"),
          plantel_cct: evaluationsData.cct,
          max_alumnos: data.max_alumnos,
        });
      } else {
        formData.semestral.push({
          fecha_inicio: moment(data.semestral[0]).format("YYYY-MM-DD"),
          fecha_final: moment(data.semestral[1]).format("YYYY-MM-DD"),
          plantel_cct: evaluationsData.cct,
          max_alumnos: data.max_alumnos,
        });
      }
    } else if (configsId.semestral) {
      formData.semestral.push({
        id: configsId.semestral,
        parcial: "",
        plantel_cct: evaluationsData.cct,
        max_alumnos: data.max_alumnos,
      });
    }
    if (formData.semestral.length) {
      // Save
      responseSemestral = await setEvaluationSemestral({ recursamiento: formData.semestral });
    }

    // Handle response
    if ((responseIntersemestral && responseIntersemestral.success) && (responseSemestral && responseSemestral.success)) {
      alerts.success("Listo", "Configuración guardada con éxito.");
      onSave();
    }
    setLoading(false);
  };

  const handleChangeDate = (value) => {
    setSemestralDate(value ? true : false);
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
              <Form.Item label="Recursamiento semestral" name="semestral">
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha inicio", "Fecha límite"]}
                  onChange={handleChangeDate}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Máximo de alumnos dentro del grupo" name="max_alumnos" rules={[{ required: semestralDate, message: "¡Este campo es requerido!" }]}>
                <InputNumber min={1} style={{ width: '60%' }} placeholder="Máximo de alumnos" />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Recursamiento intersemestral" name="intersemestral">
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
