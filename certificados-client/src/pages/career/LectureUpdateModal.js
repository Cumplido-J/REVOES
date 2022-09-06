import React, { useState, useEffect } from "react";
import { Row, Col, Form, Alert, Modal, Input, InputNumber} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { PrimaryButton ,ButtonCustom, SearchSelect} from "../../shared/components";
import Alerts from "../../shared/alerts";

export default function LectureUpdateModal({ modalUpdateVisible,updateLecture,uacUpdate,resultLectureById, getLecturesByCareer,togglemodalUpdatetcancel,catalogs}) {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    async function getValues() {
      console.log("en modal");
      console.log(resultLectureById);
      for (let i = 0; i < resultLectureById.length; i++) {
        console.log("en modal");
          form.setFieldsValue({nombre:resultLectureById[i].nombre, clave_uac:resultLectureById[i].clave_uac, md:resultLectureById[i].md, 
            ei:resultLectureById[i].ei, horas:resultLectureById[i].horas, creditos:resultLectureById[i].credits, 
            semestre:resultLectureById[i].semestre, optativa:resultLectureById[i].optativa,
            campo_disciplinar_id:resultLectureById[i].campo_disciplinar_id,tipo_uac_id:resultLectureById[i].tipo_uac_id, 
            cecyte:resultLectureById[i].cecyte, modulo_id:resultLectureById[i].modulo_id});
      }
    } getValues();
  }, [form,resultLectureById]);


  const colProps = {
    xs: { span: 8 },
    md: { span: 4 },
  };
  
  const handleFinish = async (values) => {
    setErrorMessage(null);
    setLoading(true);
    const form = {};
    const response = await updateLecture(uacUpdate,values);
    console.log("------->response");
    console.log(response);
    if (response.success)
    {
      await getLecturesByCareer(); 
      //togglemodalUpdatetVisible();
      togglemodalUpdatetcancel();
    }
    else setErrorMessage(response.message);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };


  const validations = {
    nombre: [{ required: true, message: "¡El nombre es requerido!" }],
  };

  return (
  <Modal zIndex="1040" centered  width="100%" title="Actualizar carrera" visible={modalUpdateVisible} footer={null} onCancel={togglemodalUpdatetcancel}>
    <Form form={form} layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
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
          <Form.Item label="cecyte:" name="cecyte" rules={[{required: true }]}>
            <SearchSelect dataset={catalogs.decision} style={{ width: "90%" }}/>
          </Form.Item>
        </Col>
    </Row>

    <Row align="center" >
        <Col>
            <PrimaryButton  icon={<CheckCircleOutlined />}>Aceptar</PrimaryButton> 
        </Col>
        <Col>
            <ButtonCustom color="blue" fullWidth icon={<CheckCircleOutlined />} onClick={togglemodalUpdatetcancel}>
                Cancelar
            </ButtonCustom>
        </Col>     
    </Row>
    <Row >
      <div style={{ margin: "auto" }}>
          {loading && (
            <Alert
              message={<strong>Procesando</strong>}
              description="Favor de no cerrar esta ventana. Se esta actualizando el registro..."
              type="info"
              showIcon
            />
          )}
      </div>
    </Row>    
  </Form>
</Modal>
  );
}