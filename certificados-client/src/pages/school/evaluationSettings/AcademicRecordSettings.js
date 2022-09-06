import { Form, Row, Col, DatePicker } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getAcademicRecordSettings, setAcademicRecordSettings } from "../../../service/EvaluationSettingsService";
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
  const [dataSchool, setDataSchool] = useState({});

  const setUp = async () => {
    const response = await getAcademicRecordSettings(cct);
    if (response && response.success) {
      setDataSchool(response.data);
      const formFieldValues = {};
      if (response.data.config_calificar_historico.length) {
        const { fecha_inicio, fecha_final } = response.data.config_calificar_historico[0];
        formFieldValues.settings = [moment(fecha_inicio), moment(fecha_final)];
        form.setFieldsValue(formFieldValues);
      }

    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [cct]);

  const handleSave = async (data) => {
    setLoading(true);
    let historico = [];
    if (data.settings) {
      if(dataSchool.config_calificar_historico.length) {
        historico = [{
          id: dataSchool.config_calificar_historico[0]?.id,
          fecha_inicio: moment(data.settings[0]).format("YYYY-MM-DD"),
          fecha_final: moment(data.settings[1]).format("YYYY-MM-DD"),
          plantel_cct: dataSchool.cct
        }];
      } else {
        historico = [{
          fecha_inicio: moment(data.settings[0]).format("YYYY-MM-DD"),
          fecha_final: moment(data.settings[1]).format("YYYY-MM-DD"),
          plantel_cct: dataSchool.cct
        }];
      }
    } else if (data.settings === null) {
      historico = [{
        id: dataSchool.config_calificar_historico[0]?.id,
        fecha: "",
        plantel_cct: dataSchool.cct
      }]
    }
    const response = await setAcademicRecordSettings({ historico });
    // Handle response
    if (response.success) {
      alerts.success("Listo", "Configuración guardada con éxito.");
      setUp();
    }
    setLoading(false);
  }

  const handleError = async () => { };

  return (
    <>
      <Loading loading={loading}>
        <h5>Plantel: {dataSchool.nombre_final}</h5>
        <h5>CCT: {dataSchool.cct}</h5>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Fechas para corrección" name="settings" >
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
