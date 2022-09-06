import React, { useState } from "react";
import { Row, Col, Form, Alert, Modal} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import CatalogService from "../../service/CatalogService";
import { PrimaryButton ,ButtonCustom} from "../../shared/components";

export default function SchoolAddCareer({ modalFielVisible, toggleModalFiel, addCareerSchool,setCareerData,cct }) {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const handleFinish = async (values) => {
    setErrorMessage(null);
    setLoading(true);
    const form = {};
    const response = await addCareerSchool(form);
    if(cct!==0){
    const response2 = await CatalogService.getCareerCatalogs2(cct);  
    setCareerData(response2.careersList);
    }
    if (response.success) toggleModalFiel();
    else setErrorMessage(response.message);
    setLoading(false);
  };

  return (
    <Modal zIndex="1040" centered  width="30%" title="Confirmar petición" visible={modalFielVisible} footer={null} onCancel={toggleModalFiel}>
     <Form
        layout="vertical"
        onFinish={handleFinish}
      >
    <Row align="center" >
        <Col>
        <PrimaryButton loading={loading} icon={<CheckCircleOutlined />}>
              Aceptar
            </PrimaryButton> 
        </Col>
        <Col>   
                <ButtonCustom
                    color="blue"
                    fullWidth
                    icon={<CheckCircleOutlined />}
                    onClick={toggleModalFiel}
                >
                Cancelar
                </ButtonCustom>
        </Col>     
    </Row>
    <Row >
          {loading && (
            <Alert
              message={<strong>Procesando</strong>}
              description="Favor de no cerrar esta ventana. Se están procesando los alumnos, este proceso puede tardar varios minutos..."
              type="info"
              showIcon
            />
          )}
          {errorMessage && (
            <Col >
              <Alert
                message={<strong>Ocurrió un Error</strong>}
                description={errorMessage}
                type="error"
                showIcon
                closable
              />
            </Col>
          )}
        </Row>
    </Form>
    </Modal>
  );
}