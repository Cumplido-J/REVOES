import { Form, Row, Col, DatePicker } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getAcademicRecordSettings } from "../../../service/EvaluationSettingsService";
import { dateConfigApplicant, getDateConfigApplicant } from "../../../service/ApplicantsService";
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


export default ({ cct }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const setUp = async () => {
    const response = await getDateConfigApplicant(cct.id);
    if (response && response.success) {
      const formFieldValues = {};
      if (response.data) {
        const { fecha_inicio, fecha_fin, fecha_examen } = response.data;
        formFieldValues.settingsApplicants = [fecha_inicio ? moment(fecha_inicio) : null, fecha_fin ? moment(fecha_fin) : null];
        formFieldValues.examDate = fecha_examen ? moment(fecha_examen) : null;
        form.setFieldsValue(formFieldValues);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [cct]);

  const handleSave = async (props) => {
    setLoading(true);
    const data = {
      plantel_id: cct.id,
      fecha_inicio: props.settingsApplicants ? moment(props.settingsApplicants[0]).format("YYYY-MM-DD") : null,
      fecha_fin: props.settingsApplicants ? moment(props.settingsApplicants[1]).format("YYYY-MM-DD") : null,
      fecha_examen: props.examDate ? moment(props.examDate).format("YYYY-MM-DD") : null
    }
    const response = await dateConfigApplicant(data);
    if(response && response.success) {
      alerts.success("Listo", response.data.message);
    }
    setLoading(false);
  }

  const handleError = async () => { };

  return (
    <>
      <Loading loading={loading}>
        <h5>Plantel: {cct.nombre_final}</h5>
        <h5>CCT: {cct.cct}</h5>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Fechas para aspirantes" name="settingsApplicants" >
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item label="Fechas para aspirantes" name="examDate" >
                <DatePicker format="DD/MM/YYYY" placeholder="Fecha examen" />
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
