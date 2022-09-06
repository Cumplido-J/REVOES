import React, { useState } from "react";
import { Row, Col, Form, Alert, Modal} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ButtonCustom} from "../../shared/components";
import { Typography as Text } from 'antd';


export default function StudentCertificateType({
   modalFielVisible, toggleModalFiel, setCertificateParcial, setCertificatePortabilidad, setCertificateFinal, certificate,
   setCertificateAbrogrado,statusSchool
   }) {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const handleFinish = async (values) => {
    setErrorMessage(null);
    setLoading(true);
    
  };

  const validCaertificateParcial = () => {
    toggleModalFiel();
    setCertificateParcial(true);
    setCertificatePortabilidad(false);
    setCertificateFinal(false);
    setCertificateAbrogrado(false);
  };

  const validCaertificatePortabilidad = () => {
    toggleModalFiel();
    setCertificateParcial(false);
    setCertificatePortabilidad(true);
    setCertificateFinal(false);
    setCertificateAbrogrado(false);
  };

  const validCaertificateFinal = () => {
    toggleModalFiel();
    setCertificateParcial(false);
    setCertificatePortabilidad(false);
    setCertificateFinal(true);
    setCertificateAbrogrado(false);
  };

  
  const validCaertificateAbrogrado = () => {
    toggleModalFiel();
    setCertificateParcial(false);
    setCertificatePortabilidad(false);
    setCertificateFinal(false);
    setCertificateAbrogrado(true);
  };

  /*const closeModal = () => {
    toggleModalFiel();
    setCertificateParcial(false);
    setCertificatePortabilidad(false);
    setCertificateFinal(false);
  };*/


  return (
    <Modal zIndex="1040" centered  width="35%" title="Selecciona el tipo de certificado que deseas generar" visible={modalFielVisible} footer={null} onCancel={toggleModalFiel}>
     <Form
        layout="vertical"
        onFinish={handleFinish}
      >
           { !certificate.parcial && (certificate.portabilidad === false && certificate.final === false && !certificate.abrogado)   &&(
      
            <Row align="center"  style={{marginBlockEnd:5 }}>
                    <ButtonCustom
                        color="redCDMX"
                        fullWidth
                      
                        onClick={validCaertificateParcial}
                        loading={loading}
                        icon={<CheckCircleOutlined />}
                    >
                        Certificado parcial - Calificaciones
                    </ButtonCustom>
            </Row>
          )}
          {statusSchool==1 && !certificate.portabilidad && ( !certificate.final && !certificate.parcial && !certificate.abrogado) &&(
         
            <Row align="center"  style={{marginBlockEnd:5 }}>
                <ButtonCustom
                    color="redCDMX"
                    fullWidth
                   
                    onClick={validCaertificatePortabilidad}
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Certificado portabilidad o libre transito
                  </ButtonCustom>
            
             </Row>
          )}
            {statusSchool==1 && !certificate.final && (!certificate.portabilidad && !certificate.parcial && !certificate.abrogado) &&(
           
            <Row align="center"  style={{marginBlockEnd:5 }}>
                    <ButtonCustom
                        color="redCDMX"
                        fullWidth
                      
                        onClick={validCaertificateFinal}
                        loading={loading}
                        icon={<CheckCircleOutlined />}
                      >
                        Certificado término
                    </ButtonCustom>
            </Row>
            )} 
              {!certificate.abrogado && (!certificate.portabilidad && !certificate.parcial && !certificate.final) &&(
                
                      <Row align="center"  style={{marginBlockEnd:5 }}>
                              <ButtonCustom
                                  color="redCDMX"
                                  fullWidth

                                  onClick={validCaertificateAbrogrado}
                                  loading={loading}
                                  icon={<CheckCircleOutlined />}
                                >
                                  Certificado abrogrado
                              </ButtonCustom>
                      </Row>

              )} 
            { certificate.parcial   &&(
            <Row align="center"  style={{marginBlockEnd:5 }}>
              <Text>El certificado parcial - calificaciones del alumno ya ha sido validado  o esta en proceso.<br/> Sí desea
              modificar o realizar un certificado termino o portabilidad libre transito deberá cancelar el mismo.
              </Text>
            </Row>
            )}
            { certificate.portabilidad   &&(
            <Row align="center"  style={{marginBlockEnd:5 }}>
                    <Text>El certificado portabilidad o libre transito del alumno ya ha sido validado  o esta en proceso.<br/>
                      Si desea modificar o realizar un certificado parcial o termino deberá cancelar el actual.</Text>
            </Row>
            )}
            { certificate.final   &&(
            <Row align="center"  style={{marginBlockEnd:5 }}>
                    <Text>El certificado término del alumno ya ha sido validado  o esta en proceso.<br/>
                      Si desea modificar o realizar un certificado parcial o portabilidad libre transito deberá cancelar el actual.</Text>
            </Row>
            )}
            { certificate.abrogado   &&(
            <Row align="center"  style={{marginBlockEnd:5 }}>
                    <Text>El certificado abrogado del alumno ya ha sido validado  o esta en proceso.<br/>
                      Si desea modificar o realizar un certificado parcial, portabilidad libre transito o termino deberá cancelar el actual.</Text>
            </Row>
            )}
           
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