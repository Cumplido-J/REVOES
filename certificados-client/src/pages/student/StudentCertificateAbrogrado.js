import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form, Switch, Space, DatePicker, InputNumber } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import CertificateService from "../../service/CertificateService";

import alerts from "../../shared/alerts";
import { Loading, PrimaryButton, Subtitle } from "../../shared/components";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validateMessages = {
  required: "¡Este campo es requerido!",
};
const validations = {
  score: [
    {
      required: true,
      validator: (rule, value) => {
        if (!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) > 0.0) {
          return Promise.resolve();
        }
        return Promise.reject("Ingresa una calificación menor o igual a 10");
      },
    },
  ],
  default: [{ required: true }],
};

export default function StudentCertificateAbrogrado({ curp, setCurp, editable }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({});
  
  const [toggleEdit, setToggleEdit] = useState(true);

  useEffect(() => {
    const getStudentData = async () => {
      setLoading(true);
      const response = await CertificateService.getStudentData(curp);
  
      setLoading(false);
      if (!response.success) return;
      setStudentData(response.studentData);
      form.setFieldsValue({ ...response.studentData });
      
    };
    if (curp === null) {
      setStudentData({});
      setToggleEdit(false);

    } else {
      getStudentData();
    }
  }, [curp, form]);

  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  const reloadStudentData = async () => {
    setLoading(true);
    const response = await CertificateService.getStudentData(curp);
    setLoading(false);
    if (!response.success) return;
    setStudentData(response.studentData);
  };
  const reprobateStudent = async () => {
    setLoading(true);
    const response = await CertificateService.reprobateStudent(curp);
    setLoading(false);
    if (!response.success) return;
    await reloadStudentData();
   
    alerts.success(response.message);
  };

  const editStudent = async (values) => {
    setLoading(true);
    const response = await CertificateService.editStudent(values, values.isPortability=0,values.isAbrogado=2);
    setLoading(false);
    if (!response.success) return;
    await reloadStudentData();
    
    alerts.success(response.message);
  };

  return (
    
      <Loading loading={loading}>
        <Subtitle>Información de alumno</Subtitle>
        {editable && (
          <Space size="middle" style={{ marginBottom: "1em" }}>
            <strong>Certificado abrogado: </strong>
            <Switch
              checkedChildren="Si"
              unCheckedChildren="No"
              //onChange={() => {setToggleEdit(!toggleEdit);}}
              checked={toggleEdit}
            />
            <strong>Alumno reprobado/no certifica: </strong>
            <Switch
              checkedChildren="Si"
              unCheckedChildren="No"
              onChange={reprobateStudent}
              checked={studentData.reprobate}
            />
          </Space>
        )}
        
        <Form
          validateMessages={validateMessages}
          form={form}
          onFinish={editStudent}
          onFinishFailed={handleFinishFailed}
          layout="vertical"
        >
          <Row {...rowProps}>
            <Col {...colProps}>
            
              <Form.Item label="CURP:" name="curp">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Plantel:" name="schoolName">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Carrera:" name="careerName">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row {...rowProps}>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha ingreso:" name="enrollmentStartDateReadable">
                  <Input disabled style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha ingreso:" name="enrollmentStartDate" rules={validations.default}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>
            <Col {...colProps}>
              {!toggleEdit && (
                <Form.Item label="Fecha egreso:" name="enrollmentEndDateReadable">
                  <Input disabled style={{ width: "90%" }} />
                </Form.Item>
              )}
              {toggleEdit && (
                <Form.Item label="Fecha egreso:" name="enrollmentEndDate" rules={validations.default}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                </Form.Item>
              )}
            </Col>
            <Col {...colProps}>
              <Form.Item label="Promedio:" name="finalScore" rules={validations.default}>
                <InputNumber min={6} max={10} disabled={!toggleEdit} style={{ width: "90%" }} precision={1} />
              </Form.Item>
            </Col>
          </Row>

          <Subtitle>Calificaciones módulos</Subtitle>

          <Form.List name="modules">
            {(fields) => {
              if (!studentData.modules) return <></>;
              return (
                <Row {...rowProps}>
                  {fields.map((field) => (
                    <Col xs={{ span: 24 }} key={field.key}>
                      <Form.Item
                        label={studentData.modules[field.key].name}
                        name={[field.name, "score"]}
                        rules={validations.score}
                      >
                        <Input addonBefore="Calificación:" disabled={!toggleEdit} />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              );
            }}
          </Form.List>
          
          {toggleEdit && (
            <Form.Item style={{ textAlign: "center" }}>
              <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} fullWidth={true}>
                Actualizar datos
              </PrimaryButton>
            </Form.Item>
          )}
        </Form>
      </Loading>
    
  );
}