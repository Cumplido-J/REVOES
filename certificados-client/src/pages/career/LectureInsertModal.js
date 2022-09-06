import React, { useState } from "react";
import { Row, Col, Form, Alert, Modal, Input, InputNumber} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { PrimaryButton ,ButtonCustom, SearchSelect} from "../../shared/components";
import Alerts from "../../shared/alerts";

export default function LectureInsertModal({ modalInsertVisible,insertLecture,getLecturesByCareer,togglemodalInsertCancel,catalogs}) {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [form] = Form.useForm();

  const validations = {
    nombre: [{ required: true, message: "¡El nombre es requerido!" }],
  };

  const colProps = {
    xs: { span: 8 },
    md: { span: 4 },
  };
  
  const handleFinish = async (values) => {
    setErrorMessage(null);
    setLoading(true);
    const form = {};
    const response = await insertLecture(values);
    if (response.success)
    {
      await getLecturesByCareer(); 
      togglemodalInsertCancel();
    }
    else setErrorMessage(response.message);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  return (
  <Modal zIndex="1040" centered  width="100%" title="Insertar carrera" visible={modalInsertVisible} footer={null} onCancel={togglemodalInsertCancel}>
    <Form form={form} layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed} >
    <Row align="center" >
        <Col {...colProps}>
          <Form.Item label="nombre:" name="nombre" rules={validations.nombre}>
            <Input style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="clave de materia:" name="clave_uac">
            <Input placeholder="clave_uac" style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="md:" name="md" rules={[{ type: 'number', min: 0, max: 999, required: false }]}>
            <InputNumber type="number" placeholder="md" style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="ei:" name="ei" rules={[{ type: 'number', min: 0, max: 999, required: false }]}>
            <InputNumber type="number" placeholder="ei" style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="horas:" name="horas" rules={[{ type: 'number', min: 0, max: 999, required: true }]}>
            <InputNumber type="number" placeholder="horas" style={{ width: "90%" }} />
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="creditos:" name="creditos" rules={[{ type: 'number', min: 0, max: 999, required: true }]}>
            <InputNumber type="number" placeholder="creditos" style={{ width: "90%" }} />
            </Form.Item>
        </Col>
    </Row>
    <Row align="center" >
        <Col {...colProps}>
          <Form.Item label="semestre:" name="semestre" rules={[{type: 'number', required: true }]}>
            <SearchSelect dataset={catalogs.semestre} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="optativa:" name="optativa" rules={[{required: true }]}>
            <SearchSelect dataset={catalogs.decision} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="Campo Disciplinaria:" name="campo_disciplinar_id" rules={[{type: 'number', required: false }]}>
            <SearchSelect dataset={catalogs.diciplinar} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="tipo materia:" name="tipo_uac_id" rules={[{type: 'number', required: true }]}>
            <SearchSelect dataset={catalogs.tipo_uac} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="cecyte:" name="cecyte" rules={[{ required: true }]}>
            <SearchSelect dataset={catalogs.decision} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
        <Col {...colProps}>
          <Form.Item label="Modulo:" name="modulo_id" rules={[{type: 'number', required: true }]}>
            <SearchSelect dataset={catalogs.modules} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>    
    </Row>
    <Row align="center" >
        <Col>
            <PrimaryButton  icon={<CheckCircleOutlined />}>Aceptar</PrimaryButton> 
        </Col>
        <Col>
            <ButtonCustom color="blue" fullWidth icon={<CheckCircleOutlined />} onClick={togglemodalInsertCancel}>
                Cancelar
            </ButtonCustom>
        </Col>     
    </Row>
    <Row >
          {loading && (
            <Alert
              message={<strong>Procesando</strong>}
              description="Favor de no cerrar esta ventana. Se esta insertando el registro..."
              type="info"
              showIcon
            />
          )}
        </Row>    
    </Form>
</Modal>
  );
}